import sql from '../config/postgres';
import { supabase } from '../config/supabase';
import { imagekit } from '../config/imagekit';



// Example: Test the connection
export async function testDatabaseConnection() {
    console.log('🔍 Starting database connection tests...');

    // Test 1: Direct Postgres Connection
    try {
        const result = await sql`SELECT NOW() as current_time`;
        console.log('✅ Direct Database connected successfully:', result[0].current_time);
    } catch (error: any) {
        console.error('❌ Direct Database connection failed:', error.message || error);
        if (error.code === 'ENOTFOUND') {
            console.warn('   👉 Hint: Hostname not found. Check if your DATABASE_URL is correct or if your internet is restricted.');
        }
    }

    // Test 2: Supabase Client Connection
    try {
        const { data, error } = await supabase.from('cars').select('id').limit(1);
        if (error) {
            console.warn('⚠️ Supabase API connection warning:', error.message);
        } else {
            console.log('✅ Supabase API connected successfully (Cars table accessible)');
        }
    } catch (error: any) {
        console.error('❌ Supabase API connection failed:', error.message || error);
    }

    // Test 3: ImageKit Connection
    try {
        await imagekit.assets.list({ limit: 1 });
        console.log('✅ ImageKit connected successfully');
    } catch (ikError: any) {
        console.warn('⚠️ ImageKit connection warning:', ikError.message || ikError);
    }

    return true;
}



// Example: Get all cars using raw SQL
export async function getCarsRaw() {
    try {
        const cars = await sql`
            SELECT * FROM cars 
            WHERE is_available = true 
            ORDER BY created_at DESC
        `;
        return cars;
    } catch (error) {
        console.error('Error fetching cars:', error);
        throw error;
    }
}

// Example: Create a booking using raw SQL
export async function createBookingRaw(bookingData: {
    car_id: string;
    user_id: string;
    start_date: string;
    end_date: string;
    total_price: number;
}) {
    try {
        const [booking] = await sql`
            INSERT INTO bookings (car_id, user_id, start_date, end_date, total_price, status)
            VALUES (${bookingData.car_id}, ${bookingData.user_id}, ${bookingData.start_date}, ${bookingData.end_date}, ${bookingData.total_price}, 'pending')
            RETURNING *
        `;
        return booking;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

// Example: Get booking statistics
export async function getBookingStats() {
    try {
        const [stats] = await sql`
            SELECT 
                COUNT(*) as total_bookings,
                SUM(total_price) as total_revenue,
                COUNT(DISTINCT car_id) as cars_booked
            FROM bookings
            WHERE status = 'confirmed'
        `;
        return stats;
    } catch (error) {
        console.error('Error fetching booking stats:', error);
        throw error;
    }
}
