"use client";
import { Crimson_Pro } from "next/font/google";
import { motion } from "framer-motion";
import AspirationGallery from "./AspirationGallery";

const schoolFont = Crimson_Pro({
  subsets: ["latin"],
  weight: "400",
});

const CoreValues = () => {
  return (
    <section className="bg-white py-20 lg:py-32 overflow-hidden text-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: IMAGE GALLERY (Shared Component) */}
          <div className="order-2 lg:order-1 mt-12 lg:mt-0">
            <AspirationGallery images={["/c2.jpg", "/c3.jpg", "/c4.jpg"]} />
          </div>

          {/* RIGHT: CONTENT (Bullets) */}
          <div className="flex flex-col gap-6 lg:gap-10 order-1 lg:order-2">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl tracking-[0.2em] font-light text-slate-400 uppercase ${schoolFont.className} mb-4`}>
                Core Values
              </h2>
            </motion.div>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ul className={`flex flex-col gap-6 sm:gap-8 lg:gap-10 text-3xl lg:text-4xl xl:text-5xl leading-[1.1] font-light text-slate-800 ${schoolFont.className}`}>
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-6"
                >
                  <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-slate-800 shrink-0" />
                  Fear Allah
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-6"
                >
                  <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-slate-800 shrink-0" />
                  Academic Excellence
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-6"
                >
                  <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-slate-800 mt-[0.5em] shrink-0" />
                  Ethics and integrity and team work
                </motion.li>
              </ul>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CoreValues;
