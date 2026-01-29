import { supabase } from '../config/supabase';
import { Database } from '../types/supabase';

type News = Database['public']['Tables']['news']['Row'];
type NewsInsert = Database['public']['Tables']['news']['Insert'];
type NewsUpdate = Database['public']['Tables']['news']['Update'];

export class NewsService {
    async getAllNews(): Promise<News[]> {
        const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    }

    async getNewsById(id: string): Promise<News | null> {
        const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    }

    async createNews(newsData: NewsInsert): Promise<News> {
        const { data, error } = await (supabase.from('news') as any).insert(newsData).select().single();
        if (error) throw error;
        return data;
    }

    async updateNews(id: string, newsData: NewsUpdate): Promise<News> {
        const { data, error } = await (supabase.from('news') as any).update(newsData).eq('id', id).select().single();
        if (error) throw error;
        return data;
    }

    async deleteNews(id: string): Promise<void> {
        const { error } = await supabase.from('news').delete().eq('id', id);
        if (error) throw error;
    }
}

export const newsService = new NewsService();
