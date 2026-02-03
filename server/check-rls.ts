
import sql from './src/config/postgres';

async function checkRLS() {
    try {
        console.log('Checking RLS policies for table "cars"...');
        const policies = await sql`SELECT * FROM pg_policies WHERE tablename = 'cars'`;
        console.log('Policies for "cars":', JSON.stringify(policies, null, 2));

        const rlsEnabled = await sql`SELECT relname, relrowsecurity FROM pg_class WHERE oid = 'public.cars'::regclass`;
        console.log('RLS Status for "cars":', JSON.stringify(rlsEnabled, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error checking RLS:', error);
        process.exit(1);
    }
}

checkRLS();
