import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const interDisplay = Inter({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-inter-display",
});

export const metadata: Metadata = {
  title: "CarRent | Modern Car Rental Platform",
  description:
    "Rent your dream car with ease. Affordable, reliable, and premium car rental services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${interDisplay.className} font-outfit antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
