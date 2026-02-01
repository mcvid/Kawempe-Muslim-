"use client";
import React from "react";
import Image from "next/image";
import { Crimson_Pro, Poppins } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";

const crimson = Crimson_Pro({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-crimson",
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    variable: "--font-poppins",
});

const AdmissionsHero = () => {
    return (
        <section className={`relative min-h-[500px] lg:min-h-[700px] flex items-center bg-[#ffffff] overflow-hidden pt-24 lg:pt-40 ${crimson.variable} ${poppins.variable}`}>

            {/* Background Watermark / Doodles */}
            <div
                className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: "url('/doodle-pattern.png')",
                    backgroundSize: "400px",
                    backgroundRepeat: "repeat"
                }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-100" />
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pb-12">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start"
                    >
                        {/* Logo & Tagline Group */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="hidden lg:block relative w-16 h-16 lg:w-24 lg:h-24 shrink-0">
                                <Image src="/logo.png" alt="Kawempe Muslim Secondary School" fill className="object-contain" />
                            </div>
                            <h3 className={`${crimson.className} text-xl lg:text-2xl text-slate-800 tracking-wide font-medium`}>
                                GO HIGHER...!
                            </h3>
                        </div>

                        <h1 className={`${poppins.className} text-3xl lg:text-5xl font-bold text-black leading-[1.1] mb-6 tracking-tight`}>
                            Nurturing Excellence, <br className="hidden lg:block" />
                            Inspiring Innovation.
                        </h1>

                        <p className={`${crimson.className} text-lg lg:text-xl text-slate-700 leading-relaxed mb-8 max-w-xl`}>
                            Join Uganda&apos;s leading Islamic Secondary Institution and Academic Distinction.
                            Admissions for the 2026 Academic Year are now open.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link
                                href="/admissions/apply"
                                className="px-6 py-3 bg-[#1e6091] text-white font-bold rounded-lg hover:bg-[#184e77] transition-all text-sm tracking-wide uppercase"
                            >
                                Apply Online Now
                            </Link>
                            <Link
                                href="/admissions/visit"
                                className="px-6 py-3 bg-[#facc15] text-[#1e6091] font-bold rounded-lg hover:bg-[#eab308] transition-all text-sm tracking-wide uppercase"
                            >
                                Schedule A Visit
                            </Link>
                        </div>

                    </motion.div>

                    {/* Right Content - Student Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 w-full max-w-sm lg:max-w-md flex items-center justify-center p-4 lg:p-0"
                    >
                        <div className="relative w-full aspect-[3/4] max-h-[400px] lg:max-h-[500px] rounded-[30px] overflow-hidden border border-slate-100">
                            <Image
                                src="/wemps images/prefect1.jpg"
                                alt="Proud Student"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </motion.div>

                </div>
            </div>

        </section>
    );
};

export default AdmissionsHero;
