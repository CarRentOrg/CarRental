"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Car, Booking, User } from "@/types";
import { api } from "@/lib/api";

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
  const [user, setUser] = useState<User | null>(null);
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

  // Fetch user data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.auth.getMe()
        .then(userData => setUser(userData))
        .catch(err => console.error('Failed to fetch user:', err));
    }
  }, []);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const carsData = await api.cars.getAll();
      setCars(carsData || []);
      setTotalCars(carsData?.length || 0);
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
      // Filter by current user if needed
      setBookings(bookingsData || []);
    } catch (error) {
      console.error("Failed to fetch user bookings:", error);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  }, [user]);

  const fetchAvailableCars = useCallback(async () => {
    if (dateRange.startDate && dateRange.endDate) {
      setLoading(true);
      try {
        // For now, just filter available cars from all cars
        // Using !== false to include null/undefined as available by default
        const available = cars.filter(car => car.is_available !== false);
        setAvailableCars(available);
      } catch (error) {
        console.error("Failed to fetch available cars:", error);
      } finally {
        setLoading(false);
      }
    } else {
      const available = cars.filter(car => car.is_available !== false);
      setAvailableCars(available);
    }
  }, [dateRange, cars]);

  useEffect(() => {
    console.log("🚗 Current cars in state:", cars);
    console.log("✅ Available cars in state:", availableCars);
  }, [cars, availableCars]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    }
  }, [user, fetchMyBookings]);

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
        const car = await api.cars.getById(id);
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
