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
interface GetAllUsersResponse {
  success: boolean;
  total: number;
  data: (User & { total_bookings?: number; total_spent?: number })[];
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
  config: { returnNullOn404?: boolean } = {},
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
    if (res.status === 404 && config.returnNullOn404) {
      return null as T;
    }
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

    requestOTP: (identifier: string) =>
      fetchAPI<{ success: boolean; code?: string }>("/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ identifier }),
      }),

    verifyOTP: (identifier: string, code: string) =>
      fetchAPI<{ success: boolean; token: string; user: User }>(
        "/auth/otp/verify",
        {
          method: "POST",
          body: JSON.stringify({ identifier, code }),
        },
      ),
  },

  users: {
    getById: (id: string) => fetchAPI<User>(`/users/${id}`),
  },

  cars: {
    getAll: () => fetchAPI<Car[]>("/user/cars"),
    getById: (id: string) => fetchAPI<Car>(`/user/cars/${id}`),
  },

  bookings: {
    getAll: (params?: { carId?: string; status?: string }) =>
      fetchAPI<Booking[]>(
        `/bookings?${new URLSearchParams({
          car_id: params?.carId ?? "",
          status: params?.status ?? "",
        }).toString()}`,
      ),

    getMyBookings: () => fetchAPI<Booking[]>("/bookings"),

    getById: (id: string) =>
      fetchAPI<Booking | null>(
        `/bookings/${id}`,
        {},
        { returnNullOn404: true },
      ),

    create: (data: {
      carId: string;
      startDate: string;
      endDate: string;
      totalPrice: number;
      note?: string;
    }) =>
      fetchAPI<Booking>("/bookings", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (
      id: string,
      data: Partial<{
        startDate: string;
        endDate: string;
        totalPrice: number;
        status: "pending" | "confirmed" | "cancelled";
      }>,
    ) =>
      fetchAPI<Booking>(`/bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    reject: (id: string) =>
      fetchAPI<Booking>(`/bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "cancelled" }),
      }),

    approve: (id: string) =>
      fetchAPI<Booking>(`/bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "confirmed" }),
      }),
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
    bookings: {
      getAll: () =>
        fetchAPI<{ success: boolean; total: number; data: Booking[] }>(
          "/owner/bookings",
        ),
    },
    customers: {
      getAll: () => fetchAPI<GetAllUsersResponse>("/owner/customers"),
    },
  },
};
