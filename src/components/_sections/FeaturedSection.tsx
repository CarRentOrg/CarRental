import React from "react";
import Title from "../shared/title";
import { FEATURED_CARS } from "@/constants";
import CarCard from "../cars/CarCard";
import Button from "../shared/button";

const FeaturedSection = () => {
  return (
    <section className="py-24 sm:px-10 mx-auto w-full px-6">
      <div className="text-center md:mb-20 mb-10">
        <Title title={"Choose Your Ride"} align={"center"} />
      </div>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 md:grid-cols-3 w-full mb-16">
        {FEATURED_CARS.slice(0, 4).map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      <div className="w-full flex justify-center items-center">
        <Button
          text="Explore all cars"
          className="w-2/3 lg:w-50"
          href="/cars"
        />
      </div>
    </section>
  );
};

export default FeaturedSection;
