const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRequest() {
    console.log('Inserting test car request...');
    const { data, error } = await supabase
        .from('car_requests')
        .insert([
            {
                user_name: 'Debug Bot',
                user_email: 'debug@test.com',
                car_model: 'Tesla Model S',
                message: 'Testing backend connection'
            }
        ]);

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Success! Record inserted.');

        console.log('Fetching requests...');
        const { data: list, error: fetchError } = await supabase
            .from('car_requests')
            .select('*');

        if (fetchError) {
            console.error('Fetch Error:', fetchError.message);
        } else {
            console.log(`Total car requests in DB: ${list.length}`);
        }
    }
}

checkRequest();
