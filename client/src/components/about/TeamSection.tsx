"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  img: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Alex Morgan",
    role: "CEO & Founder",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80",
  },
  {
    name: "Sarah Chen",
    role: "Head of Operations",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
  },
  {
    name: "Marcus Johnson",
    role: "Fleet Manager",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80",
  },
];

export default function TeamSection() {
  return (
    <section className="py-24 px-6 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black">Meet the Team</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The experts ensuring your journey is nothing short of perfect.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {TEAM.map((member, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="relative h-96 w-full rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 filter saturate-0 group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white">
                    {member.name}
                  </h3>
                  <p className="text-blue-500 font-medium">{member.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
