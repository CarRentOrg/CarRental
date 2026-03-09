"use client";

import { differenceInDays, parseISO } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface BreakdownProps {
  dailyPrice: number;
  rentalDays: number;
  rentalTotal: number;
  driverFee?: number;
  depositPaid?: number;
  remainingPayment?: number;
  withDriver?: boolean;
}

export default function RentalBreakdownCard({
  dailyPrice,
  rentalDays,
  rentalTotal,
  driverFee = 0,
  depositPaid = 0,
  remainingPayment,
  withDriver = false,
}: BreakdownProps) {
  const fmt = (n: number) => formatCurrency(n) + "₮";
  const remaining = remainingPayment ?? rentalTotal + driverFee - depositPaid;

  return (
    <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5 space-y-3">
      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
        Түрээсийн мэдээлэл
      </h3>

      {/* Line items */}
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-zinc-300">
          <span>Өдрийн үнэ</span>
          <span className="font-semibold text-white">{fmt(dailyPrice)}</span>
        </div>
        <div className="flex justify-between text-zinc-300">
          <span>Түрээсийн хоног</span>
          <span className="font-semibold text-white">{rentalDays} хоног</span>
        </div>
        <div className="flex justify-between text-zinc-300">
          <span>Түрээсийн нийт дүн</span>
          <span className="font-semibold text-white">{fmt(rentalTotal)}</span>
        </div>

        {withDriver && (
          <div className="flex justify-between text-zinc-300">
            <span>Жолоочийн хөлс</span>
            <span className="font-semibold text-white">{fmt(driverFee)}</span>
          </div>
        )}

        {depositPaid > 0 && (
          <div className="flex justify-between text-emerald-400">
            <span>Барьцаа төлсөн</span>
            <span className="font-semibold">-{fmt(depositPaid)}</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 my-2" />

      {/* Total */}
      <div className="flex justify-between items-center pt-1">
        <span className="text-base font-bold text-white">
          {depositPaid > 0 ? "Үлдэгдэл төлбөр" : "Нийт дүн"}
        </span>
        <span className="text-xl font-black text-blue-400">
          {fmt(remaining)}
        </span>
      </div>
    </div>
  );
}
