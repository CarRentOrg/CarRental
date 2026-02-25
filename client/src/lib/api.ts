import { Car, Booking, User, DashboardStats } from "@/types";

export const API_Base_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface GetMeResponse {
  user: User;
}
export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
  flow?: "password" | "otp";
}
interface GetAllUsersResponse {
  success: boolean;
  total: number;
  data: (User & { total_bookings?: number; total_spent?: number })[];
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
  const headers: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_Base_URL}${endpoint}`, {
    ...options,
    credentials: "include", // Send cookies
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

    logout: () => fetchAPI("/auth/logout", { method: "POST" }),

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
    changePassword: (data: any) =>
      fetchAPI<{ success: boolean; message: string }>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    updateProfile: (data: { name?: string; email?: string; phone?: string }) =>
      fetchAPI<{ success: boolean; message: string; user: User }>(
        "/auth/update-profile",
        {
          method: "PUT",
          body: JSON.stringify(data),
        },
      ),
  },

  payment: {
    createIntent: (amount: number, bookingData: any) =>
      fetchAPI<{
        success: boolean;
        paymentId: string;
        qrData: string;
        amount: number;
        expiresAt: string;
      }>("/payment/create-intent", {
        method: "POST",
        body: JSON.stringify({ amount, bookingData }),
      }),

    verify: (paymentId: string) =>
      fetchAPI<{
        success: boolean;
        status: "paid" | "pending" | "failed";
        transactionId: string;
      }>("/payment/verify", {
        method: "POST",
        body: JSON.stringify({ paymentId }),
      }),
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

    create: (data: {
      carId: string;
      startDate: string;
      endDate: string;
      totalPrice: number;
      status?: string;
      note?: string;
    }) =>
      fetchAPI<Booking>("/bookings", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getForCar: (carId: string) => fetchAPI<Booking[]>(`/bookings/car/${carId}`),

    getMyBookings: () => fetchAPI<Booking[]>("/bookings/my-bookings"),

    getById: (id: string) =>
      fetchAPI<Booking | null>(
        `/bookings/${id}`,
        {},
        { returnNullOn404: true },
      ),

    checkAvailability: (data: {
      carId: string;
      startDate: string;
      endDate: string;
    }) =>
      fetchAPI<{ success: boolean; available: boolean }>(
        "/bookings/check-availability",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      ),

    init: (data: {
      carId: string;
      startDate: string;
      endDate: string;
      totalPrice: number;
      note?: string;
    }) =>
      fetchAPI<Booking>("/bookings/init", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    confirm: (data: { bookingId: string; paymentId: string }) =>
      fetchAPI<Booking>("/bookings/confirm", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    approve: (bookingId: string) =>
      fetchAPI<Booking>("/bookings/approve", {
        method: "POST",
        body: JSON.stringify({ bookingId }),
      }),

    reject: (bookingId: string) =>
      fetchAPI<Booking>("/bookings/reject", {
        method: "POST",
        body: JSON.stringify({ bookingId }),
      }),

    complete: (bookingId: string) =>
      fetchAPI<Booking>("/bookings/complete", {
        method: "POST",
        body: JSON.stringify({ bookingId }),
      }),

    update: (
      id: string,
      data: Partial<{
        startDate: string;
        endDate: string;
        totalPrice: number;
        status: "pending" | "confirmed" | "cancelled" | "completed";
      }>,
    ) =>
      fetchAPI<Booking>(`/bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
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

    toggleAvailability: (carId: string) =>
      fetchAPI<{ success: boolean; message: string }>("/owner/toggle-car", {
        method: "POST",
        body: JSON.stringify({ carId }),
      }),

    dashboard: () => fetchAPI<DashboardStats>("/owner/dashboard"),
    activity: () => fetchAPI<Activity[]>("/owner/activity"),
    bookings: {
      getAll: () => fetchAPI<Booking[]>("/owner/bookings"),
      getPending: () => fetchAPI<{ count: number }>("/owner/bookings/pending"),
    },
    customers: {
      getAll: () => fetchAPI<GetAllUsersResponse>("/owner/customers"),
    },
    getBookingUsers: () => fetchAPI<GetAllUsersResponse>("/owner/customers"),
  },
};
