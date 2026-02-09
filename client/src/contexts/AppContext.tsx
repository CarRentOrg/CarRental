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
import { useAuth } from "@/contexts/AuthContext";

interface AppContextType {
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
  const { user } = useAuth();

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

  const refreshCars = useCallback(async () => {
    setLoading(true);
    try {
      const cars = await api.cars.getAll();

      setCars(cars);
      setTotalCars(cars.length);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCarById = async (id: string): Promise<Car | undefined> => {
    // 1. Check local cache first
    const localCar = cars.find((c) => c._id === id);
    if (localCar) return localCar;

    // 2. Fetch from API if not in cache
    try {
      const fetchedCar = await api.cars.getById(id);
      return fetchedCar;
    } catch (error) {
      console.error("Failed to fetch car by ID:", error);
      return undefined;
    }
  };

  const fetchMyBookings = useCallback(async () => {
    if (!user) return;
    setLoadingBookings(true);
    try {
      const data = await api.bookings.getAll();
      setBookings(data || []);
    } finally {
      setLoadingBookings(false);
    }
  }, [user]);

  const filterAvailableCars = useCallback(() => {
    setAvailableCars(cars.filter((c) => c.is_available));
  }, [cars]);

  useEffect(() => {
    refreshCars();
  }, [refreshCars]);

  useEffect(() => {
    if (user) fetchMyBookings();
  }, [user, fetchMyBookings]);

  useEffect(() => {
    filterAvailableCars();
  }, [filterAvailableCars]);

  const setDateRange = (startDate: string | null, endDate: string | null) =>
    setDateRangeState({ startDate, endDate });

  return (
    <AppContext.Provider
      value={{
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
