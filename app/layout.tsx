import type { Metadata } from "next";
import { Poppins, Crimson_Pro, Montserrat, Outfit, Inter, Barlow_Condensed } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import FadeInSection from "./Fade";
import NavBarWrapper from "./components/NavBarWrapper";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
import VisitTracker from "./components/VisitTracker";
import { CartProvider } from "./lib/CartContext";
import { SiteConfigProvider } from "./lib/SiteConfigContext";
import AnnouncementDrop from "./components/AnnouncementDrop";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const crimsonPro = Crimson_Pro({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-crimson",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const outfit = Outfit({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Kawempe Muslim Secondary School | Go Higher",
  description:
    "Kawempe Muslim Secondary School is a prestigious educational institution committed to academic excellence and holistic development.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${poppins.variable} ${crimsonPro.variable} ${montserrat.variable} ${outfit.variable} ${inter.variable} ${barlowCondensed.variable} font-sans antialiased`}>
        <Suspense fallback={null}>
          <VisitTracker />
        </Suspense>
        <ScrollToTop />
        <NavBarWrapper />
        <main>
          <div className="relative">
            <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-50/50" />}>
              <SiteConfigProvider>
                <CartProvider>
                  <AnnouncementDrop />
                  <FadeInSection delay={0}>
                    {children}
                  </FadeInSection>
                </CartProvider>
              </SiteConfigProvider>
            </Suspense>
          </div>
        </main>
        <BackToTop />
      </body>
    </html>
  );
}
