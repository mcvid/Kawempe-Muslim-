"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Volume2, Maximize } from 'lucide-react';

const VideoSection = () => {
    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="relative group cursor-pointer">
                    {/* Main Video Container Shell */}
                    <div className="relative aspect-video w-full bg-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
                        {/* Placeholder / Background Image */}
                        <Image
                            src="/Wemps Images/hero-bg.jpg"
                            alt="School Life Video"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Centered Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-24 h-24 md:w-32 md:h-32 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50"
                            >
                                <Play className="w-10 h-10 md:w-14 md:h-14 text-green-600 fill-green-600 translate-x-1" />
                            </motion.div>
                        </div>

                        {/* Bottom Control Bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex flex-col gap-3">
                                {/* Progress Bar */}
                                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden relative">
                                    <div className="absolute top-0 left-0 h-full w-1/3 bg-green-500 rounded-full" />
                                    <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border border-slate-300" />
                                </div>

                                {/* Controls Row */}
                                <div className="flex items-center justify-between text-white">
                                    <div className="flex items-center gap-6">
                                        <Play size={20} className="fill-white" />
                                        <div className="flex items-center gap-2">
                                            <Volume2 size={20} />
                                            <div className="w-20 h-1 bg-white/20 rounded-full relative">
                                                <div className="absolute top-0 left-0 h-full w-2/3 bg-white rounded-full" />
                                                <div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 opacity-80">
                                        <span className="text-xs font-medium tracking-widest uppercase">HD 1080p</span>
                                        <Maximize size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-100 rounded-full -z-10 blur-3xl opacity-50" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full -z-10 blur-3xl opacity-50" />
                </div>
            </div>
        </section>
    );
};

export default VideoSection;
