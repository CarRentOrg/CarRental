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
            const newCustomers = 120;

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
            const { data: cars, error } = await supabase
                .from('cars')
                .select(`
                id,
                created_at,
                status,
            `)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;

            return cars.map((car: any) => {
                let type = 'cars_update';
                let title = 'Car Update';
                let message = '';

                switch (car.status) {
                    case 'available':
                        type = 'cars_available';
                        title = 'Car Available';
                        message = 'A car is now available for rent';
                        break;

                    case 'rented':
                        type = 'cars_rented';
                        title = 'Car Rented';
                        message = 'A car has been rented';
                        break;

                    case 'maintenance':
                        type = 'cars_maintenance';
                        title = 'Car in Maintenance';
                        message = 'A car is under maintenance';
                        break;
                }

                return {
                    id: car.id,
                    type,
                    title,
                    message: `${message} by ${car.users?.name || 'User'}`,
                    time: car.created_at,
                    user: {
                        name: car.users?.name || 'Unknown',
                        avatar: car.users?.avatar_url || 'https://via.placeholder.com/40'
                    }
                };
            });
        } catch (error) {
            console.error('Error fetching activities:', error);

            return [
                {
                    id: '1',
                    type: 'cars_rented',
                    title: 'Car Rented',
                    message: 'A car has been rented by John Doe',
                    time: new Date().toISOString(),

                }
            ];
        }
    }

}

export const statsService = new StatsService();
