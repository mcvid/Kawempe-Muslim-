"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface YearOption {
    year: string;
    filesCount: number;
}

interface SubjectYearSectionProps {
    subjectName: string;
    level: string;
    subjectCode?: string;
    years: YearOption[];
    syllabusFilesCount: number;
    levelSlug: string;
    subjectSlug: string;
}

export default function SubjectYearSection({
    subjectName,
    level,
    subjectCode = "7707",
    years,
    syllabusFilesCount,
    levelSlug,
    subjectSlug
}: SubjectYearSectionProps) {

    return (
        <section className="py-16 px-6 md:px-12 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                        Select a Year
                    </h2>
                    <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                        Choose from {years.length} years of {level} {subjectName} - {subjectCode} past papers.
                    </p>
                </div>

                {/* Years Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                    {years.map((y, idx) => (
                        <Link
                            key={y.year}
                            href={`/academics/library/past-papers/${levelSlug}/${subjectSlug}/${y.year}`}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="relative bg-white rounded-xl p-8 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-all group min-h-[140px] border border-slate-100 group-hover:-translate-y-0.5"
                            >
                                {/* Paper Count Badge */}
                                <div className="absolute top-3 right-3 bg-[#1E3A8A] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                                    {y.filesCount}
                                </div>

                                <span className="text-3xl md:text-4xl font-bold text-slate-700 group-hover:text-[#1E3A8A] transition-colors">
                                    {y.year}
                                </span>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Syllabus Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl p-5 md:p-6 flex items-center gap-4 md:gap-5 cursor-pointer shadow-sm hover:shadow-md transition-all border border-slate-100"
                >
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-[#1E3A8A] bg-blue-50 rounded-lg">
                        <FileText className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-sm md:text-base font-bold text-slate-800">View Syllabus</h3>
                        <p className="text-xs text-slate-500 font-medium">{syllabusFilesCount} files available</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
