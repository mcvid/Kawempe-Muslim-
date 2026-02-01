"use client";
import { Crimson_Pro } from "next/font/google";
import { motion } from "framer-motion";
import Image from "next/image";

const schoolFont = Crimson_Pro({
  subsets: ["latin"],
  weight: "400",
});

const Leader = () => {
  return (
    <section className="bg-[#ECF7F8] py-24 lg:py-32 overflow-hidden text-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">

          {/* LEFT: TITLE & HEADBOY */}
          <div className="flex flex-col gap-8 order-1">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={`text-3xl lg:text-4xl tracking-normal font-light text-slate-800 uppercase ${schoolFont.className} mb-4 whitespace-nowrap`}>
                Student Leadership
              </h2>
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" as const }}
              className="flex flex-col gap-6"
            >
              <div className="w-full h-[400px] sm:h-[450px] rounded-[2rem] overflow-hidden shadow-2xl relative">
                <Image src="/head.png" fill className="object-cover" alt="Head Boy" />
              </div>
              <p className={`text-2xl lg:text-3xl tracking-tight font-light text-slate-800 text-center ${schoolFont.className} opacity-80 uppercase`}>
                Headboy 2025-26
              </p>
            </motion.div>
          </div>

          {/* MIDDLE: WELCOME MESSAGE */}
          <div className="flex flex-col gap-8 order-2 lg:order-2 px-4 lg:px-8 lg:min-h-[500px] justify-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6 text-center"
            >
              <p className={`text-l lg:text-1xl leading-relaxed font-light text-slate-700`}>
                On behalf of the student body, I warmly welcome you to our school.
                As Head Boy, I am proud to serve alongside a dedicated prefect team
                committed to discipline, leadership, and academic excellence. Together
                with our teachers and administration, we strive to uphold
                the values of our school and create a positive environment where
                every student can succeed.
              </p>
              <p className={`text-2xl lg:text-3xl font-light text-slate-900 ${schoolFont.className}`}>
                Kaboggoza Hussein
              </p>
            </motion.div>
          </div>

          {/* RIGHT: COLLAGE */}
          <div className="flex flex-col gap-8 order-3">
            <div className="relative h-auto lg:h-[550px] w-full mt-12 lg:mt-0 flex flex-col gap-8 lg:block">
              {/* Top Image: Group */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" as const }}
                className="relative lg:absolute lg:top-0 lg:right-0 w-full h-[250px] rounded-[2rem] overflow-hidden shadow-2xl z-20"
              >
                <Image src="/Wemps Images/prefect1.jpg" fill className="object-cover" alt="Prefects" />
              </motion.div>

              {/* Bottom Image: Mosque/Event */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.2 }}
                className="relative lg:absolute lg:bottom-12 lg:right-0 w-full h-[250px] rounded-[2rem] overflow-hidden shadow-2xl z-10"
              >
                <Image src="/c1.jpg" fill className="object-cover" alt="Mosque Parlour" />
              </motion.div>

              {/* Caption at the very bottom right */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="hidden lg:block absolute bottom-0 right-0"
              >
                <p className={`text-l lg:text-2xl tracking-tight font-light text-slate-800 ${schoolFont.className} opacity-80 uppercase text-right leading-tight`}>
                  Mosque Parlour 2025-26
                </p>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Leader;
