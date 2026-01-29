import { supabase } from '../config/supabase';
import { Database } from '../types/supabase';

type Car = Database['public']['Tables']['cars']['Row'];
type CarInsert = Database['public']['Tables']['cars']['Insert'];
type CarUpdate = Database['public']['Tables']['cars']['Update'];

export class CarService {
    async getAllCars(): Promise<Car[]> {
        const { data, error } = await supabase.from('cars').select('*');
        if (error) throw error;
        return data || [];
    }

    async getCarById(id: string): Promise<Car | null> {
        const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    }

    async createCar(carData: CarInsert): Promise<Car> {
        const { data, error } = await (supabase.from('cars') as any).insert(carData).select().single();
        if (error) throw error;
        return data;
    }

    async updateCar(id: string, carData: CarUpdate): Promise<Car> {
        const { data, error } = await (supabase.from('cars') as any).update(carData).eq('id', id).select().single();
        if (error) throw error;
        return data;
    }

    async deleteCar(id: string): Promise<void> {
        const { error } = await supabase.from('cars').delete().eq('id', id);
        if (error) throw error;
    }
}

export const carService = new CarService();
