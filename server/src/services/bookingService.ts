import { supabase } from '../config/supabase';
import { Database } from '../types/supabase';

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

export class BookingService {
    async getAllBookings(filters: {
        status?: string,
        car_id?: string,
        page?: number,
        limit?: number
    } = {}): Promise<any[]> {
        let query = supabase.from('bookings').select('*, car:cars(*), user:profiles(*)');

        if (filters.status) query = query.eq('status', filters.status);
        if (filters.car_id) query = query.eq('car_id', filters.car_id);

        if (filters.page && filters.limit) {
            const from = (filters.page - 1) * filters.limit;
            const to = from + filters.limit - 1;
            query = query.range(from, to);
        }

        const { data, error } = await query;
        if (error) {
            if (error.code === 'PGRST116' || error.message?.includes('cache')) return [];
            throw error;
        }
        return data || [];
    }

    async getBookingById(id: string): Promise<Booking | null> {
        try {
            const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
            if (error) {
                if (error.code === 'PGRST116' || error.message?.includes('cache')) return null;
                throw error;
            }
            return data;
        } catch (err) { return null; }
    }

    async createBooking(bookingData: BookingInsert): Promise<Booking> {
        const { data, error } = await (supabase.from('bookings') as any).insert(bookingData).select().single();
        if (error) {
            if (error.message?.includes('cache') || error.message?.includes('not found')) {
                throw new Error('Bookings table is not created in Supabase.');
            }
            throw error;
        }
        return data;
    }

    async updateBooking(id: string, bookingData: BookingUpdate): Promise<Booking> {
        const { data, error } = await (supabase.from('bookings') as any).update(bookingData).eq('id', id).select().single();
        if (error) {
            if (error.message?.includes('cache') || error.message?.includes('not found')) {
                throw new Error('Bookings table is not created in Supabase.');
            }
            throw error;
        }
        return data;
    }

    async deleteBooking(id: string): Promise<void> {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error && (error.message?.includes('cache') || error.message?.includes('not found'))) return;
        if (error) throw error;
    }
}

export const bookingService = new BookingService();
