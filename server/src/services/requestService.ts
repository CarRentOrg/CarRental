import { supabase } from '../config/supabase';
import { Database } from '../types/supabase';

type CarRequest = Database['public']['Tables']['car_requests']['Row'];
type CarRequestInsert = Database['public']['Tables']['car_requests']['Insert'];
type CarRequestUpdate = Database['public']['Tables']['car_requests']['Update'];

export class RequestService {
    async getAllRequests(): Promise<CarRequest[]> {
        const { data, error } = await supabase
            .from('car_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            if (error.code === 'PGRST116' || error.message?.includes('cache')) return [];
            throw error;
        }
        return data || [];
    }

    async createRequest(requestData: CarRequestInsert): Promise<CarRequest> {
        const { data, error } = await (supabase.from('car_requests') as any)
            .insert(requestData)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateRequestStatus(id: string, status: string): Promise<CarRequest> {
        const { data, error } = await (supabase.from('car_requests') as any)
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteRequest(id: string): Promise<void> {
        const { error } = await supabase.from('car_requests').delete().eq('id', id);
        if (error) throw error;
    }
}

export const requestService = new RequestService();
