import { Car, Booking, NewsPost } from "@/types";

const API_Base_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    ...options.headers,
  };

  // Only set Content-Type if not FormData (fetch sets correctly for FormData)
  if (!(options.body instanceof FormData)) {
    (headers as any)["Content-Type"] = "application/json";
  }

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_Base_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "An error occurred");
  }

  const json = await res.json();
  return json.data || json;
}

export const api = {
  auth: {
    login: (data: any) =>
      fetchAPI<any>("/user/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    register: (data: any) =>
      fetchAPI<any>("/user/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getMe: () => fetchAPI<any>("/user/data"),
    changePassword: (data: any) =>
      fetchAPI<any>("/user/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  cars: {
    getAll: () => fetchAPI<Car[]>("/cars"),
    getById: (id: string) => fetchAPI<Car>(`/cars/${id}`),
    create: (data: Partial<Car>) =>
      fetchAPI<Car>("/cars", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Car>) =>
      fetchAPI<Car>(`/cars/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) => fetchAPI<void>(`/cars/${id}`, { method: "DELETE" }),
  },
  bookings: {
    getAll: () => fetchAPI<Booking[]>("/bookings"),
    getById: (id: string) => fetchAPI<Booking>(`/bookings/${id}`),
    create: (data: Partial<Booking>) =>
      fetchAPI<Booking>("/bookings", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Booking>) =>
      fetchAPI<Booking>(`/bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/bookings/${id}`, { method: "DELETE" }),
    approve: (id: string) =>
      fetchAPI<Booking>(`/bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "confirmed" }),
      }),
    reject: (id: string) =>
      fetchAPI<Booking>(`/bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "cancelled" }),
      }),
  },
  stats: {
    getDashboard: () =>
      fetchAPI<{
        revenue: number;
        bookings: number;
        activeFleet: number;
        newCustomers: number;
      }>("/stats/dashboard"),
    getRecentActivity: () => fetchAPI<any[]>("/stats/activity"),
  },
  customers: {
    getAll: (params?: { page?: number; limit?: number }) =>
      fetchAPI<any>("/customers", {
        method: "GET",
        // In a real app, you'd convert params to query string
      }),
  },
  news: {
    getAll: () => fetchAPI<NewsPost[]>("/news"),
    getById: (id: string) => fetchAPI<NewsPost>(`/news/${id}`),
    create: (data: Partial<NewsPost>) =>
      fetchAPI<NewsPost>("/news", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<NewsPost>) =>
      fetchAPI<NewsPost>(`/news/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) => fetchAPI<void>(`/news/${id}`, { method: "DELETE" }),
  },
  owner: {
    addCar: (formData: FormData) =>
      fetchAPI<any>("/owner/add-car", { method: "POST", body: formData }),
    getCars: () => fetchAPI<any[]>("/owner/cars"),
    getDashboard: () => fetchAPI<any>("/owner/dashboard"),
    updateImage: (formData: FormData) =>
      fetchAPI<any>("/owner/update-image", { method: "POST", body: formData }),
    deleteCar: (id: string) =>
      fetchAPI<any>("/owner/delete-car", {
        method: "POST",
        body: JSON.stringify({ carId: id }),
      }),
    changeRoleToOwner: () =>
      fetchAPI<any>("/owner/change-role", { method: "POST" }),
  },
  requests: {
    getAll: () => fetchAPI<any[]>("/requests"),
    create: (data: any) =>
      fetchAPI<any>("/requests", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      fetchAPI<any>(`/requests/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    delete: (id: string) => fetchAPI<void>(`/requests/${id}`, { method: "DELETE" }),
  },
};
