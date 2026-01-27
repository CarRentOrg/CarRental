import { supabase } from './supabase';
import { Car } from '@/types';

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
