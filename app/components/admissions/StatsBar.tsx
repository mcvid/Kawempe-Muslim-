"use client";
import React from "react";
import { GraduationCap, Users, UserCheck } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-poppins",
});

const stats = [
    {
        icon: GraduationCap,
        count: "2000+",
        label: "Students",
    },
    {
        icon: Users,
        count: "1654+",
        label: "Guardians",
    },
    {
        icon: UserCheck, // Using UserCheck as a proxy for "Teacher at board" or simpler icon
        count: "185",
        label: "Teachers.",
    },
];

const StatsBar = () => {
    return (
        <section className={`py-12 bg-white ${poppins.variable}`}>
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group flex items-center gap-6 px-10 py-8 bg-[#FFF9F2] rounded-3xl w-full md:w-auto min-w-[300px] hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#FFF9F2]"
                        >
                            {/* Icon */}
                            <div className="relative">
                                <stat.icon strokeWidth={1.5} className="w-16 h-16 text-black" />
                            </div>

                            {/* Text */}
                            <div className="flex flex-col">
                                <span className={`text-3xl font-medium text-black ${poppins.className}`}>
                                    {stat.count}
                                </span>
                                <span className={`text-lg text-slate-800 ${poppins.className}`}>
                                    {stat.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsBar;
