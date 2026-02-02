"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { usePathname } from "next/navigation";

import { AppProvider } from "@/contexts/AppContext";

const interDisplay = Inter({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-inter-display",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body
        className={` ${interDisplay.className} font-outfit antialiased min-h-screen flex flex-col bg-black`}
      >
        <AppProvider>
          <LanguageProvider>
            {!isAdminPage && <Header />}
            <main className="grow">{children}</main>
            {!isAdminPage && <Footer />}
          </LanguageProvider>
        </AppProvider>
      </body>
    </html>
  );
}
