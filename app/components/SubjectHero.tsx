"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, ChevronDown, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SubjectHeroProps {
    level: string;
    subjectName: string;
    subjectCode?: string;
    description?: string;
    papersCount: number;
    yearsCount: number;
    teacher: {
        name: string;
        avatar?: string;
    };
}

export default function SubjectHero({
    level,
    subjectName,
    subjectCode = "553/1",
    description,
    papersCount,
    yearsCount,
    teacher
}: SubjectHeroProps) {
    const defaultDescription = `Download all ${subjectName} ${level} ${subjectCode} Past Papers, Mark Schemes, and Examiner Reports`;

    return (
        <section className="bg-[#1E3A8A] text-white py-12 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-8 text-[11px] uppercase tracking-wide text-blue-200 font-medium">
                    <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                    <span>/</span>
                    <Link href="/academics/library/past-papers" className="hover:text-white transition-colors">LIBRARY</Link>
                    <span>/</span>
                    <Link href={`/academics/library/past-papers/${level.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-colors">{level}</Link>
                    <span>/</span>
                    <span className="text-white">{subjectName}</span>
                </nav>

                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight leading-tight">
                        {subjectName} {subjectCode} Past Papers
                    </h1>
                    {/* Horizontal Line */}
                    <div className="w-full h-[1px] bg-blue-800/50 mb-6" />

                    <p className="text-sm text-blue-100 max-w-2xl mb-10 leading-relaxed opacity-90">
                        {description || defaultDescription}
                    </p>
                </motion.div>

                {/* Info Cards Grid */}
                <motion.div
                    className="flex flex-wrap items-center gap-3 md:gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {/* Past Papers Card */}
                    <div className="bg-white/10 text-white rounded-lg px-4 py-3 flex items-center gap-3 md:gap-4 min-w-[140px] border border-white/5">
                        <div className="bg-blue-900/30 p-1.5 rounded flex-shrink-0">
                            <FileText className="w-5 h-5 text-blue-200" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-medium text-blue-200 uppercase tracking-wide leading-none mb-1">Past Papers</p>
                            <p className="text-base font-bold leading-none">{papersCount}</p>
                        </div>
                    </div>

                    {/* Years Card */}
                    <div className="bg-white/10 text-white rounded-lg px-4 py-3 flex items-center gap-3 md:gap-4 min-w-[140px] border border-white/5">
                        <div className="bg-blue-900/30 p-1.5 rounded flex-shrink-0">
                            <Clock className="w-5 h-5 text-blue-200" strokeWidth={1.5} />
                        </div>
                        <p className="text-base font-bold leading-none">{yearsCount} years</p>
                    </div>

                    {/* Teacher Contact Card */}
                    <div className="bg-white/10 text-white rounded-lg px-4 py-3 flex items-center gap-3 md:gap-4 border border-white/5">
                        <div className="w-9 h-9 rounded-full bg-blue-800 overflow-hidden flex-shrink-0">
                            {teacher.avatar ? (
                                <Image src={teacher.avatar} alt={teacher.name} width={36} height={36} className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-700 text-white">
                                    <User className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-[10px] font-medium text-blue-200 uppercase tracking-wide leading-none mb-1">Need help contact</p>
                            <p className="text-sm font-bold leading-none">{teacher.name}</p>
                        </div>
                    </div>

                    {/* Dropdown Button */}
                    <button className="bg-white/10 text-blue-100 rounded-lg w-12 h-12 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0 border border-white/5">
                        <ChevronDown className="w-6 h-6" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
