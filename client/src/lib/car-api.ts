import { supabase } from './supabase';
import { Car, NewsPost, Booking } from '@/types';

export async function getCars(): Promise<Car[]> {
    const { data, error } = await supabase
        .from('cars')
        .select('*');

    if (error) {
        console.error('Error fetching cars:', error);
        return [];
    }

    return data || [];
}

export async function getCarById(id: string): Promise<Car | null> {
    const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching car by id:', error);
        return null;
    }

    return data;
}

export async function createCar(car: Omit<Car, 'id' | 'created_at'>): Promise<Car | null> {
    const { data, error } = await supabase
        .from('cars')
        .insert([car])
        .select()
        .single();

    if (error) {
        console.error('Error creating car:', error);
        return null;
    }

    return data;
}

export async function requestCar(request: { user_name: string, user_email: string, car_model: string, message: string }): Promise<boolean> {
    const { error } = await supabase
        .from('car_requests')
        .insert([request]);

    if (error) {
        console.error('Error submitting car request:', error);
        return false;
    }

    return true;
}

export async function getNews(): Promise<NewsPost[]> {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching news:', error);
        return [];
    }

    return data || [];
}

export async function createNewsPost(post: Omit<NewsPost, 'id' | 'created_at'>): Promise<NewsPost | null> {
    const { data, error } = await supabase
        .from('news')
        .insert([post])
        .select()
        .single();

    if (error) {
        console.error('Error creating news post:', error);
        return null;
    }

    return data;
}

export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'car'>): Promise<Booking | null> {
    const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single();

    if (error) {
        console.error('Error creating booking:', error);
        return null;
    }

    return data;
}
