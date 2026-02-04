"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface StaffCarouselProps {
    items: React.ReactNode[];
}

export default function StaffCarousel({ items }: StaffCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // If no items, return nothing
    if (!items || items.length === 0) {
        return (
            <div className="py-10 text-center text-slate-400 italic">
                No staff members found in this category.
            </div>
        );
    }

    const handleDragEnd = (event: any, info: PanInfo) => {
        const swipeThreshold = 50;
        if (info.offset.x < -swipeThreshold) {
            if (currentIndex < items.length - 1) setCurrentIndex(v => v + 1);
        } else if (info.offset.x > swipeThreshold) {
            if (currentIndex > 0) setCurrentIndex(v => v - 1);
        }
    };

    return (
        <div className="relative w-full h-[520px] overflow-hidden flex flex-col items-center justify-center -mx-4">
            <div
                className="relative w-full h-full flex items-center justify-center p-4"
                style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
            >
                <AnimatePresence initial={false}>
                    {items.map((item, index) => {
                        const offset = index - currentIndex;
                        // Only render cards that are close to the center for performance
                        if (Math.abs(offset) > 2) return null;

                        return (
                            <motion.div
                                key={index}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={handleDragEnd}
                                initial={false}
                                animate={{
                                    x: offset * 220, // Distance between cards
                                    scale: index === currentIndex ? 1 : 0.85,
                                    rotateY: offset * -40, // 3D rotation
                                    z: index === currentIndex ? 0 : -200, // Depth
                                    opacity: 1 - Math.abs(offset) * 0.4,
                                    zIndex: 20 - Math.abs(offset),
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 26
                                }}
                                className="absolute w-[80%] max-w-[300px] pointer-events-auto cursor-grab active:cursor-grabbing"
                            >
                                {/* Visual indicator for inactive cards */}
                                <div className={`${index !== currentIndex
                                        ? 'pointer-events-none filter blur-[1px]'
                                        : ''
                                    } transition-all duration-500`}>
                                    {item}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Pagination Indicator */}
            <div className="flex gap-2.5 mt-2 mb-4">
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "bg-red-600 w-6" : "bg-slate-200"
                            }`}
                    />
                ))}
            </div>

            {/* Swipe Hint */}
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 opacity-60 flex items-center gap-3">
                <span className="w-6 h-0.5 bg-slate-100 rounded-full" />
                Swipe to Explore
                <span className="w-6 h-0.5 bg-slate-100 rounded-full" />
            </div>
        </div>
    );
}
