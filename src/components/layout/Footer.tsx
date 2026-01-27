"use client";

import Link from "next/link";
import {
  Car,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0e0e0e] text-gray-300 rounded-xl">
      <div className="container mx-auto px-4 md:px-12 py-12 md:py-5">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-white">
              <Car className="h-8 w-8 text-gray-500" />
              <span className="text-xl font-bold tracking-tight">
                Car<span className="text-gray-500">Rent</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">{t("footer.description")}</p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-gray-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-gray-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-gray-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/cars"
                  className="hover:text-white transition-colors"
                >
                  {t("footer.fleet")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-white transition-colors"
                >
                  {t("footer.pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  {t("footer.faq")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.support")}
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  {t("footer.helpCenter")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  {t("footer.termsOfService")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  className="hover:text-white transition-colors"
                >
                  {t("footer.bookingGuide")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.contactInfo")}
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>{t("footer.address")}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span>support@carrent.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-xs">
          <p>
            &copy; {new Date().getFullYear()} CarRent.{" "}
            {t("footer.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
