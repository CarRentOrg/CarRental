import { supabase } from '../config/supabase';
import { Database } from '../types/supabase';

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

export class BookingService {
    async getAllBookings(): Promise<Booking[]> {
        const { data, error } = await supabase.from('bookings').select('*');
        if (error) throw error;
        return data || [];
    }

    async getBookingById(id: string): Promise<Booking | null> {
        const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    }

    async createBooking(bookingData: BookingInsert): Promise<Booking> {
        const { data, error } = await (supabase.from('bookings') as any).insert(bookingData).select().single();
        if (error) throw error;
        return data;
    }

    async updateBooking(id: string, bookingData: BookingUpdate): Promise<Booking> {
        const { data, error } = await (supabase.from('bookings') as any).update(bookingData).eq('id', id).select().single();
        if (error) throw error;
        return data;
    }

    async deleteBooking(id: string): Promise<void> {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) throw error;
    }
}

export const bookingService = new BookingService();
