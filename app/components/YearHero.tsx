"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, User } from 'lucide-react';
import Image from 'next/image';

interface YearHeroProps {
    level: string;
    subjectName: string;
    subjectCode?: string;
    description?: string;
    year: string;
    papersCount: number;
    classesCount: number;
    teacher: {
        name: string;
        avatar?: string;
    };
}

export default function YearHero({
    level,
    subjectName,
    subjectCode = "553/1",
    description,
    year,
    papersCount,
    classesCount,
    teacher
}: YearHeroProps) {
    const defaultDescription = `Download all ${subjectName} ${level} Accounting - ${subjectCode} Past Papers, Mark Schemes, and Examiner Reports`;

    return (
        <section className="bg-[#1E3A8A] text-white py-12 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-8 text-[11px] uppercase tracking-wide text-blue-200 font-medium">
                    <span className="hover:text-white transition-colors cursor-default">{level}</span>
                    <span>/</span>
                    <span className="hover:text-white transition-colors cursor-default">{subjectName} {subjectCode}</span>
                    <span>/</span>
                    <span className="text-white">{year}</span>
                </nav>

                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tracking-tight leading-tight">
                        {subjectName} {subjectCode} Past Papers
                    </h1>
                    {/* Horizontal Line */}
                    <div className="w-full h-[1px] bg-blue-800/50 mb-6" />

                    <p className="text-sm text-blue-100 max-w-2xl mb-10 leading-relaxed opacity-90">
                        {description || defaultDescription}
                    </p>
                </motion.div>

                {/* Info Cards Row */}
                <motion.div
                    className="flex flex-wrap items-center gap-3 md:gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {/* Past Papers Card */}
                    <div className="bg-white/10 text-white rounded-lg px-4 py-2.5 flex items-center gap-3 min-w-[120px] border border-white/5">
                        <FileText className="w-5 h-5 text-blue-200 flex-shrink-0" strokeWidth={1.5} />
                        <div>
                            <p className="text-[10px] font-medium text-blue-200 uppercase tracking-wide leading-none mb-1">Past Papers</p>
                            <p className="text-sm font-bold leading-none">{papersCount}</p>
                        </div>
                    </div>

                    {/* Classes Card */}
                    <div className="bg-white/10 text-white rounded-lg px-4 py-2.5 flex items-center gap-3 min-w-[100px] border border-white/5">
                        <Users className="w-5 h-5 text-blue-200 flex-shrink-0" strokeWidth={1.5} />
                        <p className="text-sm font-bold whitespace-nowrap leading-none">{classesCount} Classes</p>
                    </div>

                    {/* Teacher Contact Card */}
                    <div className="bg-white/10 text-white rounded-lg px-4 py-2.5 flex items-center gap-3 border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-blue-800 overflow-hidden flex-shrink-0 border border-white/10">
                            {teacher.avatar ? (
                                <Image src={teacher.avatar} alt={teacher.name} width={32} height={32} className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-700 text-white">
                                    <User className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-[10px] font-medium text-blue-200 uppercase tracking-wide leading-none mb-1">Need help contact</p>
                            <p className="text-sm font-bold leading-none">{teacher.name}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
