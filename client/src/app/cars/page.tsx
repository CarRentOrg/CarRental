"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import CarCard from "@/components/cars/CarCard";
import { CARS } from "@/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import Title from "@/components/shared/title";

export default function CarsPage() {
  const { t } = useLanguage();

  // Filter States - Arrays for Multi-Select
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(
    [],
  );
  const [sortOption, setSortOption] = useState("relevant"); // relevant, price_asc
  const [currentPage, setCurrentPage] = useState(1);

  // Constants
  const ITEMS_PER_PAGE = 6;

  // Derived Options for Filters
  const brands = useMemo(
    () => Array.from(new Set(CARS.map((c) => c.brand))).sort(),
    [],
  );
  const types = useMemo(
    () => Array.from(new Set(CARS.map((c) => c.type))).sort(),
    [],
  );
  const transmissions = ["Automatic", "Manual"];

  // Filtering Logic
  const filteredCars = useMemo(() => {
    let result = [...CARS];

    // Filter by Brands
    if (selectedBrands.length > 0) {
      result = result.filter((car) => selectedBrands.includes(car.brand));
    }

    // Filter by Types
    if (selectedTypes.length > 0) {
      result = result.filter((car) => selectedTypes.includes(car.type));
    }

    // Filter by Transmission
    if (selectedTransmissions.length > 0) {
      result = result.filter((car) =>
        selectedTransmissions.includes(car.transmission),
      );
    }

    // Sorting
    if (sortOption === "price_asc") {
      result.sort((a, b) => a.price_per_day - b.price_per_day);
    }
    // "relevant" uses default order (or could be added later)

    return result;
  }, [selectedBrands, selectedTypes, selectedTransmissions, sortOption]);

  // Reset pagination when filters change
  // We can't use useEffect here easily without causing loops or complex deps,
  // but usually resetting page on filter change is good UX.
  // Ideally, use a useEffect that watches the filter arrays length/content string.
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedBrands, selectedTypes, selectedTransmissions, sortOption]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSelectedTransmissions([]);
    setSortOption("relevant");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto px-3 sm:px-12 py-26 w-full">
        {/* Header */}

        <div className="mb-12 text-center">
          <Title
            title={t("cars.title") || "Cars"}
            subtitle={
              t("cars.subtitle") ||
              "Choose from our exclusive collection of premium vehicles."
            }
          />
        </div>

        {/* Filters & Sorting */}
        <div className="mb-12 w-full grid grid-cols-2 gap-3 sm:gap-4 md:flex sm:flex-wrap sm:items-center sm:justify-center">
          <MultiSelectDropdown
            label="Brands"
            options={brands}
            selected={selectedBrands}
            onChange={setSelectedBrands}
          />

          <MultiSelectDropdown
            label="Type"
            options={types}
            selected={selectedTypes}
            onChange={setSelectedTypes}
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
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full appearance-none cursor-pointer rounded-full border border-white/10 bg-white/5 pl-6 pr-10 py-3 text-sm font-medium text-gray-300 hover:bg-white/10 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {paginatedCars.length > 0 ? (
            paginatedCars.map((car) => <CarCard key={car.id} car={car} />)
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
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <nav className="flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 p-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`
                    flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all
                    ${
                      currentPage === page
                        ? "bg-white text-black"
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }
                  `}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent"
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
