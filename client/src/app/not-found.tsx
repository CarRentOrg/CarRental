"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  // Note: useLanguage might not work perfectly in server components, but not-found is a client component here.
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-lg">
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-black leading-none text-white/5 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              Oops!
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t("notFound.title")}</h2>
          <p className="text-gray-400 text-lg">{t("notFound.message")}</p>
        </div>

        <div className="pt-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{t("notFound.backHome")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
