import { supabase } from '../config/supabase';
import { Database } from '../types/supabase';

type Car = Database['public']['Tables']['cars']['Row'];
type CarInsert = Database['public']['Tables']['cars']['Insert'];
type CarUpdate = Database['public']['Tables']['cars']['Update'];

export class CarService {
    async getAllCars(filters: {
        brand?: string,
        model?: string,
        transmission?: string,
        fuel?: string,
        is_available?: boolean,
        page?: number,
        limit?: number
    } = {}): Promise<Car[]> {
        let query = supabase.from('cars').select('*');

        if (filters.brand) query = query.ilike('brand', `%${filters.brand}%`);
        if (filters.model) query = query.ilike('model', `%${filters.model}%`);
        if (filters.transmission) query = query.eq('transmission', filters.transmission);
        if (filters.fuel) query = query.eq('fuel', filters.fuel);
        if (filters.is_available !== undefined) query = query.eq('is_available', filters.is_available);

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

    async getCarById(id: string): Promise<Car | null> {
        try {
            const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
            if (error) {
                if (error.code === 'PGRST116' || error.message?.includes('cache')) return null;
                throw error;
            }
            return data;
        } catch (err) { return null; }
    }

    async createCar(carData: CarInsert): Promise<Car> {
        const { data, error } = await (supabase.from('cars') as any).insert(carData).select().single();
        if (error) {
            if (error.message?.includes('cache') || error.message?.includes('not found')) {
                throw new Error('Cars table is not created in Supabase.');
            }
            throw error;
        }
        return data;
    }

    async updateCar(id: string, carData: CarUpdate): Promise<Car> {
        const { data, error } = await (supabase.from('cars') as any).update(carData).eq('id', id).select().single();
        if (error) {
            if (error.message?.includes('cache') || error.message?.includes('not found')) {
                throw new Error('Cars table is not created in Supabase.');
            }
            throw error;
        }
        return data;
    }

    async deleteCar(id: string): Promise<void> {
        const { error } = await supabase.from('cars').delete().eq('id', id);
        if (error && (error.message?.includes('cache') || error.message?.includes('not found'))) return;
        if (error) throw error;
    }
}

export const carService = new CarService();
