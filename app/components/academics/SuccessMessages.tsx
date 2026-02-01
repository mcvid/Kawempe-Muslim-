"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, Settings } from 'lucide-react';
import { Crimson_Pro } from "next/font/google";

const schoolFont = Crimson_Pro({
    subsets: ["latin"],
    weight: "400",
});

export const SuccessMessages = () => {
    return (
        <section className="bg-[#E5E9EC] py-20 lg:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* LEFT: VIDEO PLAYER BOX */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative group lg:order-1 h-full min-h-[400px]"
                    >
                        <div className="relative w-full h-full bg-[#D1D5D9] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20">
                            {/* Video Player */}
                            <video
                                src="/students walking.mp4"
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        </div>
                    </motion.div>

                    {/* RIGHT: TEXT CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col gap-6 lg:order-2"
                    >
                        <p className={`text-xl md:text-2xl lg:text-3xl leading-relaxed text-slate-800 font-medium ${schoolFont.className}`}>
                            Thriving in a well-structured Islamic high school institution is more demanding than it appears.
                            Excelling academically at Kawempe Muslim School requires more than inspiration—it calls for discipline,
                            consistency, strong values, and access to the right academic support systems.
                            <br /><br />
                            This page brings together everything you need to succeed, balancing faith, excellence, and modern learning strategies.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
