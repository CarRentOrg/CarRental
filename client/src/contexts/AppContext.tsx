"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { mockApi, Car, Booking, User, USERS } from "@/lib/mockData";

interface AppContextType {
  user: User | null;
  cars: Car[];
  availableCars: Car[];
  bookings: Booking[];
  loading: boolean;
  loadingBookings: boolean;
  totalCars: number;
  dateRange: { startDate: string | null; endDate: string | null };
  setDateRange: (startDate: string | null, endDate: string | null) => void;
  refreshCars: () => Promise<void>;
  fetchMyBookings: () => Promise<void>;
  getCarById: (id: string) => Promise<Car | undefined>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User | null>(USERS[0]); // Mock logged in user
  const [cars, setCars] = useState<Car[]>([]);
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [totalCars, setTotalCars] = useState(0);
  const [dateRange, setDateRangeState] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const response = await mockApi.cars.getAll({ limit: 100 }); // Fetch more for filtering
      setCars(response.data || []);
      setTotalCars(response.total || 0);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyBookings = useCallback(async () => {
    if (!user) return;
    setLoadingBookings(true);
    try {
      const response = await mockApi.bookings.getAll({ limit: 1000 });
      const myBookings = response.data.filter((b) => b.user_id === user.id);
      setBookings(myBookings);
    } catch (error) {
      console.error("Failed to fetch user bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  }, [user]);

  const fetchAvailableCars = useCallback(async () => {
    if (dateRange.startDate && dateRange.endDate) {
      setLoading(true);
      try {
        const available = await mockApi.cars.getAvailableCars({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });
        setAvailableCars(available);
      } catch (error) {
        console.error("Failed to fetch available cars:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setAvailableCars(cars);
    }
  }, [dateRange, cars]);

  useEffect(() => {
    fetchCars();
    fetchMyBookings();
  }, [fetchCars, fetchMyBookings]);

  useEffect(() => {
    fetchAvailableCars();
  }, [fetchAvailableCars]);

  const setDateRange = (startDate: string | null, endDate: string | null) => {
    setDateRangeState({ startDate, endDate });
  };

  const getCarById = useCallback(
    async (id: string) => {
      // 1. Check if we already have it in state
      const existing = cars.find((c) => c.id === id);
      if (existing) return existing;

      // 2. If not, fetch from API
      try {
        const car = await mockApi.cars.getById(id);
        return car;
      } catch (error) {
        console.error("Failed to get car:", error);
        return undefined;
      }
    },
    [cars],
  );

  return (
    <AppContext.Provider
      value={{
        user,
        cars,
        availableCars,
        bookings,
        loading,
        loadingBookings,
        totalCars,
        dateRange,
        setDateRange,
        refreshCars: fetchCars,
        fetchMyBookings,
        getCarById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
