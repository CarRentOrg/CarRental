"use client";

import { Variants } from "framer-motion";
import FeaturedSection from "@/components/_sections/FeaturedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import RentalTermsSection from "@/components/_sections/RentalTermsSection";
import HowToRentSection from "@/components/_sections/HowToRentSection";
import FAQSection from "@/components/_sections/FAQSection";
import TopSection from "@/components/_sections/TopSection";

export default function Home() {


  return (
    <div className="flex flex-col">
      <TopSection />
      {/* Featured Cars Section */}
      <FeaturedSection />
      <RentalTermsSection />
      <HowToRentSection />
      <FAQSection />

      {/* Why Choose Us Section */}
      {/* <section id="why-choose-us" className="bg-black py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {t("features.title")}
            </h2>
            <p className="mt-4 text-gray-600">{t("features.description")}</p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold">
                {t("features.feature1Title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("features.feature1Desc")}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold">
                {t("features.feature2Title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("features.feature2Desc")}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold">
                {t("features.feature3Title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("features.feature3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
