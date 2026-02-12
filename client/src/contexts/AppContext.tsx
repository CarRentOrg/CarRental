"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Car, Booking } from "@/types";
import { api } from "@/lib/api";
import { useUserAuth } from "@/contexts/UserAuthContext";

import { User } from "@/types";

interface AppContextType {
  user: User | null;
  isAuthLoading: boolean;
  cars: Car[];
  availableCars: Car[];
  bookings: Booking[];

  loading: boolean;
  loadingBookings: boolean;
  totalCars: number;

  dateRange: { startDate: string | null; endDate: string | null };
  setDateRange: (s: string | null, e: string | null) => void;

  refreshCars: () => Promise<void>;
  fetchMyBookings: () => Promise<void>;
  getCarById: (id: string) => Promise<Car | undefined>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useUserAuth();

  const [cars, setCars] = useState<Car[]>([]);
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [totalCars, setTotalCars] = useState(0);

  const [dateRange, setDateRangeState] = useState({
    startDate: null as string | null,
    endDate: null as string | null,
  });

  const setDateRange = useCallback(
    (startDate: string | null, endDate: string | null) => {
      setDateRangeState({ startDate, endDate });
    },
    [],
  );

  const refreshCars = useCallback(async () => {
    if (cars.length > 0) return; // Don't re-fetch if we already have cars
    setLoading(true);
    try {
      const carsData = await api.cars.getAll();

      setCars(carsData);
      setTotalCars(carsData.length);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyBookings = useCallback(async () => {
    if (!user || bookings.length > 0) {
      if (!user) setBookings([]);
      return;
    }
    setLoadingBookings(true);
    try {
      const bookingsData = await api.bookings.getMyBookings();
      setBookings(bookingsData);
    } finally {
      setLoadingBookings(false);
    }
  }, [user]);

  const getCarById = useCallback(async (id: string) => {
    try {
      const car = await api.cars.getById(id);
      return car;
    } catch (error) {
      console.error("Failed to fetch car by ID:", error);
      return undefined;
    }
  }, []);

  useEffect(() => {
    refreshCars();
  }, [refreshCars]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const filterAvailableCars = useCallback(() => {
    setAvailableCars(cars.filter((c) => c.is_available));
  }, [cars]);

  useEffect(() => {
    filterAvailableCars();
  }, [filterAvailableCars]);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthLoading,
        cars,
        availableCars,
        bookings,
        loading,
        loadingBookings,
        totalCars,
        dateRange,
        setDateRange,
        refreshCars,
        fetchMyBookings,
        getCarById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
