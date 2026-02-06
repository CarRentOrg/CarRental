import { supabase } from '../config/supabase';

export class StatsService {
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
