import { Car, Booking } from '@/types';
import { supabase } from '@/lib/supabase';

const API_Base_URL = 'http://localhost:3001/api';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: HeadersInit = {
        ...options.headers,
    };

    // Only set Content-Type if not FormData (fetch sets correctly for FormData)
    if (!(options.body instanceof FormData)) {
        (headers as any)['Content-Type'] = 'application/json';
    }

    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
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
    auth: {
        login: (data: any) => fetchAPI<any>('/user/login', { method: 'POST', body: JSON.stringify(data) }),
        register: (data: any) => fetchAPI<any>('/user/register', { method: 'POST', body: JSON.stringify(data) }),
        getMe: () => fetchAPI<any>('/user/data'),
    },
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
    },
    owner: {
        addCar: (formData: FormData) => fetchAPI<any>('/owner/add-car', { method: 'POST', body: formData }),
        getCars: () => fetchAPI<any[]>('/owner/cars'),
        getDashboard: () => fetchAPI<any>('/owner/dashboard'),
        updateImage: (formData: FormData) => fetchAPI<any>('/owner/update-image', { method: 'POST', body: formData }),
        deleteCar: (id: string) => fetchAPI<any>('/owner/delete-car', { method: 'POST', body: JSON.stringify({ carId: id }) }),
        changeRoleToOwner: () => fetchAPI<any>('/owner/change-role', { method: 'POST' }),
    }
};
