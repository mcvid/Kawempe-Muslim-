"use client";

import { motion } from "framer-motion";

type Stat = {
    value: string;
    label: string;
};

const stats: Stat[] = [
    { value: "10K+", label: "Past Papers" },
    { value: "20+", label: "Subjects" },
    { value: "40+", label: "Years" },
    { value: "100+", label: "Downloads" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" as const },
    },
};

export default function TrustedByStudents() {
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
                        Trusted by Students
                    </h2>
                    <p className="text-sm md:text-base text-slate-600 max-w-3xl">
                        Join thousands of students from Kawempe Muslim Secondary School preparing to excel in UNEB and UNECIT examinations.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-slate-100 rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-xs text-slate-600">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
