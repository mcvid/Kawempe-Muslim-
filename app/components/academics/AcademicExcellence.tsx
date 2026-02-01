"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const AcademicExcellence = () => {
    return (
        <div className="flex items-center justify-center p-4 md:p-8 bg-[#f8fafc]">
            {/* Main Card Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" as const }}
                className="max-w-7xl w-full bg-white border border-[#e5e7eb] rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row p-8 md:p-12 gap-8 md:gap-16 items-center shadow-sm"
            >

                {/* Left Content Side */}
                <div className="flex-1 space-y-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a0a0a] leading-tight tracking-tight">
                        Build your future <br />
                        through rigorous <br />
                        academic study
                    </h2>
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-lg">
                        Build your future through quality education rooted in Islamic values.
                        We offer a balanced curriculum that nurtures academic excellence,
                        strong character, and responsible citizenship within a supportive
                        learning environment.
                    </p>
                    <div className="pt-4">
                        <button className="px-8 py-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors text-lg">
                            Explore Curriculum
                        </button>
                    </div>
                </div>

                {/* Right Image Side */}
                <div className="flex-1 w-full">
                    <div className="relative h-[300px] md:h-[500px] w-full">
                        <Image
                            src="/Wemps Images/chem.jpg"
                            alt="Students studying in lab"
                            fill
                            className="object-cover rounded-[2rem]"
                            priority
                            onError={(e) => {
                                // Fallback if local image fails
                                const target = e.target as HTMLImageElement;
                                target.srcset = "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2070&auto=format&fit=crop";
                            }}
                        />
                    </div>
                </div>

            </motion.div>
        </div>
    );
};
