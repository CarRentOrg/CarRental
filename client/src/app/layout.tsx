"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Login from "@/components/auth/Login";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppProvider } from "@/contexts/App.Context";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

const interDisplay = Inter({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-inter-display",
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <>
      <Toaster position="top-right" />
      <Login />
      {!isAdminPage && <Header />}
      <main className="flex-grow">{children}</main>
      {!isAdminPage && <Footer />}
    </>
  );
}

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
        <AppProvider>
          <LanguageProvider>
            <LayoutContent>{children}</LayoutContent>
          </LanguageProvider>
        </AppProvider>
      </body>
    </html>
  );
}
