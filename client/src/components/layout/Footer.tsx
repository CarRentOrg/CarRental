"use client";

import Link from "next/link";
import { Instagram, Phone, Mail, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import NavLink from "../shared/navLink";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="w-full px-4 sm:px-10 2xl:px-24 pb-10 text-gray-300">
      <div className="bg-[#0a0a0a] rounded-[2.5rem] px-6 sm:px-12 py-16">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-16">
          <span className="text-lg font-semibold text-white">Luxerra</span>

          <div className="flex gap-4 text-gray-400">
            <Link href="https://www.instagram.com">
              <Instagram className="h-4 w-4 hover:text-white cursor-pointer" />
            </Link>
            <Link href="https://wa.me/123456789">
              <MessageCircle className="h-4 w-4 hover:text-white cursor-pointer" />
            </Link>
            <Link href="tel:+123456789">
              <Phone className="h-4 w-4 hover:text-white cursor-pointer" />
            </Link>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
          {/* ADDRESS */}
          <div className="space-y-6 text-xs">
            <div>
              <p className="text-gray-400 mb-2">
                Office Address (08 AM — 10 PM)
              </p>
              <Link href="https://www.google.com/maps">
                {t("footer.address")}
              </Link>
            </div>

            <div>
              <p className="text-gray-400 mb-1"> {t("footer.phoneNumber")}</p>
              <p className="text-white font-medium">+1 (323) 555-7842</p>
            </div>

            <div>
              <p className="text-gray-400 mb-1"> {t("footer.email")}</p>
              <p className="text-white font-medium">info@luxerra.com</p>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="mb-2 text-xs font-semibold text-white">
              {t("footer.company")}
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <NavLink href="/cars" className="hover:text-white">
                  {t("nav.cars")}
                </NavLink>
              </li>
              <li>
                <NavLink href="/#rental-terms" className="hover:text-white">
                  {t("nav.rentalTerms")}
                </NavLink>
              </li>
              <li>
                <NavLink href="/#rental-guide" className="hover:text-white">
                  How To Rent
                </NavLink>
              </li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h3 className="mb-2 text-xs font-semibold text-white">
              {t("footer.helpCenter")}
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <NavLink href="/booking" className="hover:text-white">
                  {t("footer.booking")}
                </NavLink>
              </li>
              <li>
                <NavLink href="/#faq" className="hover:text-white">
                  {t("footer.faq")}
                </NavLink>
              </li>
              <li>
                <NavLink href="/privacy-policy" className="hover:text-white">
                  {t("footer.privacyPolicy")}
                </NavLink>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="mb-2 text-xs font-medium text-gray-400">
              Join our mailing list and never miss an update!
            </h3>

            <div className="flex items-center bg-[#141414] rounded-full">
              <input
                type="email"
                placeholder="Your Email"
                className="flex-1 bg-transparent px-6 py-3 text-xs text-white placeholder-gray-500 focus:outline-none"
              />
              <button className="bg-white text-black text-xs font-medium px-6 py-3 rounded-full">
                Submit
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              By subscribing to our newsletter, you agree to receive emails from
              us and accept our{" "}
              <NavLink href="/privacy-policy" className="text-white">
                {t("footer.privacyPolicy")}
              </NavLink>
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-16 text-xs text-gray-500">
          © 2026 Luxerra. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
