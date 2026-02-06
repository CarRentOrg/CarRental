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

