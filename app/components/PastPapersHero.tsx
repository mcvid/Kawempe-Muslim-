"use client";

import { Users, FileText, User } from "lucide-react";
import { motion } from "framer-motion";

type Stat = {
    icon: React.ElementType;
    label: string;
    value: string;
};

type PastPapersHeroProps = {
    level?: string; // e.g., "O Level", "Idaad", "UCE", "A Level"
    description?: string;
    stats?: Stat[];
};

const defaultStats: Stat[] = [
    { icon: FileText, label: "Subjects", value: "30" },
    { icon: FileText, label: "Total papers", value: "3210+" },
    { icon: User, label: "Need help contact", value: "JON DOE" },
];

export default function PastPapersHero({
    level,
    description,
    stats = defaultStats
}: PastPapersHeroProps) {
    const titleText = level
        ? <>Kawempe Muslim Secondary School <span className="text-amber-400">{level}</span> Past Papers</>
        : "Kawempe Muslim Secondary School Past Papers";

    const descriptionText = description ||
        (level
            ? `Download KMSS ${level} Past Papers & Resources`
            : "Access comprehensive past papers for O-Level, Idaad, UCE, and A-Level. Free, instant, and reliable.");

    return (
        <section className="bg-[#1a0b2e] text-white py-12 md:py-16 px-4 md:px-12">
            <motion.div
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" as const }}
            >
                {/* Title */}
                <h1 className="text-base md:text-xl lg:text-2xl font-bold font-montserrat mb-3 tracking-tight">
                    {titleText}
                </h1>

                {/* Horizontal Line */}
                <div className="w-12 h-1 bg-amber-500/80 mb-5 rounded-full" />

                {/* Description */}
                <p className="text-[10px] md:text-xs text-slate-300 max-w-xl mb-8 leading-relaxed font-inter opacity-90">
                    {descriptionText}
                </p>

                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
                        }
                    }}
                >
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                                className="flex items-center gap-4 px-5 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 w-full transition-all cursor-default"
                            >
                                <div className="w-11 h-11 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                                    <Icon size={20} className="text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-inter uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-sm font-bold text-white font-montserrat">{stat.value}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
        </section>
    );
}
