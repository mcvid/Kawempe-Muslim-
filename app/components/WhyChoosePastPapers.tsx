"use client";

import { BookOpen, Download, Award } from "lucide-react";
import { motion } from "framer-motion";

type Feature = {
    icon: React.ElementType;
    title: string;
    description: string;
};

const features: Feature[] = [
    {
        icon: BookOpen,
        title: "Comprehensive Collection",
        description: "Access a wide range of past papers for O-Level, Idaad, UCE, and A-Level across major subjects.",
    },
    {
        icon: Download,
        title: "Instant downloads",
        description: "Download past papers instantly using our fast and reliable system.",
    },
    {
        icon: Award,
        title: "Verified quality",
        description: "All past papers are carefully selected, up-to-date, and aligned with UNEB and UNECIT standards.",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

export default function WhyChoosePastPapers() {
    return (
        <section className="py-16 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900">
                        Why Choose Our Past Papers?
                    </h2>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-slate-100 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Icon */}
                                <div className="w-10 h-10 mb-4 text-slate-700">
                                    <Icon size={28} strokeWidth={1.5} />
                                </div>

                                {/* Title */}
                                <h3 className="text-base font-bold text-slate-900 mb-2">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
