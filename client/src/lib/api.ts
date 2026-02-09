import { Car, Booking, User } from "@/types";

export const API_Base_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface GetMeResponse {
  user: User;
}
export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface DashboardStats {
  totalCars: number;
  totalBookings: number;
  totalRevenue: number;
  totalPending: number;
  carStatus: {
    available: number;
    rented: number;
  };
}

export interface Activity {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_Base_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      message = err.message || message;
    } catch {}
    throw new Error(message);
  }

  const json = await res.json();
  return json.data ?? json;
}

export const api = {
  auth: {
    login: (data: any) =>
      fetchAPI<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    register: (data: any) =>
      fetchAPI<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getMe: () => fetchAPI<GetMeResponse>("/auth/data"),
  },

  cars: {
    getAll: () => fetchAPI<Car[]>("/user/cars"),
    getById: (id: string) => fetchAPI<Car>(`/user/cars/${id}`),
  },

  bookings: {
    getAll: () => fetchAPI<Booking[]>("/user/bookings"),
    getById: (id: string) => fetchAPI<Booking>(`/user/bookings/${id}`),
  },

  owner: {
    addCar: (formData: FormData) =>
      fetchAPI("/owner/add-car", {
        method: "POST",
        body: formData,
      }),

    updateCar: (id: string, data: any | FormData) =>
      fetchAPI(`/owner/update-car/${id}`, {
        method: "PUT",
        body: data instanceof FormData ? data : JSON.stringify(data),
      }),

    deleteCar: (id: string) =>
      fetchAPI(`/owner/cars/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ carId: id }),
      }),

    getCars: () => fetchAPI<Car[]>("/owner/cars"),

    dashboard: () => fetchAPI<DashboardStats>("/owner/dashboard"),
    activity: () => fetchAPI<Activity[]>("/owner/activity"),
  },
};
