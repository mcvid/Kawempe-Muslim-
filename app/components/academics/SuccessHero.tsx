"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export const SuccessHero = () => {
    return (
        <div className="relative h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/Wemps Images/Bus.jpg"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                    unoptimized
                />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center">
                {/* Top decorative line */}
                <div className="w-0.5 h-24 md:h-32 bg-green-400 mb-8" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" as const }}
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-10 uppercase tracking-tight max-w-5xl leading-[1.05] drop-shadow-lg">
                        A Conducive <br />
                        Environment For <br />
                        Your Study
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <Link href="/contact" className="inline-block group">
                        <button className="bg-[#fbbf24] hover:bg-[#d97706] text-slate-900 px-10 py-5 rounded-full text-xl md:text-2xl transition-all duration-300 font-bold hover:scale-105 active:scale-95 flex items-center gap-3">
                            Book a visit
                        </button>
                    </Link>
                </motion.div>

                {/* Bottom decorative line */}
                <div className="w-0.5 h-24 md:h-32 bg-green-400 mt-8" />
            </div>

            {/* Bottom Gradient Fade Removed */}
        </div>
    );
};
