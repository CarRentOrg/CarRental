"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { FAQS, FAQItem } from "@/constants";
import Title from "../shared/title";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number): void => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-10 sm:py-24 border-t border-neutral-800/50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Side */}
          <div>
            <h2 className="text-5xl font-bold tracking-tight">
              Frequently Asked
              <br />
              Questions
            </h2>
          </div>

          {/* Right Side */}
          <div className="divide-y divide-neutral-800/50">
            {FAQS.map((item: FAQItem, i: number) => {
              const isOpen = openIndex === i;

              return (
                <div key={i} className="py-6 cursor-pointer">
                  {/* Question */}
                  <button
                    type="button"
                    onClick={() => toggleFAQ(i)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="text-neutral-300 font-medium group-hover:text-white transition-colors">
                      {item.question}
                    </span>

                    {isOpen ? (
                      <X className="h-5 w-5 text-white" />
                    ) : (
                      <Plus className="h-5 w-5 text-neutral-500 group-hover:text-white transition-colors" />
                    )}
                  </button>

                  {/* Answer */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm text-neutral-400 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
