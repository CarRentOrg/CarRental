"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { Car, Booking, User } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [dateRange, setDateRangeState] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const availableCars = useMemo(() => {
    return cars.filter(car => car.is_available !== false);
  }, [cars]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const carsData = await api.cars.getAll();
      setCars(carsData || []);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyBookings = useCallback(async () => {
    if (!user) return;
    setLoadingBookings(true);
    try {
      const bookingsData = await api.bookings.getAll();
      setBookings(bookingsData || []);
    } catch (error) {
      console.error("Failed to fetch user bookings:", error);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    }
  }, [user, fetchMyBookings]);

  const setDateRange = (startDate: string | null, endDate: string | null) => {
    setDateRangeState({ startDate, endDate });
  };

  const getCarById = useCallback(
    async (id: string) => {
      const existing = cars.find((c) => c.id === id);
      if (existing) return existing;

      try {
        return await api.cars.getById(id);
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
        totalCars: cars.length,
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
