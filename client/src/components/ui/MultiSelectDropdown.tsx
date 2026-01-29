"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface MultiSelectDropdownProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
}

export default function MultiSelectDropdown({
  options,
  selected,
  onChange,
  label,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const getLabel = () => {
    if (selected.length === 0) return label;
    if (selected.length === 1) return selected[0]; // Show the single selected item
    return `${selected.length} Selected`;
  };

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-all
          ${
            isOpen || selected.length > 0
              ? "border-white/30 bg-white/10 text-white"
              : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
          }
        `}
      >
        <span>{getLabel()}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#121212] p-2 shadow-xl backdrop-blur-xl z-50">
          <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar p-1">
            {options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/5"
                >
                  <div
                    className={`
                      flex h-5 w-5 items-center justify-center rounded border transition-all
                      ${
                        isSelected
                          ? "border-white bg-white text-black"
                          : "border-white/30 bg-transparent"
                      }
                    `}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 stroke-3" />}
                  </div>
                  <span className={isSelected ? "text-white" : "text-gray-300"}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
