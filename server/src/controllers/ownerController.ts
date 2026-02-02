import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { Database } from '../types/supabase';
import { uploadToImageKit } from '../utils/imageUpload';

type UserRow = Database['public']['Tables']['users']['Row'];
type CarRow = Database['public']['Tables']['cars']['Row'];

export const changeRoleToOwner = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { error } = await (supabase.from('users') as any)
            .update({ role: 'owner' })
            .eq('id', req.user.id);

        if (error) throw error;
        res.status(200).json({ success: true, message: 'Role updated to owner' });
    } catch (error) {
        next(error);
    }
};

export const addCar = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Simple car adding logic
        const { brand, model, year, price_per_day } = req.body;
        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadToImageKit(req.file, '/cars');
        }

        const { data, error } = await (supabase.from('cars') as any)
            .insert({
                brand,
                model,
                year,
                price_per_day,
                image_url: imageUrl,
                is_available: true
            })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ success: true, car: data });
    } catch (error) {
        next(error);
    }
};

export const getOwnerCars = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { data: cars, error } = await supabase
            .from('cars')
            .select('*'); // Should ideally filter by owner_id if available

        if (error) throw error;
        res.status(200).json({ success: true, data: cars });
    } catch (error) {
        next(error);
    }
};

export const toggleCarAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { carId, isAvailable } = req.body;
        const { error } = await (supabase.from('cars') as any)
            .update({ is_available: isAvailable })
            .eq('id', carId);

        if (error) throw error;
        res.status(200).json({ success: true, message: 'Availability toggled' });
    } catch (error) {
        next(error);
    }
};

export const deleteCar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { carId } = req.body;
        const { error } = await supabase
            .from('cars')
            .delete()
            .eq('id', carId);

        if (error) throw error;
        res.status(200).json({ success: true, message: 'Car deleted' });
    } catch (error) {
        next(error);
    }
};

export const getDashboardData = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Mock dashboard data for now
        res.status(200).json({
            success: true,
            data: {
                totalCars: 5,
                totalBookings: 12,
                totalRevenue: 2500
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserImage = async (req: any, res: Response, next: NextFunction) => {
    try {
        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadToImageKit(req.file, '/users');
        }
        // Logic to update user image in database
        res.status(200).json({ success: true, message: 'Image updated', imageUrl });
    } catch (error) {
        next(error);
    }
};
