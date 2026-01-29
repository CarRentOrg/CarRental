import { RENTAL_RATE } from "@/types";

export const getActiveDailyPrice = (
  rates: RENTAL_RATE[],
  date: Date = new Date(),
): number => {
  const ts = date.getTime();

  const seasonal = rates.find(
    (r) =>
      r.start_date &&
      r.end_date &&
      ts >= new Date(r.start_date).getTime() &&
      ts <= new Date(r.end_date).getTime(),
  );

  if (seasonal) return seasonal.price_per_day;

  const base = rates.find((r) => r.season === null);
  return base?.price_per_day ?? 0;
};
