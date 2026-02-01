"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ElearningSection = () => {
    return (
        <section className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[650px] overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/Wemps Images/elearning-bg.png')" }}
            />

            {/* Slight overlay for text readability */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Content */}
            <div className="relative z-10 h-full min-h-[500px] md:min-h-[600px] lg:min-h-[650px] flex flex-col justify-between p-6 md:p-10 lg:p-14">

                {/* Top Left - Main Heading */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-xs md:max-w-sm"
                >
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight uppercase tracking-wide">
                        Access<br />
                        Education<br />
                        Anywhere!
                    </h2>
                </motion.div>

                {/* Center - CTA Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex justify-center items-center my-8"
                >
                    <Link
                        href="/academics/e-learning"
                        className="inline-flex items-center gap-3 px-8 md:px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-300 ease-out text-base md:text-lg hover:scale-105 hover:translate-y-[-2px] active:scale-100 group"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                {/* Bottom Right - Subtitle */}
                <div className="self-end text-right">
                    <p className="text-white text-sm md:text-base font-semibold uppercase tracking-wider">
                        Our E-Learning<br />
                        Platform
                    </p>
                </div>
            </div>
        </section>
    );
};
