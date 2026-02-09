"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Car } from "@/types";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface ModalState {
  type: "add" | "edit" | "delete" | null;
  data?: Car | string | null; // Car for edit, ID for delete
}

interface AdminCarsContextType {
  cars: Car[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    setPage: (page: number) => void;
  };
  modal: {
    state: ModalState;
    openAdd: () => void;
    openEdit: (car: Car) => void;
    openDelete: (id: string) => void;
    close: () => void;
  };
  actions: {
    loadCars: () => Promise<void>;
    addCar: (formData: FormData) => Promise<void>;
    updateCar: (id: string, formData: FormData) => Promise<void>;
    deleteCar: (id: string) => Promise<void>;
  };
}

const AdminCarsContext = createContext<AdminCarsContextType | undefined>(
  undefined,
);

export function AdminCarsProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 9;

  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    data: null,
  });

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await api.owner.getCars();
      // Client-side filtering/pagination for now as API returns all
      // In a real app, parameters would pass to api.owner.getCars({ page, limit, search })
      setCars(data || []);
      setTotal(data?.length || 0);
    } catch (error) {
      console.error("Failed to load cars", error);
      toast.error("Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []); // Reload when page changes if server-side pagination (currently mock client-side)

  const addCar = async (formData: FormData) => {
    try {
      await api.owner.addCar(formData);
      toast.success("Vehicle created successfully");
      closeModal();
      loadCars();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create vehicle");
      throw error;
    }
  };

  const updateCar = async (id: string, formData: FormData) => {
    try {
      await api.owner.updateCar(id, formData);
      toast.success("Vehicle updated successfully");
      closeModal();
      loadCars();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update vehicle");
      throw error;
    }
  };

  const deleteCar = async (id: string) => {
    try {
      await api.owner.deleteCar(id);
      toast.success("Vehicle deleted successfully");
      closeModal();
      loadCars();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to delete vehicle");
      throw error;
    }
  };

  const openAdd = () => setModalState({ type: "add", data: null });
  const openEdit = (car: Car) => setModalState({ type: "edit", data: car });
  const openDelete = (id: string) =>
    setModalState({ type: "delete", data: id });
  const closeModal = () => setModalState({ type: null, data: null });

  // Client-side Filter & Pagination
  const filteredCars = cars.filter((c) => {
    const lowerQ = searchQuery.toLowerCase();
    return (
      c.brand.toLowerCase().includes(lowerQ) ||
      c.model.toLowerCase().includes(lowerQ) ||
      c.name.toLowerCase().includes(lowerQ)
    );
  });

  const paginatedCars = filteredCars.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <AdminCarsContext.Provider
      value={{
        cars: paginatedCars, // Expose only current page
        loading,
        searchQuery,
        setSearchQuery,
        pagination: {
          page,
          limit: LIMIT,
          total: filteredCars.length, // Total matching search
          setPage,
        },
        modal: {
          state: modalState,
          openAdd,
          openEdit,
          openDelete,
          close: closeModal,
        },
        actions: {
          loadCars,
          addCar,
          updateCar,
          deleteCar,
        },
      }}
    >
      {children}
    </AdminCarsContext.Provider>
  );
}

export function useAdminCars() {
  const context = useContext(AdminCarsContext);
  if (context === undefined) {
    throw new Error("useAdminCars must be used within a AdminCarsProvider");
  }
  return context;
}
