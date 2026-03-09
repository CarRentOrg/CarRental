"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface TimePickerProps {
  value: string; // "HH:mm"
  onChange: (time: string) => void;
  label?: string;
  className?: string;
}

export default function TimePicker({
  value,
  onChange,
  label,
  className = "",
}: TimePickerProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate times in 30-min intervals
  const timeOptions = useMemo(() => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (const m of ["00", "30"]) {
        const hourLabel = h.toString().padStart(2, "0");
        times.push(`${hourLabel}:${m}`);
      }
    }
    return times;
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Scroll to selected item when opened
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const selectedEl = dropdownRef.current.querySelector(
        '[data-selected="true"]',
      );
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "center" });
      }
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">
          {t(label)}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white hover:border-white/20 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-sm">
            {value || "Select Time"}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl shadow-black/50 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto no-scrollbar py-1">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  type="button"
                  data-selected={time === value}
                  onClick={() => {
                    onChange(time);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                    time === value
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
