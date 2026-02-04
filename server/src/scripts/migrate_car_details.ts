
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL is not defined');
    process.exit(1);
}

// Ensure SSL is used
const sql = postgres(connectionString, {
    ssl: 'require'
});

export async function migrateCarDetails() {
    console.log('🔄 Starting migration for car_details table with SSL...');
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS car_details (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
                image_gallery JSONB DEFAULT '[]'::jsonb,
                price_rate JSONB DEFAULT '{}'::jsonb,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(car_id)
            );
        `;
        console.log('✅ car_details table created successfully.');
    } catch (error: any) {
        console.error('❌ Migration failed:', error);
        if (error.message.includes('password authentication failed')) {
            console.error('Check your database password.');
        }
    } finally {
        await sql.end();
        process.exit();
    }
}

migrateCarDetails();
