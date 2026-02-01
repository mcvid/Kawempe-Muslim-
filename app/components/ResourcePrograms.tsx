"use client";

import { Award, ScrollText, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type Program = {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
};

const programs: Program[] = [
    {
        id: "o-level",
        title: "O Level",
        description: "Lower secondary education following the UNEB curriculum.",
        href: "/academics/library/past-papers/o-level",
        icon: GraduationCap,
    },
    {
        id: "idaad",
        title: "Idaad",
        description: "Islamic preparatory program focusing on religious and academic foundations.",
        href: "/academics/library/past-papers/idaad",
        icon: ScrollText,
    },
    {
        id: "uce",
        title: "UCE",
        description: "National secondary examination under the Uganda National Examinations Board.",
        href: "/academics/library/past-papers/uce",
        icon: Award,
    },
    {
        id: "a-level",
        title: "A Level",
        description: "Advanced secondary education preparing students for university studies.",
        href: "/academics/library/past-papers/a-level",
        icon: BookOpen,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

export default function ResourcePrograms() {
    return (
        <section className="py-12 md:py-16 px-4 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="mb-8 md:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 mb-2 md:mb-3">
                        Popular Programs
                    </h2>
                    <p className="text-sm md:text-base text-slate-600 max-w-3xl">
                        Explore our most popular UNEB and UNECIT programs and begin your exam preparation today.
                    </p>
                </motion.div>

                {/* Programs Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {programs.map((program) => {
                        const Icon = program.icon;
                        return (
                            <motion.div key={program.id} variants={itemVariants}>
                                <Link
                                    href={program.href}
                                    className="group block bg-[#fff5f0] rounded-xl md:rounded-2xl p-5 md:p-6 hover:shadow-lg transition-all duration-300 h-full"
                                >
                                    {/* Icon */}
                                    <div className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 text-slate-700 group-hover:text-green-600 transition-colors">
                                        <Icon size={28} strokeWidth={1.5} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-sm md:text-base font-bold text-slate-900 mb-1.5 group-hover:text-green-600 transition-colors">
                                        {program.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                                        {program.description}
                                    </p>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
