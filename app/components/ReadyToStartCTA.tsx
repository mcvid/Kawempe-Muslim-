"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ReadyToStartCTA() {
    return (
        <section className="bg-[#1a0b2e] text-white py-12 md:py-16 px-4 md:px-12">
            <motion.div
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                {/* Title */}
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3">
                    Ready to Start Your Exam Preparation?
                </h2>

                {/* Description */}
                <p className="text-sm md:text-base text-slate-300 max-w-2xl mb-5 md:mb-6">
                    Access a wide range of past papers for O-Level, Idaad, UCE, and A-Level across major subjects.
                </p>

                {/* Buttons */}
                <motion.div
                    className="flex flex-wrap items-center gap-3 md:gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Link
                        href="/academics/library/past-papers"
                        className="px-6 md:px-8 py-2.5 md:py-3 bg-[#fff0e5] text-[#1a0b2e] rounded-full font-semibold text-sm md:text-base hover:bg-white transition-colors"
                    >
                        Browse all papers
                    </Link>

                    <button className="flex items-center gap-2 md:gap-3 px-5 md:px-6 py-2.5 md:py-3 rounded-full border border-slate-500 text-slate-300 hover:border-white hover:text-white transition-all text-sm md:text-base">
                        <Search size={18} />
                        <span>Search Papers</span>
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
}
