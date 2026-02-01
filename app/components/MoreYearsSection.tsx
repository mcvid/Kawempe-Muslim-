"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useParams } from 'next/navigation';

interface YearOption {
    year: string;
    filesCount: number;
}

interface MoreYearsSectionProps {
    subjectName: string;
    subjectCode?: string;
    years: YearOption[];
}

export default function MoreYearsSection({
    subjectName,
    subjectCode = "553/1",
    years
}: MoreYearsSectionProps) {
    const params = useParams();
    const currentYear = params.year as string;
    const levelSlug = params.level as string;
    const subjectSlug = params.subject as string;

    return (
        <section className="py-20 px-4 md:px-12 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto text-center">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-3 font-montserrat">
                        More {subjectName} {subjectCode} Years
                    </h2>
                    <p className="text-slate-500 font-inter text-sm">
                        Explore past papers from other years for {subjectName} {subjectCode}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                    {years.map((y, idx) => {
                        const isCurrent = y.year === currentYear;

                        return (
                            <Link
                                key={y.year}
                                href={`/academics/library/past-papers/${levelSlug}/${subjectSlug}/${y.year}`}
                                className="relative group"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className={`
                                        w-48 md:w-56 h-28 md:h-32 rounded-[2rem] flex items-center justify-center transition-all duration-300 shadow-sm
                                        ${isCurrent
                                            ? 'bg-[#0f0721] text-white'
                                            : 'bg-slate-200/80 text-slate-800 hover:bg-slate-300'
                                        }
                                    `}
                                >
                                    {/* Status Badge */}
                                    <div className={`
                                        absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md
                                        ${isCurrent ? 'bg-green-600' : 'bg-green-800'}
                                    `}>
                                        {isCurrent ? (
                                            <Check size={16} className="text-white" strokeWidth={3} />
                                        ) : (
                                            <span className="text-white text-[10px] font-bold">{y.filesCount}</span>
                                        )}
                                    </div>

                                    <span className="text-3xl md:text-4xl font-bold font-montserrat tracking-tight">
                                        {y.year}
                                    </span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
