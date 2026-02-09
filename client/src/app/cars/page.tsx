"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import CarCard from "@/components/cars/CarCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApp } from "@/contexts/AppContext";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import Title from "@/components/shared/title";

export default function CarsPage() {
  const { t } = useLanguage();
  const { availableCars: cars, loading } = useApp();

  // =====================
  // State
  // =====================
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(
    [],
  );
  const [sortOption, setSortOption] = useState<"relevant" | "price_asc">(
    "relevant",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  // =====================
  // Filter Options
  // =====================
  const brands = useMemo(
    () => Array.from(new Set(cars.map((c) => c.brand).filter(Boolean))).sort(),
    [cars],
  );

  const fuelTypes = useMemo(
    () =>
      Array.from(new Set(cars.map((c) => c.fuel_type).filter(Boolean))).sort(),
    [cars],
  );

  const transmissions = ["Automatic", "Manual"];

  // =====================
  // Filtering + Sorting
  // =====================
  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (selectedBrands.length > 0) {
      result = result.filter((c) => selectedBrands.includes(c.brand));
    }

    if (selectedFuelTypes.length > 0) {
      result = result.filter((c) => selectedFuelTypes.includes(c.fuel_type));
    }

    if (selectedTransmissions.length > 0) {
      result = result.filter((c) =>
        selectedTransmissions.includes(
          c.transmission.charAt(0).toUpperCase() + c.transmission.slice(1),
        ),
      );
    }

    if (sortOption === "price_asc") {
      result = [...result].sort((a, b) => a.price_per_day - b.price_per_day);
    }

    return result;
  }, [
    cars,
    selectedBrands,
    selectedFuelTypes,
    selectedTransmissions,
    sortOption,
  ]);

  // =====================
  // Reset page on filter change
  // =====================
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrands, selectedFuelTypes, selectedTransmissions, sortOption]);

  // =====================
  // Pagination
  // =====================
  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedCars = useMemo(
    () =>
      filteredCars.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [filteredCars, currentPage],
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedFuelTypes([]);
    setSelectedTransmissions([]);
    setSortOption("relevant");
    setCurrentPage(1);
  };

  // =====================
  // UI
  // =====================
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full px-3 py-26 sm:px-12">
        {/* Header */}
        <div className="mb-12 space-y-6 text-center">
          <Title
            title={t("cars.title") || "Cars"}
            subtitle={
              t("cars.subtitle") ||
              "Choose from our exclusive collection of premium vehicles."
            }
          />
        </div>

        {/* Filters */}
        <div className="mb-12 grid w-full grid-cols-2 gap-3 sm:gap-4 md:flex md:flex-wrap md:items-center md:justify-center">
          <MultiSelectDropdown
            label="Brands"
            options={brands}
            selected={selectedBrands}
            onChange={setSelectedBrands}
          />

          <MultiSelectDropdown
            label="Fuel"
            options={fuelTypes}
            selected={selectedFuelTypes}
            onChange={setSelectedFuelTypes}
          />

          <MultiSelectDropdown
            label="Transmission"
            options={transmissions}
            selected={selectedTransmissions}
            onChange={setSelectedTransmissions}
          />

          {/* Sort */}
          <div className="relative group">
            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value as "relevant" | "price_asc")
              }
              className="w-full cursor-pointer appearance-none rounded-full border border-white/10 bg-white/5 py-3 pl-6 pr-10 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
            >
              <option value="relevant" className="bg-gray-900">
                Most Relevant
              </option>
              <option value="price_asc" className="bg-gray-900">
                Price: Low to High
              </option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid min-h-[400px] grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : paginatedCars.length > 0 ? (
            paginatedCars.map((car) => (
              <CarCard key={car.id || car._id} car={car} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-xl text-gray-500">
                No cars found matching your criteria.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-sm font-medium text-blue-500 hover:text-blue-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="mt-16 flex justify-center">
            <nav className="flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 p-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-white text-black"
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
