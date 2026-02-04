import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { Database } from '../types/supabase';
import { uploadToImageKit } from '../utils/imageUpload';

type UserRow = Database['public']['Tables']['users']['Row'];
type CarRow = Database['public']['Tables']['cars']['Row'];
type BookingRow = Database['public']['Tables']['bookings']['Row'];

// Helper to access req.user reliably
interface AuthenticatedRequest extends Request {
    user?: any;
}

export const changeRoleToOwner = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { error } = await (supabase.from('users') as any)
            .update({ role: 'owner' })
            .eq('id', userId);

        if (error) throw error;
        res.status(200).json({ success: true, message: 'Role updated to owner' });
    } catch (error) {
        next(error);
    }
};

export const addCar = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        let carData: any = {};

        // Handle both JSON-parsed body and direct fields (multipart/form-data)
        if (req.body.carData) {
            try {
                carData = JSON.parse(req.body.carData);
            } catch (e) {
                return res.status(400).json({ success: false, message: 'Invalid carData JSON' });
            }
        } else {
            carData = req.body;
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadToImageKit(req.file, '/cars');
        }

        // Map frontend fields to DB fields
        const carInsertData = {
            brand: carData.brand || carData.name?.split(' ')[0] || 'Unknown',
            model: carData.model || carData.name?.split(' ').slice(1).join(' ') || 'Unknown',
            year: carData.year,
            price_per_day: carData.price_per_day,
            transmission: carData.transmission,
            fuel_type: carData.fuel_type,
            seats: carData.seats,
            description: carData.description,
            type: carData.type,
            image_url: imageUrl,
            is_available: true,
            owner_id: userId
        };

        const { data, error } = await (supabase.from('cars') as any)
            .insert(carInsertData)
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ success: true, message: 'Car added successfully', car: data });
    } catch (error) {
        next(error);
    }
};

export const getOwnerCars = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        // Need to cast to any or fix types to support owner_id filtering if strict typing fails
        const { data: cars, error } = await (supabase.from('cars') as any)
            .select('*')
            .eq('owner_id', userId);

        if (error) throw error;
        res.status(200).json({ success: true, cars });
    } catch (error) {
        next(error);
    }
};

export const toggleCarAvailability = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { carId } = req.body;

        if (!carId) {
            return res.status(400).json({ success: false, message: 'Car ID is required' });
        }

        // 1. Get current status and verify ownership
        const { data: car, error: fetchError } = await (supabase.from('cars') as any)
            .select('id, is_available')
            .eq('id', carId)
            .eq('owner_id', userId)
            .single();

        if (fetchError || !car) {
            return res.status(404).json({ success: false, message: 'Car not found or unauthorized' });
        }

        // 2. Toggle
        const { error: updateError } = await (supabase.from('cars') as any)
            .update({ is_available: !car.is_available })
            .eq('id', carId);

        if (updateError) throw updateError;

        res.status(200).json({ success: true, message: 'Availability Toggled' });
    } catch (error) {
        next(error);
    }
};

export const deleteCar = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { carId } = req.body;

        if (!carId) {
            return res.status(400).json({ success: false, message: 'Car ID is required' });
        }

        // Verify ownership first
        const { data: car, error: fetchError } = await (supabase.from('cars') as any)
            .select('id')
            .eq('id', carId)
            .eq('owner_id', userId)
            .single();

        if (fetchError || !car) {
            return res.status(404).json({ success: false, message: 'Car not found or unauthorized' });
        }

        // Soft delete: set owner_id to null and is_available to false
        const { error } = await (supabase.from('cars') as any)
            .update({ owner_id: null, is_available: false })
            .eq('id', carId);

        if (error) throw error;
        res.status(200).json({ success: true, message: 'Car deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const getDashboardData = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole !== 'owner' && userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not an owner' });
        }

        // Parallel queries
        const [carsRes, bookingsRes] = await Promise.all([
            (supabase.from('cars') as any).select('id').eq('owner_id', userId),
            (supabase.from('bookings') as any) // Assuming bookings have owner_id or linked via car. 
                // Current bookings table doesn't have owner_id directly on booking, 
                // usually it's linked via car_id -> cars.owner_id.
                // But let's check if we can filter bookings by car.owner_id in one go.
                // Supabase (PostgREST) supports filtering on related tables.
                .select('*, cars!inner(owner_id)')
                .eq('cars.owner_id', userId)
                .order('created_at', { ascending: false })
        ]);

        if (carsRes.error) throw carsRes.error;
        if (bookingsRes.error) throw bookingsRes.error;

        const cars = carsRes.data || [];
        const bookings = bookingsRes.data || [];

        const pendingBookings = bookings.filter((b: any) => b.status === 'pending');
        const completedBookings = bookings.filter((b: any) => b.status === 'confirmed');

        // Calculate Monthly Revenue
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyRevenue = bookings
            .filter((booking: any) =>
                booking.status === 'confirmed' &&
                new Date(booking.created_at) >= startOfMonth
            )
            .reduce((acc: number, booking: any) => acc + (booking.total_price || 0), 0);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 3),
            monthlyRevenue
        };

        res.status(200).json({ success: true, dashboardData });
    } catch (error) {
        console.error("Dashboard error:", error);
        // Fallback if joined query fails (e.g. foreign key issues)
        // We might try fetching all cars then all bookings for those car IDs
        next(error);
    }
};

export const updateUserImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;

        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadToImageKit(req.file, '/users');
        } else {
            return res.status(400).json({ success: false, message: 'No image provided' });
        }

        // Update user avatar
        const { error } = await (supabase.from('users') as any)
            .update({ avatar_url: imageUrl })
            .eq('id', userId);

        if (error) throw error;

        res.status(200).json({ success: true, message: 'User image updated successfully', imageUrl });
    } catch (error) {
        next(error);
    }
};
