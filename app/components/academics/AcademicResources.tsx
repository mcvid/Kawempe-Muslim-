"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { FileText, Download, Search, Filter, BookOpen, Calendar, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Orbitron } from "next/font/google";

const schoolFont = Orbitron({
    subsets: ["latin"],
    weight: ["400", "700"],
});

interface Paper {
    id: string;
    title: string;
    subject: string;
    level: string;
    year: string;
    term: string;
    paper_type: string;
    file_url: string;
    downloads: number;
    created_at: string;
}

const AcademicResources = () => {
    const [papers, setPapers] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('past_papers')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setPapers(data);
        setLoading(false);
    };

    const handleDownload = async (paper: Paper) => {
        // Increment download count
        try {
            await supabase.rpc('increment_downloads', { paper_id: paper.id });
        } catch {
            // If the RPC doesn't exist yet, we can update normally
            await supabase
                .from('past_papers')
                .update({ downloads: paper.downloads + 1 })
                .eq('id', paper.id);
        }

        // Open file
        window.open(paper.file_url, '_blank');
    };

    // Derived lists for filter dropdowns
    const uniqueSubjects = ['All', ...new Set(papers.map(p => p.subject))].sort();

    // Filter logic
    const filteredPapers = papers.filter(paper => {
        const matchesLevel = selectedLevel === 'All' || paper.level === selectedLevel;
        const matchesSubject = selectedSubject === 'All' || paper.subject === selectedSubject;
        const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.subject.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesLevel && matchesSubject && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-16 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">

                {/* Header Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center space-y-6 pb-10 border-b border-slate-200"
                >
                    <div className="space-y-4 max-w-3xl mx-auto">
                        <h1 className={`${schoolFont.className} text-4xl sm:text-7xl font-black text-slate-900 tracking-tighter uppercase`}>
                            Academic <span className="text-green-600">Resources</span>
                        </h1>
                        <p className="text-slate-500 text-base sm:text-xl font-light leading-relaxed">
                            Download exams, notes, and revision materials to excel in your studies.
                            <span className="hidden sm:inline"> Access past papers and study guides from our extensive archive.</span>
                        </p>
                    </div>

                    {/* Quick Link */}
                    <div className="flex justify-center">
                        <Link
                            href="/academics/study-tips"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-slate-900 font-bold rounded-full hover:bg-amber-500 transition-all text-sm uppercase tracking-wider shadow-lg"
                        >
                            <BookOpen size={18} />
                            View Study Tips
                        </Link>
                    </div>
                </motion.div>

                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col md:flex-row flex-wrap gap-4 p-6 bg-white rounded-2xl shadow-lg border border-slate-100"
                >
                    {/* Search Box */}
                    <div className="flex-[2] min-w-[280px] relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search papers by title or subject..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full py-3 pl-12 pr-4 border border-slate-200 rounded-xl text-base focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Level Filter */}
                        <div className="relative flex-1">
                            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            <select
                                value={selectedLevel}
                                onChange={e => setSelectedLevel(e.target.value)}
                                className="w-full appearance-none py-3 pl-10 pr-10 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 cursor-pointer hover:border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                            >
                                <option value="All">All Classes</option>
                                <option value="S1">Senior 1</option>
                                <option value="S2">Senior 2</option>
                                <option value="S3">Senior 3</option>
                                <option value="S4">Senior 4</option>
                                <option value="S5">Senior 5</option>
                                <option value="S6">Senior 6</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Subject Filter */}
                        <div className="relative flex-1">
                            <BookOpen size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            <select
                                value={selectedSubject}
                                onChange={e => setSelectedSubject(e.target.value)}
                                className="w-full appearance-none py-3 pl-10 pr-10 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 cursor-pointer hover:border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                            >
                                {uniqueSubjects.map(subject => (
                                    <option key={subject} value={subject}>
                                        {subject === 'All' ? 'All Subjects' : subject}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </motion.div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500"
                            >
                                <Loader2 size={48} className="animate-spin text-green-600 mb-4" />
                                <p className="text-lg font-medium">Loading resources...</p>
                            </motion.div>
                        ) : filteredPapers.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500"
                            >
                                <FileText size={64} className="text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-700 mb-2">No papers found</h3>
                                <p className="text-slate-500">Try adjusting your search or filters.</p>
                            </motion.div>
                        ) : (
                            filteredPapers.map((paper, index) => (
                                <motion.div
                                    key={paper.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-2xl p-6 flex gap-4 border border-slate-100 hover:shadow-xl transition-all duration-300"
                                >
                                    {/* File Icon */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-14 h-16 rounded-lg flex items-center justify-center font-bold text-xs relative overflow-hidden ${paper.file_url.endsWith('.pdf')
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {paper.file_url.endsWith('.pdf') ? 'PDF' : 'DOC'}
                                            {/* Corner fold effect */}
                                            <div className={`absolute top-0 right-0 w-0 h-0 border-l-[12px] border-b-[12px] border-l-transparent ${paper.file_url.endsWith('.pdf')
                                                ? 'border-b-red-200'
                                                : 'border-b-blue-200'
                                                }`} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col min-w-0">
                                        {/* Meta */}
                                        <div className="flex items-center gap-2 mb-2 text-xs">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 font-bold rounded-md uppercase">
                                                {paper.level}
                                            </span>
                                            <span className="text-slate-500 font-medium truncate">
                                                {paper.subject}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-base font-bold text-slate-800 leading-tight mb-2 line-clamp-2">
                                            {paper.title}
                                        </h3>

                                        {/* Details */}
                                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {paper.year} Term {paper.term}
                                            </span>
                                            <span>{paper.paper_type}</span>
                                        </div>

                                        {/* Download Button */}
                                        <button
                                            onClick={() => handleDownload(paper)}
                                            className="mt-auto w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200"
                                        >
                                            <Download size={16} />
                                            Download
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default AcademicResources;
