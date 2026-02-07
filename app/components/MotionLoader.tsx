"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MotionLoaderProps {
    minimal?: boolean;
    onComplete?: () => void;
    minDuration?: number;
}

export default function MotionLoader({ minimal = false, onComplete, minDuration = 3000 }: MotionLoaderProps) {
    const [animationComplete, setAnimationComplete] = useState(false);
    const schoolName = "KAWEMPE MUSLIM SECONDARY SCHOOL";
    const letters = Array.from(schoolName);

    useEffect(() => {
        if (onComplete) {
            const timer = setTimeout(() => {
                setAnimationComplete(true);
                onComplete();
            }, minDuration);
            return () => clearTimeout(timer);
        }
    }, [onComplete, minDuration]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.03,
                delayChildren: 0.2,
            },
        },
    } as const;

    const letterVariants = {
        hidden: { opacity: 0, scale: 0.5, y: 10 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    } as const;

    const lineVariants = {
        hidden: { width: 0, opacity: 0 },
        visible: {
            width: "100%",
            opacity: 1,
            transition: {
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
            },
        },
    } as const;

    if (minimal) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
                <div className="relative w-12 h-12 mb-4">
                    <motion.div
                        className="absolute inset-0 border-2 border-red-600/20 rounded-xl"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-0 border-t-2 border-red-600 rounded-xl"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>
                <span className="text-[10px] font-poppins font-black text-red-600 uppercase tracking-[0.3em] animate-pulse">
                    Loading
                </span>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white min-h-[100dvh] overflow-hidden"
        >
            {/* Geometric Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="loader-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A1A1B" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#loader-grid)" />
                </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                {/* Identity Shield Draw Animation */}
                <div className="w-20 h-20 md:w-24 md:h-24 mb-8 md:mb-12 relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-red-600">
                        <motion.path
                            d="M20,10 L80,10 L90,50 L50,90 L10,50 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M35,40 L50,25 L65,40 L50,55 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0, scale: 0.8, opacity: 0 }}
                            animate={{ pathLength: 1, scale: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                        />
                    </svg>
                    {/* Inner Pulse */}
                    <motion.div
                        className="absolute inset-4 bg-red-600/5 rounded-full blur-2xl"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>

                {/* Staggered School Name */}
                <motion.div
                    variants={containerVariants}
                    className="flex flex-wrap justify-center gap-x-[0.15em] max-w-xs md:max-w-lg px-4 md:px-6 mb-6 md:mb-8"
                >

                    {letters.map((letter, index) => (
                        <motion.span
                            key={index}
                            variants={letterVariants}
                            className={`text-base md:text-2xl font-poppins font-black tracking-tighter ${letter === " " ? "w-1.5 md:w-2" : "text-[#1A1A1B]"}`}
                        >
                            {letter}
                        </motion.span>
                    ))}

                </motion.div>

                {/* Fintech Progress Bar */}
                <div className="w-48 h-[2px] bg-slate-100 rounded-full overflow-hidden relative">
                    <motion.div
                        variants={lineVariants}
                        className="absolute top-0 left-0 h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,1)]"
                    />
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-6 text-[10px] font-inter font-black text-slate-400 uppercase tracking-[0.4em] italic"
                >
                    Go Higher
                </motion.p>
            </div>
        </motion.div>
    );
}
