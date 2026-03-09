import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (val: number | string | undefined | null) => {
  if (val === undefined || val === null || val === "") return "0 ₮";
  const num = Number(String(val).replace(/[^0-9]/g, ""));
  return num.toLocaleString("en-US") + " ₮";
};
