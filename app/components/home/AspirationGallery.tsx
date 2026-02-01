"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface AspirationGalleryProps {
    images: string[];
}

const AspirationGallery: React.FC<AspirationGalleryProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll logic for mobile
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[600px] flex items-center justify-center">

            {/* MOBILE: AUTO-SCROLL CAROUSEL (Visible only on small/medium screens) */}
            <div className="lg:hidden relative w-full h-full max-w-[400px] flex items-center justify-center overflow-hidden rounded-[2.5rem] shadow-2xl bg-slate-100">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={images[currentIndex]}
                            alt="School Aspiration"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Carousel Indicators */}
                <div className="absolute bottom-6 flex gap-2 z-10">
                    {images.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 transition-all duration-300 rounded-full ${i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40"}`}
                        />
                    ))}
                </div>
            </div>

            {/* DESKTOP: STAGGERED HANGING FRAMES (Visible only on large screens) */}
            <div className="hidden lg:block relative w-full h-full">
                {/* Strings coming from top */}
                <div className="absolute top-0 left-[15%] w-[1px] h-[50px] bg-slate-300 -translate-y-full" />
                <div className="absolute top-0 left-[50%] w-[1px] h-[100px] bg-slate-300 -translate-y-full" />
                <div className="absolute top-0 right-[15%] w-[1px] h-[70px] bg-slate-300 -translate-y-full" />

                <div className="relative w-full h-full">
                    {/* Top Left Image */}
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="absolute top-0 left-0 w-[45%] aspect-[4/5] p-3 bg-white shadow-2xl rounded-sm group transform rotate-[-2deg]"
                    >
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-4 bg-slate-500 rounded-sm z-10 flex items-center justify-center">
                            <div className="w-4 h-[1px] bg-white/50" />
                        </div>
                        <div className="relative w-full h-full">
                            <Image src={images[0]} fill className="object-cover transition-all duration-500" alt="Gallery 1" />
                        </div>
                    </motion.div>

                    {/* Top Right Image */}
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="absolute top-[10%] right-0 w-[45%] aspect-[4/5] p-3 bg-white shadow-2xl rounded-sm group transform rotate-[3deg]"
                    >
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-4 bg-slate-500 rounded-sm z-10 flex items-center justify-center">
                            <div className="w-4 h-[1px] bg-white/50" />
                        </div>
                        <div className="relative w-full h-full">
                            <Image src={images[2]} fill className="object-cover transition-all duration-500" alt="Gallery 3" />
                        </div>
                    </motion.div>

                    {/* Bottom Middle Image (Overlapping & Staggered) */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="absolute bottom-0 left-[27.5%] w-[45%] aspect-[4/5] p-3 bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] rounded-sm z-10 group"
                    >
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-4 bg-slate-500 rounded-sm z-10 flex items-center justify-center">
                            <div className="w-4 h-[1px] bg-white/50" />
                        </div>
                        <div className="relative w-full h-full">
                            <Image src={images[1]} fill className="object-cover transition-all duration-500" alt="Gallery 2" />
                        </div>
                    </motion.div>
                </div>
            </div>

        </div>
    );
};

export default AspirationGallery;
