"use client";

import { FileText, Clock, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

type Feature = {
    icon: React.ElementType;
    title: string;
    description: string;
};

const features: Feature[] = [
    {
        icon: FileText,
        title: "Official Papers",
        description: "Direct from KMEB",
    },
    {
        icon: Clock,
        title: "Instant Access",
        description: "No registration required, download immediately",
    },
    {
        icon: Users,
        title: "Exam Success",
        description: "Proven to improve exam performance",
    },
    {
        icon: CheckCircle,
        title: "Latest Content",
        description: "Regularly updated with new exam papers",
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
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" as const },
    },
};

export default function WhyChooseSection() {
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
                        Why Choose Kawempe Muslim Secondary School Past Papers?
                    </h2>
                    <p className="text-xs md:text-sm text-slate-600 max-w-2xl">
                        Comprehensive exam preparation resources designed for student success
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
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
                                className="bg-[#fff5f0] rounded-xl p-4 md:p-5"
                            >
                                {/* Icon */}
                                <div className="w-8 h-8 mb-3 text-slate-700">
                                    <Icon size={22} strokeWidth={1.5} />
                                </div>

                                {/* Title */}
                                <h3 className="text-sm font-bold text-slate-900 mb-1">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-xs text-slate-600 leading-relaxed">
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
