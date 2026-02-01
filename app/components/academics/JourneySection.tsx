"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const JourneySection = () => {
    return (
        <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/Wemps Images/journey-bg.png')" }}
            />

            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative z-10 text-center px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight"
                >
                    Ready to start your journey?
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Link
                        href="/admissions"
                        className="inline-block px-10 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-xl transition-all duration-300 uppercase tracking-widest text-sm md:text-base hover:scale-105 active:scale-95 shadow-xl"
                    >
                        Admissions
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
