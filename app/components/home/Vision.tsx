"use client";
import { Crimson_Pro } from "next/font/google";
import { motion } from "framer-motion";
import FadeInSection from "../../Fade";
import AspirationGallery from "./AspirationGallery";

const schoolFont = Crimson_Pro({
  subsets: ["latin"],
  weight: "400",
});

const Vision = () => {
  return (
    <section className="bg-[#ECF7F8] py-32 overflow-hidden text-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* LEFT: CONTENT */}
          <div className="flex flex-col gap-10">
            <FadeInSection delay={200}>
              <h2 className={`text-4xl lg:text-5xl tracking-[0.2em] font-light text-slate-400 uppercase ${schoolFont.className} mb-4`}>
                School Vision
              </h2>
            </FadeInSection>

            <FadeInSection delay={300}>
              <p className={`text-3xl lg:text-4xl xl:text-5xl leading-[1.1] font-light text-slate-800 ${schoolFont.className}`}>
                A fountain of enlightened and skilled young men and women rooted in Islamic values.
              </p>
            </FadeInSection>
          </div>

          {/* RIGHT: IMAGE GALLERY (Shared Component) */}
          <div className="order-2 mt-12 lg:mt-0">
            <AspirationGallery images={["/b3.png", "/c2.jpg", "/c1.jpg"]} />
          </div>

        </div>
      </div>

    </section>
  );
};

export default Vision;
