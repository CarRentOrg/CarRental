"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import CarCard from "@/components/cars/CarCard";
import { useLanguage } from "@/contexts/LanguageContext";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import Title from "@/components/shared/title";
import { mockApi, Car } from "@/lib/mockData";
import DateRangePicker from "@/components/ui/DateRangePicker";
import BookingModal from "@/components/booking/BookingModal";

export default function CarsPage() {
  const { t } = useLanguage();

  // Booking State
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Data State
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Load Data
  useEffect(() => {
    fetchCars();
  }, [startDate, endDate]);

  async function fetchCars() {
    setLoading(true);
    try {
      if (startDate && endDate) {
        // Fetch available cars
        const available = await mockApi.cars.getAvailableCars({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
        setCars(available);
      } else {
        // Fetch all cars
        const response = await mockApi.cars.getAll({ limit: 100 }); // Mock large limit
        setCars(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load cars", error);
    } finally {
      setLoading(false);
    }
  }

  // Derived Options for Filters
  const brands = useMemo(
    () => Array.from(new Set(cars.map((c) => c.brand))).sort(),
    [cars],
  );
  // Assume mock data cars have 'type' or derive it? MockData cars have 'status' etc but no 'type'?
  // Checking MockData Interface:
  // Car { ... seats, fuel_type, transmission, ... }
  // Wait, existing code used `c.type` but interface doesn't have `type`.
  // It has `fuel_type`. Maybe `type` was a mistake/inferred in previous file?
  // Let's use fuel_type as proxy for "Type" or Body Type if existed.
  // Previous code used `c.type` which suggests `Car` interface might have had it or it was type unsafe.
  // The `Car` interface in `mockData.ts` (Step 122) does NOT have `type`. It has `fuel_type`, `transmission`, etc.
  // So likely the original code was broken or using a different type definition?
  // I will switch "Type" filter to "Fuel Type" to be safe and correct.

  const fuelTypes = useMemo(
    () => Array.from(new Set(cars.map((c) => c.fuel_type))).sort(),
    [cars],
  );
  const transmissions = ["Automatic", "Manual"];

  // Filtering Logic
  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Filter by Brands
    if (selectedBrands.length > 0) {
      result = result.filter((car) => selectedBrands.includes(car.brand));
    }

    // Filter by Fuel Type (replacing Type)
    if (selectedTypes.length > 0) {
      result = result.filter((car) => selectedTypes.includes(car.fuel_type));
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

    return result;
  }, [selectedBrands, selectedTypes, selectedTransmissions, sortOption, cars]);

  // Reset pagination when filters change
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
    // Optional: Clear dates too? Probably not, users want to keep dates.
  };

  const onBookClick = (car: Car) => {
    if (!startDate || !endDate) {
      // Should prompt to select dates
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      alert("Please select rental dates first to check availability.");
      return;
    }
    setSelectedCar(car);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedCar || !startDate || !endDate) return;

    setBookingLoading(true);
    try {
      await mockApi.bookings.create({
        car_id: selectedCar.id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_price:
          selectedCar.price_per_day *
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
          ),
      });

      alert("Booking Request Sent! Admin will review it shortly.");
      setIsBookingModalOpen(false);
      setSelectedCar(null);

      // Refresh cars (this car should now be unavailable)
      fetchCars();
    } catch (error: any) {
      alert(error.message || "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto px-3 sm:px-12 py-26 w-full">
        {/* Header */}

        <div className="mb-12 text-center space-y-6">
          <Title
            title={t("cars.title") || "Cars"}
            subtitle={
              t("cars.subtitle") ||
              "Choose from our exclusive collection of premium vehicles."
            }
          />

          {/* Date Picker Centered */}
          <div className="flex justify-center">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
                // If clearing dates, maybe re-fetch all?
              }}
              className="shadow-2xl shadow-blue-900/20"
            />
          </div>
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
            label="Fuel"
            options={fuelTypes}
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 min-h-[400px]">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : paginatedCars.length > 0 ? (
            paginatedCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onBook={startDate && endDate ? onBookClick : undefined}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-xl text-gray-500">
                {startDate && endDate
                  ? "No cars available for these dates."
                  : "No cars found matching your criteria."}
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

      {/* Booking Modal */}
      {selectedCar && startDate && endDate && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleConfirmBooking}
          car={selectedCar}
          startDate={startDate}
          endDate={endDate}
          totalPrice={
            selectedCar.price_per_day *
            Math.ceil(
              (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
            )
          }
          isLoading={bookingLoading}
        />
      )}
    </div>
  );
}
