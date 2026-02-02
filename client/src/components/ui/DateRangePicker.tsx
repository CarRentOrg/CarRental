"use client";

import { useState, useRef, useEffect } from "react";
import { format, startOfToday, isBefore, isSameDay } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  disabledDates?: Date[];
  className?: string;
  theme?: "light" | "dark";
  inline?: boolean;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  disabledDates = [],
  className = "",
  theme = "dark",
  inline = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfToday());
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const today = startOfToday();

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen && !inline) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, inline]);
  /* ================================================= */

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  );

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();

  const startingDayIndex = firstDayOfMonth.getDay();

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const prevMonth = () => {
    const prev = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1,
    );
    if (isBefore(prev, new Date(today.getFullYear(), today.getMonth(), 1)))
      return;
    setCurrentMonth(prev);
  };

  /* ================= VALIDATION HELPER ================= */
  const isRangeBlocked = (start: Date, end: Date) => {
    // If we have no disabled dates, never blocked
    if (disabledDates.length === 0) return false;

    // Check if any disabled date falls within [start, end]
    // We must check every disabled date
    // Or iterate days in range. Iterating disabled dates is usually faster if interval is long.
    // Iterating range is safer for logic if many disabled dates.
    // Let's use simple check: is there any d in disabledDates such that start <= d <= end?
    return disabledDates.some((d) => {
      // Normalize to midnight for accurate comparison
      const dTime = startOfToday().setTime(d.getTime()); // Just timestamp comparison actually safe if all are dates
      // But safer to compare timestamps
      return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
    });
  };
  /* ===================================================== */

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );

    if (isBefore(clickedDate, today)) return;
    if (disabledDates.some((d) => isSameDay(d, clickedDate))) return;

    if (!startDate || endDate) {
      // Start new range
      onChange(clickedDate, null);
    } else {
      // Complete range
      let newStart = startDate;
      let newEnd = clickedDate;

      if (isBefore(clickedDate, startDate)) {
        newStart = clickedDate;
        newEnd = startDate;
      }

      // CHECK BLOCKAGE
      if (isRangeBlocked(newStart, newEnd)) {
        // Option 1: Reset and start new range at clicked date
        onChange(clickedDate, null);
        // Option 2: Show error? (Component is controlled, so we just don't set the range)
        // Let's go with Option 1: The user likely wants to pick this date, so start a new range.
      } else {
        onChange(newStart, newEnd);
        if (!inline) setIsOpen(false);
      }
    }
  };

  const isSelected = (day: number) => {
    if (!startDate) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );

    if (endDate) {
      return (
        isSameDay(date, startDate) ||
        isSameDay(date, endDate) ||
        (isBefore(startDate, date) && isBefore(date, endDate))
      );
    }
    return isSameDay(date, startDate);
  };

  const isRangeStart = (day: number) =>
    startDate &&
    isSameDay(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
      startDate,
    );

  const isRangeEnd = (day: number) =>
    endDate &&
    isSameDay(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
      endDate,
    );

  const isDisabled = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    return (
      isBefore(date, today) || disabledDates.some((d) => isSameDay(d, date))
    );
  };

  const themeClasses = {
    dark: {
      bg: "bg-zinc-900",
      text: "text-white",
      border: "border-white/10",
      subText: "text-gray-500",
      hover: "hover:bg-blue-500/10 hover:text-blue-400",
      disabled: "text-zinc-700 bg-zinc-800/50 opacity-50",
      rangeBg: "bg-blue-500/20 text-blue-400",
      navHover: "hover:bg-white/5",
      buttonBg: "bg-white/5",
      buttonBorder: "border-white/10",
    },
    light: {
      bg: "bg-white",
      text: "text-gray-900",
      border: "border-gray-100",
      subText: "text-gray-400",
      hover: "hover:bg-blue-50 hover:text-blue-600",
      disabled: "text-gray-300 bg-gray-50",
      rangeBg: "bg-blue-50 text-blue-700",
      navHover: "hover:bg-gray-50",
      buttonBg: "bg-white",
      buttonBorder: "border-gray-200",
    },
  };

  const t = themeClasses[theme];

  const CalendarContent = (
    <div
      className={`${
        inline ? "w-full" : "absolute top-full left-0 mt-3 w-[340px] z-9999"
      } ${t.bg} rounded-3xl border ${t.border} p-6`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className={`p-2 rounded-xl ${t.navHover}`}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className={`font-bold ${t.text}`}>
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button onClick={nextMonth} className={`p-2 rounded-xl ${t.navHover}`}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-bold text-gray-500 py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startingDayIndex }).map((_, i) => (
          <div key={i} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const disabled = isDisabled(day);
          const selected = isSelected(day);
          const start = isRangeStart(day);
          const end = isRangeEnd(day);
          const inRange = selected && !start && !end;

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => handleDateClick(day)}
              className={`
                h-10 rounded-xl text-sm font-medium transition
                ${disabled ? t.disabled : t.hover}
                ${start || end ? "bg-blue-600 text-white" : ""}
                ${inRange ? t.rangeBg : ""}
                ${!selected && !disabled ? t.subText : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (inline) return <div className={className}>{CalendarContent}</div>;

  return (
    <div ref={pickerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center gap-3 ${t.buttonBg} ${t.buttonBorder} border rounded-2xl px-4 py-3 min-w-[300px]`}
      >
        <CalendarIcon className={`h-5 w-5 ${t.subText}`} />
        <div className="flex-1 text-left">
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Rental Period
          </p>
          <p className={`text-sm font-bold ${t.text}`}>
            {startDate ? format(startDate, "MMM dd, yyyy") : "Start"}
            {" - "}
            {endDate ? format(endDate, "MMM dd, yyyy") : "End"}
          </p>
        </div>

        {startDate && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onChange(null, null);
            }}
            className="p-1 rounded-full hover:bg-white/10"
          >
            <X className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="relative z-9999"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {CalendarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
