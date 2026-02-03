import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Database } from '../types/supabase';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl) console.error('❌ SUPABASE_URL is missing');
if (!supabaseKey) console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing');

if (supabaseKey.includes('service_role') || (process.env.SUPABASE_SERVICE_ROLE_KEY && supabaseKey === process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    console.log('✅ Supabase initialized with SERVICE_ROLE key');
} else {
    console.warn('⚠️ Supabase initialized with ANON key (RLS will be active)');
}

export const supabase = createClient<Database, 'public'>(supabaseUrl, supabaseKey);

