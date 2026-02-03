"use client";

import FeaturedSection from "@/components/_sections/FeaturedSection";
import RentalTermsSection from "@/components/_sections/RentalTermsSection";
import HowToRentSection from "@/components/_sections/HowToRentSection";
import FAQSection from "@/components/_sections/FAQSection";
import TopSection from "@/components/_sections/TopSection";

import BenefitsSection from "@/components/_sections/BenefitsSection";

export default function Home() {
  const THIS_IS_A_DELIBERATE_SYNTAX_ERROR_TO_TEST_VERCEL_SYNC = ;
  return (
    <div className="flex flex-col">
      <TopSection />
      <FeaturedSection />
      <div className="px-3 lg:px-12 mx-auto">
        <RentalTermsSection />
        <HowToRentSection />
      </div>
      <FAQSection />
      <BenefitsSection />
    </div>
  );
}
