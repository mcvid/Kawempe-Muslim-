"use client";
import { Crimson_Pro } from "next/font/google";
import { motion } from "framer-motion";
import AspirationGallery from "./AspirationGallery";

const schoolFont = Crimson_Pro({
  subsets: ["latin"],
  weight: "400",
});

const Mission = () => {
  return (
    <section className="bg-white py-20 lg:py-32 overflow-hidden text-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: IMAGE GALLERY (Shared Component) */}
          <div className="order-2 lg:order-1 mt-12 lg:mt-0">
            <AspirationGallery
              images={[
                "/b1.png",
                "/hm.png",
                "/b2.png"
              ]}
            />
          </div>

          {/* RIGHT: CONTENT */}
          <div className="flex flex-col gap-6 lg:gap-10 order-1 lg:order-2">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl tracking-[0.2em] font-light text-slate-400 uppercase ${schoolFont.className} mb-4`}>
                School Mission
              </h2>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] font-light text-slate-800 ${schoolFont.className}`}>
                To Produce Versatile Individuals through Quality Education and Islamic Values to address Global Challenges
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Mission;
