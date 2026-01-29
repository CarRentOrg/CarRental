import { Database } from './src/types/supabase';
type T = Database['public']['Tables']['car_requests']['Row'];
const x: T = {
    id: '1',
    user_name: 'test',
    user_email: 'test@example.com',
    car_model: 'test',
    message: 'test',
    created_at: '2021-01-01'
};
console.log(x);
