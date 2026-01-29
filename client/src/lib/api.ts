import { Car, Booking } from '@/types';
import { supabase } from '@/lib/supabase';

const API_Base_URL = 'http://localhost:3001/api';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (session?.access_token) {
        (headers as any)['Authorization'] = `Bearer ${session.access_token}`;
    }

    const res = await fetch(`${API_Base_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'An error occurred');
    }

    const json = await res.json();
    return json.data || json;
}

export const api = {
    cars: {
        getAll: () => fetchAPI<Car[]>('/cars'),
        getById: (id: string) => fetchAPI<Car>(`/cars/${id}`),
        create: (data: Partial<Car>) => fetchAPI<Car>('/cars', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: Partial<Car>) => fetchAPI<Car>(`/cars/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => fetchAPI<void>(`/cars/${id}`, { method: 'DELETE' }),
    },
    bookings: {
        getAll: () => fetchAPI<Booking[]>('/bookings'),
        getById: (id: string) => fetchAPI<Booking>(`/bookings/${id}`),
        create: (data: Partial<Booking>) => fetchAPI<Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: Partial<Booking>) => fetchAPI<Booking>(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => fetchAPI<void>(`/bookings/${id}`, { method: 'DELETE' }),
    },
    stats: {
        getDashboard: () => fetchAPI<{
            revenue: number;
            bookings: number;
            activeFleet: number;
            newCustomers: number;
        }>('/stats/dashboard'),
    },
    news: {
        getAll: () => fetchAPI<any[]>('/news'),
        getById: (id: string) => fetchAPI<any>(`/news/${id}`),
        create: (data: any) => fetchAPI<any>('/news', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => fetchAPI<any>(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => fetchAPI<void>(`/news/${id}`, { method: 'DELETE' }),
    }
};
