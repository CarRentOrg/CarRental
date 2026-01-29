import { supabase } from '../config/supabase';

export class StatsService {
    async getDashboardStats() {
        // Run parallel queries for efficiency
        const [carsResult, bookingsResult] = await Promise.all([
            supabase.from('cars').select('id', { count: 'exact', head: true }),
            supabase.from('bookings').select('total_price')
        ]);

        const activeFleet = carsResult.count || 0;
        const bookings = bookingsResult.data;

        // Calculate revenue manually
        // We use type assertion here to fix the issue where TS incorrectly infers 'never' for the bookings data
        const revenue = (bookings as { total_price: number }[] | null)?.reduce(
            (acc, curr) => acc + (curr.total_price || 0),
            0
        ) || 0;

        const totalBookings = bookings?.length || 0;

        // Pseudo-random new customers for now
        const newCustomers = 12;

        return {
            revenue,
            bookings: totalBookings,
            activeFleet,
            newCustomers
        };
    }
}

export const statsService = new StatsService();
