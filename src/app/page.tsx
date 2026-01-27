"use client";

import { Variants } from "framer-motion";
import FeaturedSection from "@/components/_sections/FeaturedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import RentalTermsSection from "@/components/_sections/RentalTermsSection";
import HowToRentSection from "@/components/_sections/HowToRentSection";
import FAQSection from "@/components/_sections/FAQSection";
import TopSection from "@/components/_sections/TopSection";

import BenefitsSection from "@/components/_sections/BenefitsSection";

export default function Home() {
  return (
    <div className="flex flex-col bg-black">
      <TopSection />

      <FeaturedSection />
      <RentalTermsSection />
      <HowToRentSection />
      <FAQSection />
      <BenefitsSection />
    </div>
  );
}
