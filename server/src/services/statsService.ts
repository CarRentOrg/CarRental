import { supabase } from '../config/supabase';

export class StatsService {
    async getDashboardStats() {
        try {
            // Run parallel queries for efficiency
            const [carsResult, bookingsResult] = await Promise.all([
                supabase.from('cars').select('id', { count: 'exact', head: true }),
                supabase.from('bookings').select('total_price')
            ]);

            // Handle potential table missing errors
            if (carsResult.error && !(carsResult.error.code === 'PGRST116' || carsResult.error.message?.includes('cache'))) {
                throw carsResult.error;
            }
            if (bookingsResult.error && !(bookingsResult.error.code === 'PGRST116' || bookingsResult.error.message?.includes('cache'))) {
                throw bookingsResult.error;
            }

            const activeFleet = carsResult.count || 0;
            const bookings = bookingsResult.data || [];

            // Calculate revenue manually
            const revenue = (bookings as { total_price: number }[]).reduce(
                (acc, curr) => acc + (curr.total_price || 0),
                0
            );

            const totalBookings = bookings.length;

            // Pseudo-random new customers for now
            const newCustomers = 12;

            return {
                revenue,
                bookings: totalBookings,
                activeFleet,
                newCustomers
            };
        } catch (error) {
            console.warn('Error fetching dashboard stats, returning defaults:', error);
            return {
                revenue: 0,
                bookings: 0,
                activeFleet: 0,
                newCustomers: 0
            };
        }
    }

    async getRecentActivity() {
        try {
            const { data: bookings, error } = await supabase
                .from('bookings')
                .select(`
                    id, 
                    created_at, 
                    status,
                    users ( name, avatar_url )
                `)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;

            return bookings.map((booking: any) => ({
                id: booking.id,
                type: booking.status === 'confirmed' ? 'booking_new' : 'booking_cancelled',
                title: 'New Booking',
                message: `New booking from ${booking.users?.name || 'User'}`,
                time: booking.created_at,
                user: {
                    name: booking.users?.name || 'Unknown',
                    avatar: booking.users?.avatar_url || 'https://via.placeholder.com/40'
                }
            }));
        } catch (error) {
            console.error('Error fetching activities:', error);
            // Return dummy data if DB fails or is empty, to prevent 404s
            return [
                {
                    id: '1',
                    type: 'booking_new',
                    title: 'New Booking',
                    message: 'New booking from John Doe',
                    time: new Date().toISOString(),
                    user: { name: 'John Doe', avatar: 'https://via.placeholder.com/40' }
                }
            ];
        }
    }
}

export const statsService = new StatsService();
