"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
    {
        id: 1,
        image: '/c1.jpg',
        text: (
            <>
                <p className="mb-4">
                    At KMSS we build strong minds, guided by Islamic values and discipline.
                </p>
                <p>
                    We shape tomorrow’s leaders with purpose, integrity, and community spirit
                </p>
            </>
        )
    },
    {
        id: 2,
        image: '/c2.jpg',
        text: (
            <>
                <p className="mb-4">
                    At KMSS we strive for excellence, achieving strong results in UCE and UACE,
                </p>
                <p>
                    Encouraging critical thinking and lifelong learning, and preparing students for higher education.
                </p>
            </>
        )
    },
    {
        id: 3,
        image: '/c3.jpg',
        text: (
            <>
                <p className="mb-4">
                    At KMSS we celebrate diverse talents, with standout achievements in girls’ football and other activities,
                </p>
                <p>
                    Encouraging teamwork, creativity, and confidence, beyond the classroom
                </p>
            </>
        )
    }
];

const AboutActivities = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[600px] md:h-[750px] w-full overflow-hidden bg-slate-900 group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={slides[current].image}
                        alt="School activity"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Darker overlay on mobile for readability */}
                    <div className="absolute inset-0 bg-black/20 md:bg-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Text Box Overlay - Flush Left */}
            <div className="absolute inset-y-0 left-0 flex items-center z-20 h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gray-200/95 backdrop-blur-md h-auto md:h-auto min-h-[50%] md:min-h-0 md:py-16 p-8 md:px-16 md:pl-20 max-w-[90%] md:max-w-xl shadow-2xl flex items-center"
                    >
                        <div className="text-slate-800 text-lg md:text-2xl font-medium leading-relaxed font-[var(--font-barlow)]">
                            {slides[current].text}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>



            {/* Pagination Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${idx === current ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default AboutActivities;
