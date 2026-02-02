"use client";

import React from "react";
import Title from "../shared/title";
import CarCard from "../cars/CarCard";
import Button from "../shared/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApp } from "@/contexts/AppContext";

const FeaturedSection = () => {
  const { t } = useLanguage();
  const { availableCars: cars, loading } = useApp();

  return (
    <section
      id="featured"
      className="py-10 sm:py-24 px-2 sm:px-10 2xl:px-24 mx-auto w-full"
    >
      <div className="text-center md:mb-20 mb-10">
        <Title title={t("home.chooseRide")} align={"center"} />
      </div>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 md:grid-cols-2 w-full mb-16 min-h-[400px]">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          cars.slice(0, 4).map((car) => <CarCard key={car.id} car={car} />)
        )}
      </div>
      <div className="w-full flex justify-center items-center">
        <Button
          text={t("home.exploreAllCars")}
          className="w-2/3 lg:w-50"
          href="/cars"
        />
      </div>
    </section>
  );
};

export default FeaturedSection;
