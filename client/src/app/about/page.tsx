"use client";

import React from "react";
import HeroSection from "@/components/about/HeroSection";
import StorySection from "@/components/about/StorySection";
import ServicesSection from "@/components/about/ServicesSection";
import WhyChooseSection from "@/components/about/WhyChooseSection";
import TeamSection from "@/components/about/TeamSection";
import TestimonialsSection from "@/components/about/TestimonialsSection";
import CTASection from "@/components/about/CTASection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <HeroSection />
      <StorySection />
      <ServicesSection />
      <WhyChooseSection />
      <TeamSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
