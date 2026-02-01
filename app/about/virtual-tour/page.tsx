import type { Metadata } from "next";
import VirtualTour from "@/app/components/about/VirtualTour";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Virtual Campus Tour | Kawempe Muslim Secondary School",
  description: "Take a 360-degree virtual tour of Kawempe Muslim Secondary School campus and facilities from the comfort of your home.",
};

export default function Page() {
  return (
    <div className="pt-28 overflow-hidden">
      <VirtualTour />
      <Footer />
    </div>
  );
}
