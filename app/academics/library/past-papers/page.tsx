"use client";

import React, { useState, useEffect } from 'react';
import Footer from '@/app/components/Footer';
import LibraryNavBar from '@/app/components/LibraryNavBar';
import PastPapersHero from '@/app/components/PastPapersHero';
import LibraryHamburgerMenu from '@/app/components/LibraryHamburgerMenu';
import ChooseExamLevel from '@/app/components/ChooseExamLevel';
import WhyChooseSection from '@/app/components/WhyChooseSection';
import SubjectAlphabetSection from '@/app/components/SubjectAlphabetSection';
import { FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/app/lib/supabase';

interface PastPaper {
    id: string;
    title: string;
    subject: string;
    level: string;
    year: number;
    term: number | null;
    paper_type: string;
    file_url: string;
    file_size: string | null;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
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

export default function PastPapersPage() {
    const [papers, setPapers] = useState<PastPaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        const { data, error } = await supabase
            .from('past_papers')
            .select('*')
            .order('year', { ascending: false });

        if (data) setPapers(data);
        if (error) console.error('Error fetching papers:', error);
        setLoading(false);
    };

    const filteredPapers = filter === "all"
        ? papers
        : papers.filter(p => p.level === filter);

    // Get counts per level for display
    const levelCounts = {
        "o-level": papers.filter(p => p.level === "o-level").length,
        "a-level": papers.filter(p => p.level === "a-level").length,
        "idaad": papers.filter(p => p.level === "idaad").length,
        "uce": papers.filter(p => p.level === "uce").length,
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Floating Hamburger Menu */}
            <LibraryHamburgerMenu />

            {/* Navigation Bar Section - Hidden on mobile, hamburger menu is used instead */}
            <div id="library-nav-section" className="hidden md:block bg-white pt-24 pb-4">
                <LibraryNavBar />
            </div>

            {/* Past Papers Hero Section */}
            <PastPapersHero />

            {/* Choose Your Exam Level Section */}
            <ChooseExamLevel />

            {/* Why Choose Section */}
            <WhyChooseSection />

            {/* Subject Alphabet Section */}
            <SubjectAlphabetSection level="o-level" />

            {/* Papers Listing Section */}
            <section className="py-10 md:py-14 px-4 md:px-12 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-xs md:text-sm lg:text-base font-bold text-slate-900 mb-1 font-montserrat uppercase tracking-tight">
                            Browse Past Papers
                        </h2>
                        <p className="text-[9px] md:text-[10px] text-slate-600 font-inter leading-relaxed">
                            Filter by program and download papers instantly
                        </p>
                    </motion.div>

                    {/* Filter Tabs */}
                    <motion.div
                        className="flex flex-wrap gap-2 mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        {[
                            { id: "all", label: "All" },
                            { id: "o-level", label: `O Level (${levelCounts["o-level"]})` },
                            { id: "idaad", label: `Idaad (${levelCounts["idaad"]})` },
                            { id: "uce", label: `UCE (${levelCounts["uce"]})` },
                            { id: "a-level", label: `A Level (${levelCounts["a-level"]})` },
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`
                                        px-2.5 py-1 rounded-full text-[10px] font-bold transition-all font-inter uppercase tracking-wider
                                        ${filter === cat.id
                                        ? "bg-[#1a0b2e] text-amber-400 shadow-md translate-y-[-1px]"
                                        : "bg-white text-slate-500 border border-slate-200 hover:border-amber-200 hover:text-amber-600"}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </motion.div>

                    {/* Papers Grid */}
                    {loading ? (
                        <div className="text-center py-16 text-slate-400">
                            <p className="text-sm">Loading papers...</p>
                        </div>
                    ) : filteredPapers.length > 0 ? (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {filteredPapers.map((paper) => (
                                <motion.a
                                    key={paper.id}
                                    href={paper.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.01, y: -2 }}
                                    className="bg-white rounded-xl p-3 md:p-4 border border-slate-100 hover:shadow-md transition-all group cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                            <FileText size={16} />
                                        </div>
                                        <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-inter uppercase tracking-wide">
                                            {paper.year}
                                        </span>
                                    </div>
                                    <h3 className="text-[11px] font-bold text-slate-800 mb-2 font-montserrat leading-tight group-hover:text-amber-600 transition-colors">{paper.title}</h3>
                                    <div className="flex items-center justify-between mt-3 text-[9px] text-slate-500 font-inter">
                                        <span className="flex items-center gap-1.5">
                                            <Download size={10} /> {paper.file_size || "PDF"}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 font-semibold text-[9px] hover:bg-amber-100 transition-colors uppercase tracking-wide">
                                            Download
                                        </span>
                                    </div>
                                </motion.a>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-16 text-slate-400">
                            <p className="text-sm">No past papers found for this category.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
