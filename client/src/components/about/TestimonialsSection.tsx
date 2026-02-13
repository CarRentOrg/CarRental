"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Luxerra isn't just a rental service, it's an experience. The car was pristine and the service was impeccable.",
    author: "James Peterson",
    role: "Entrepreneur",
  },
  {
    quote:
      "I've rented from many companies, but none match the attention to detail and quality of fleet here.",
    author: "Emily Clark",
    role: "Travel Blogger",
  },
  {
    quote:
      "Seamless from booking to return. The airport pickup was a lifesaver for my business trip.",
    author: "Michael Chang",
    role: "Executive",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-500 font-bold tracking-widest uppercase text-sm">
            Voices of Trust
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-2">
            Client Stories
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900 p-8 rounded-3xl border border-white/5 relative"
            >
              <Quote className="absolute top-8 right-8 h-8 w-8 text-blue-600/20 rotate-180" />
              <div className="flex gap-1 text-amber-500 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "{story.quote}"
              </p>
              <div>
                <h4 className="font-bold text-white">{story.author}</h4>
                <p className="text-sm text-gray-500">{story.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
