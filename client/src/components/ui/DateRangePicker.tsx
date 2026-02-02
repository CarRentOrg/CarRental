"use client";

import { useState } from "react";
import { format, addDays, startOfToday, isBefore, isSameDay } from "date-fns";
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
  theme = "light",
  inline = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfToday());

  const today = startOfToday();
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
  const startingDayIndex = firstDayOfMonth.getDay(); // 0 = Sunday

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
    // Don't go back past current month if it's the current month (optional constraint)
    if (isBefore(prev, new Date(today.getFullYear(), today.getMonth(), 1)))
      return;
    setCurrentMonth(prev);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );

    if (isBefore(clickedDate, today)) return;
    // Check if disabled
    if (disabledDates.some((d) => isSameDay(d, clickedDate))) return;

    if (!startDate || (startDate && endDate)) {
      // New selection
      onChange(clickedDate, null);
    } else {
      // Completing the range
      if (isBefore(clickedDate, startDate)) {
        onChange(clickedDate, startDate);
      } else {
        onChange(startDate, clickedDate);
      }
      if (!inline) setIsOpen(false);
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

  const isRangeStart = (day: number) => {
    if (!startDate) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    return isSameDay(date, startDate);
  };

  const isRangeEnd = (day: number) => {
    if (!endDate) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    return isSameDay(date, endDate);
  };

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
      shadow: "shadow-xl shadow-blue-900/10",
    },
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
      shadow: "shadow-none",
    },
  };

  const t = themeClasses[theme];

  const CalendarContent = (
    <div
      className={`${inline ? "w-full" : "absolute top-full left-0 mt-3 w-[340px] z-50"} ${t.bg} rounded-3xl ${!inline && t.shadow} ${t.border} ${!inline && "border"} p-6`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className={`p-2 rounded-xl text-gray-500 ${t.navHover}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className={`font-bold ${t.text}`}>
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={nextMonth}
          className={`p-2 rounded-xl text-gray-500 ${t.navHover}`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-bold text-gray-500 uppercase py-2"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startingDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const disabled = isDisabled(day);
          const selected = isSelected(day);
          const start = isRangeStart(day);
          const end = isRangeEnd(day);
          // Highlight range middle
          const inRange = selected && !start && !end;

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => handleDateClick(day)}
              className={`
                relative h-10 w-full flex items-center justify-center text-sm font-medium transition-all rounded-xl
                ${disabled ? `${t.disabled} cursor-not-allowed` : t.hover}
                ${start ? "bg-blue-600 text-white z-10 hover:bg-blue-700 hover:text-white !opacity-100" : ""}
                ${end ? "bg-blue-600 text-white z-10 hover:bg-blue-700 hover:text-white !opacity-100" : ""}
                ${inRange ? t.rangeBg : ""}
                ${!selected && !disabled ? t.subText : ""}
                ${selected ? "!opacity-100" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (inline) {
    return <div className={className}>{CalendarContent}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Input Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-3 ${t.buttonBg} ${t.buttonBorder} border rounded-2xl px-4 py-3 min-w-[300px] hover:border-gray-300 transition-colors text-left`}
      >
        <CalendarIcon className={`h-5 w-5 ${t.subText}`} />
        <div className="flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Rental Period
          </p>
          <p className={`text-sm font-bold truncate ${t.text}`}>
            {startDate ? format(startDate, "MMM dd, yyyy") : "Select Start"}
            {" - "}
            {endDate ? format(endDate, "MMM dd, yyyy") : "Select End"}
          </p>
        </div>
        {startDate && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onChange(null, null);
            }}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </button>

      {/* Dropdown Calendar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
          >
            {CalendarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
