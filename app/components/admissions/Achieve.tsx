"use client";
import React, { useEffect, useRef, useState } from "react";
import { Trophy, TrendingUp, Award } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

// Animated Card Component with Intersection Observer
const AnimatedCard = ({
    children,
    delay = 0,
    direction = "up",
}: {
    children: React.ReactNode;
    delay?: number;
    direction?: "up" | "left" | "right";
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    const getInitialTransform = () => {
        switch (direction) {
            case "left":
                return "translate-x-[-30px]";
            case "right":
                return "translate-x-[30px]";
            default:
                return "translate-y-[30px]";
        }
    };

    return (
        <div
            ref={ref}
            className={`
                transform transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${getInitialTransform()}`}
            `}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const Achieve = () => {
    return (
        <section className={`py-12 sm:py-16 lg:py-20 bg-white ${poppins.variable}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Staggered Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* Left Column - Offset upward */}
                    <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                        {/* Card 1: Years of Academic Excellence */}
                        <AnimatedCard delay={0} direction="left">
                            <div className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-red-200 transition-all duration-500 flex items-center justify-between cursor-default">
                                <div className="flex flex-col">
                                    <span className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 ${poppins.className} group-hover:text-red-500 transition-colors duration-300`}>
                                        39+
                                    </span>
                                    <span className={`text-lg sm:text-xl font-medium text-gray-800 mt-1 ${poppins.className}`}>
                                        Years of Academic
                                    </span>
                                    <span className={`text-lg sm:text-xl font-medium text-gray-800 ${poppins.className}`}>
                                        Excellence
                                    </span>
                                </div>
                                <div className="relative group-hover:scale-110 transition-transform duration-500">
                                    <TrendingUp strokeWidth={1.5} className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 transition-colors duration-300" />
                                    <Award strokeWidth={1.5} className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 absolute -top-2 -right-2 animate-pulse" />
                                </div>
                            </div>
                        </AnimatedCard>

                        {/* Card 3: Champions of Sports - offset down */}
                        <AnimatedCard delay={200} direction="left">
                            <div className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-yellow-200 transition-all duration-500 flex items-center justify-between md:mt-8 lg:mt-12 cursor-default">
                                <div className="flex flex-col">
                                    <span className={`text-lg sm:text-xl font-semibold text-gray-900 ${poppins.className}`}>
                                        Champions of
                                    </span>
                                    <span className={`text-lg sm:text-xl font-semibold text-gray-900 ${poppins.className}`}>
                                        National School
                                    </span>
                                    <span className={`text-lg sm:text-xl font-semibold text-gray-900 ${poppins.className}`}>
                                        Sports
                                    </span>
                                </div>
                                <Trophy strokeWidth={1.5} className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500 group-hover:scale-110 transition-all duration-500" />
                            </div>
                        </AnimatedCard>
                    </div>

                    {/* Right Column - Offset downward */}
                    <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 md:mt-16 lg:mt-24">
                        {/* Card 2: Top 10 Nationally */}
                        <AnimatedCard delay={100} direction="right">
                            <div className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-blue-200 transition-all duration-500 flex items-center justify-between cursor-default">
                                <div className="flex flex-col">
                                    <span className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 ${poppins.className} group-hover:text-blue-600 transition-colors duration-300`}>
                                        Top 10
                                    </span>
                                    <span className={`text-lg sm:text-xl font-medium text-gray-800 mt-1 ${poppins.className}`}>
                                        Nationally in
                                    </span>
                                    <span className={`text-lg sm:text-xl font-medium text-gray-800 ${poppins.className}`}>
                                        Science Subjects
                                    </span>
                                </div>
                                {/* Podium Icon with animation */}
                                <div className="relative flex items-end gap-1 group-hover:scale-110 transition-transform duration-500">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-6 sm:w-4 sm:h-8 bg-blue-500 rounded-t-sm group-hover:h-10 transition-all duration-500"></div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <Award strokeWidth={1.5} className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mb-1 group-hover:text-yellow-500 transition-colors duration-300" />
                                        <div className="w-4 h-10 sm:w-5 sm:h-12 bg-blue-500 rounded-t-sm group-hover:h-14 transition-all duration-500"></div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-4 sm:w-4 sm:h-6 bg-blue-500 rounded-t-sm group-hover:h-8 transition-all duration-500"></div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedCard>

                        {/* Card 4: Boarding & Day Facilities - offset down */}
                        <AnimatedCard delay={300} direction="right">
                            <div className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-green-200 transition-all duration-500 md:mt-8 lg:mt-12 cursor-default">
                                <div className="flex flex-col">
                                    <span className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 ${poppins.className} group-hover:text-green-600 transition-colors duration-300`}>
                                        100%
                                    </span>
                                    <span className={`text-lg sm:text-xl font-medium text-gray-800 mt-1 ${poppins.className}`}>
                                        Boarding & Day
                                    </span>
                                    <span className={`text-lg sm:text-xl font-medium text-gray-800 ${poppins.className}`}>
                                        Facilities
                                    </span>
                                </div>
                            </div>
                        </AnimatedCard>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Achieve;
