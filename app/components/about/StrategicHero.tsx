"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
    {
        image: '/c1.jpg',
        title: "National Academic Excellence",
        subtitle: "KMSS consistently ranks among the top performers in Uganda National Examinations year after year."
    },
    {
        image: '/c2.jpg',
        title: "Champions in Co-curricular",
        subtitle: "Elite achievements in sports, particularly our award-winning girls' football team, competing at national levels."
    },
    {
        image: '/c3.jpg',
        title: "Modern Learning Infrastructure",
        subtitle: "A continuous journey of upgrading our labs, libraries and classrooms to provide a world-class environment."
    }
];

const StrategicHero = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-slate-900 group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={slides[current].image}
                        alt="Achievements"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </motion.div>
            </AnimatePresence>

            {/* Achievement Badge/Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-4 font-[var(--font-barlow)]">
                            {slides[current].title}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-200 max-w-2xl font-medium tracking-wide">
                            {slides[current].subtitle}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-12 h-1.5 rounded-full transition-all duration-500 ${idx === current ? 'bg-amber-400 w-20' : 'bg-white/30'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default StrategicHero;
