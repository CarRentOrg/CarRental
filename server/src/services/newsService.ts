import { supabase } from '../config/supabase';
import { Database } from '../types/supabase';

type News = Database['public']['Tables']['news']['Row'];
type NewsInsert = Database['public']['Tables']['news']['Insert'];
type NewsUpdate = Database['public']['Tables']['news']['Update'];

export class NewsService {
    async getAllNews(filters: {
        page?: number,
        limit?: number
    } = {}): Promise<News[]> {
        let query = supabase.from('news').select('*').order('created_at', { ascending: false });

        if (filters.page && filters.limit) {
            const from = (filters.page - 1) * filters.limit;
            const to = from + filters.limit - 1;
            query = query.range(from, to);
        }

        const { data, error } = await query;

        if (error) {
            // Handle "Table not found" gracefully to prevent 500 errors
            if (error.code === 'PGRST116' || error.message?.includes('cache')) {
                console.warn('News table not found in Supabase. Returning empty array.');
                return [];
            }
            throw error;
        }
        return data || [];
    }

    async getNewsById(id: string): Promise<News | null> {
        try {
            const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
            if (error) {
                if (error.code === 'PGRST116' || error.message?.includes('cache')) return null;
                throw error;
            }
            return data;
        } catch (error) {
            return null;
        }
    }

    async createNews(newsData: NewsInsert): Promise<News> {
        const { data, error } = await (supabase.from('news') as any).insert(newsData).select().single();
        if (error) {
            if (error.message?.includes('cache') || error.message?.includes('not found')) {
                throw new Error('News table is not created in Supabase. Please follow the SQL instructions.');
            }
            throw error;
        }
        return data;
    }

    async updateNews(id: string, newsData: NewsUpdate): Promise<News> {
        const { data, error } = await (supabase.from('news') as any).update(newsData).eq('id', id).select().single();
        if (error) {
            if (error.message?.includes('cache') || error.message?.includes('not found')) {
                throw new Error('News table is not created in Supabase.');
            }
            throw error;
        }
        return data;
    }

    async deleteNews(id: string): Promise<void> {
        const { error } = await supabase.from('news').delete().eq('id', id);
        if (error && (error.message?.includes('cache') || error.message?.includes('not found'))) {
            // If table is missing, deletion is technically "successful" as in nothing to delete
            return;
        }
        if (error) throw error;
    }
}

export const newsService = new NewsService();
