"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  error?: string | boolean;
  disabled?: boolean;
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  onSubmit,
  error,
  disabled = false,
}: OTPInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleContainerClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Only allow numbers
    const numericValue = rawValue.replace(/[^0-9]/g, "");

    if (numericValue.length <= length) {
      onChange(numericValue);
    }
  };

  // Create an array of length for rendering boxes
  const digitBoxes = Array.from({ length }, (_, i) => {
    const char = value[i] || "";
    const isCurrentActive = value.length === i;
    const isLastActive = value.length === length && i === length - 1;
    const active = isFocused && (isCurrentActive || isLastActive);

    return (
      <div
        key={i}
        className={`relative flex items-center justify-center flex-1 h-14 sm:h-16 rounded-xl border-2 text-xl font-bold transition-colors ${
          error
            ? "border-red-500/50 text-white bg-red-500/10"
            : active
              ? "border-blue-500 bg-zinc-900 text-white"
              : char
                ? "border-zinc-700 bg-zinc-900 text-white"
                : "border-zinc-800 bg-zinc-950 text-zinc-500"
        }`}
      >
        {char ? (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {char}
          </motion.span>
        ) : null}
        {active && !char && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            className="w-[2px] h-6 bg-blue-500 rounded-full"
          />
        )}
      </div>
    );
  });

  return (
    <div
      className="relative flex justify-between gap-2 w-full cursor-text"
      onClick={handleContainerClick}
    >
      {/* Hidden Input field specifically configured for Mobile OTP */}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={length}
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-text"
        style={{
          color: "transparent",
          background: "transparent",
          caretColor: "transparent",
        }}
        aria-label="One-time password input"
      />

      {/* Digit Boxes rendered separately */}
      {error ? (
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [-5, 5, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
          className="flex justify-between w-full gap-2"
        >
          {digitBoxes}
        </motion.div>
      ) : (
        <div className="flex justify-between w-full gap-2">{digitBoxes}</div>
      )}
    </div>
  );
}
