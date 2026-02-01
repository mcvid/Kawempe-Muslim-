"use client";

import { Award, ScrollText, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type ExamLevel = {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
    linkText: string;
};

const examLevels: ExamLevel[] = [
    {
        id: "o-level",
        title: "O Level",
        description: "UNEB subjects with comprehensive past papers",
        href: "/academics/library/past-papers/o-level",
        icon: Award,
        linkText: "Browse O level",
    },
    {
        id: "idaad",
        title: "Idaad",
        description: "Islamic and academic foundation subjects with past papers",
        href: "/academics/library/past-papers/idaad",
        icon: ScrollText,
        linkText: "Browse Idaad",
    },
    {
        id: "uce",
        title: "UCE",
        description: "UNEB examination subjects with verified past papers",
        href: "/academics/library/past-papers/uce",
        icon: BookOpen,
        linkText: "Browse UCE",
    },
    {
        id: "a-level",
        title: "A Level",
        description: "Advanced UNEB subjects with in-depth past papers",
        href: "/academics/library/past-papers/a-level",
        icon: GraduationCap,
        linkText: "Browse A level",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" as const },
    },
};

export default function ChooseExamLevel() {
    return (
        <section className="py-10 md:py-14 px-4 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="mb-6 md:mb-8"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-base md:text-lg lg:text-xl font-bold text-slate-900 mb-2">
                        Choose Your Exam Level
                    </h2>
                    <p className="text-xs md:text-sm text-slate-600 max-w-2xl">
                        Select O-Level, Idaad, UCE, or A-Level to access past papers for your program.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {examLevels.map((level) => {
                        const Icon = level.icon;
                        return (
                            <motion.div key={level.id} variants={itemVariants}>
                                <Link
                                    href={level.href}
                                    className="group block bg-[#fff5f0] rounded-xl p-4 md:p-5 hover:shadow-md transition-all duration-300 h-full"
                                >
                                    {/* Icon */}
                                    <div className="w-8 h-8 mb-3 text-slate-700">
                                        <Icon size={24} strokeWidth={1.5} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                                        {level.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                        {level.description}
                                    </p>

                                    {/* Arrow Link */}
                                    <div className="flex items-center gap-1 text-xs font-medium text-slate-700 group-hover:text-green-600 transition-colors">
                                        {level.linkText}
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
