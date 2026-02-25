"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserAuthProvider } from "@/contexts/UserAuthContext";
import { OwnerAuthProvider } from "@/contexts/OwnerAuthContext";
import { AppProvider as DataProvider } from "@/contexts/AppContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import FullPageLoader from "@/components/ui/FullPageLoader";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import ImageKitProvider from "@/contexts/ImageKitProvider";

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
        className={` ${interDisplay.className} font-outfit antialiased min-h-screen flex flex-col`}
      >
        <Toaster position="top-right" />
        <Suspense fallback={null}>
          <LoadingProvider>
            <UserAuthProvider>
              <OwnerAuthProvider>
                <DataProvider>
                  <LanguageProvider>
                    <ImageKitProvider>
                      <FullPageLoader />

                      {!isAdminPage && <Header />}
                      <main className="grow">{children}</main>
                      {!isAdminPage && pathname === "/" && <Footer />}
                    </ImageKitProvider>
                  </LanguageProvider>
                </DataProvider>
              </OwnerAuthProvider>
            </UserAuthProvider>
          </LoadingProvider>
        </Suspense>
      </body>
    </html>
  );
}
