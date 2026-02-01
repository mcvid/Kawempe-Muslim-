"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getSubjects } from '../academics/library/actions';

type Subject = {
    id: string;
    name: string;
    papersCount: number;
    resourcesCount?: number;
    icon?: string;
};

type GroupedSubjects = {
    [key: string]: Subject[];
};

// Icon mapping for subjects
const iconMap: Record<string, React.ElementType> = {
    'FlaskConical': FlaskConical,
    'Book': Book,
    'Palette': Palette,
    'Languages': Languages,
    'Sprout': Sprout,
    'Calculator': Calculator,
    'Dna': Dna,
    'Globe': Globe,
    'History': History,
    'Scale': Scale,
    'Mathematics': Calculator,
    'Physics': FlaskConical,
    'Chemistry': FlaskConical,
    'Biology': Dna,
    'English': Book,
    'Arabic': Languages,
    'Islamic Studies': BookOpen,
    'Agriculture': Sprout,
    'Art': Palette,
};

import {
    FlaskConical,
    Book,
    Palette,
    Languages,
    Sprout,
    Calculator,
    Dna,
    Globe,
    History,
    Scale,
    Search,
    BookOpen,
    ArrowRight
} from 'lucide-react';

interface SubjectAlphabetSectionProps {
    level?: string; // e.g., "o-level", "a-level", "idaad", "uce"
}

export default function SubjectAlphabetSection({ level = "o-level" }: SubjectAlphabetSectionProps) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setLoading(true);
        getSubjects(level).then(data => {
            setSubjects(data);
            setLoading(false);
        });
    }, [level]);

    const groupedSubjects = useMemo(() => {
        const sorted = [...subjects].sort((a, b) => a.name.localeCompare(b.name));
        return sorted.reduce((acc: GroupedSubjects, subject) => {
            const firstLetter = subject.name[0].toUpperCase();
            if (!acc[firstLetter]) acc[firstLetter] = [];
            acc[firstLetter].push(subject);
            return acc;
        }, {});
    }, [subjects]);

    const alphabet = Object.keys(groupedSubjects).sort();

    const filteredGroups = useMemo(() => {
        let entries = Object.entries(groupedSubjects);

        if (selectedLetter) {
            entries = entries.filter(([letter]) => letter === selectedLetter);
        }

        if (searchTerm) {
            entries = entries.map(([letter, subjects]) => {
                const filtered = subjects.filter(s =>
                    s.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                return [letter, filtered] as [string, Subject[]];
            }).filter(([_, subjects]) => subjects.length > 0);
        }

        return entries;
    }, [groupedSubjects, selectedLetter, searchTerm]);

    return (
        <section className="py-12 px-4 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">

                {/* Search and Filter Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-1">Browse by Subject</h2>
                        <p className="text-xs text-slate-500">Find past papers organized by subject alphabetically</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find a subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Alphabet Bar */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                    <button
                        onClick={() => setSelectedLetter(null)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                            ${selectedLetter === null
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        All
                    </button>
                    {alphabet.map(letter => (
                        <button
                            key={letter}
                            onClick={() => setSelectedLetter(letter)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                ${selectedLetter === letter
                                    ? 'bg-slate-800 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>

                {/* Subject Groups */}
                <div className="space-y-12">
                    <AnimatePresence mode="popLayout">
                        {filteredGroups.map(([letter, subjects]) => (
                            <motion.div
                                key={letter}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-4"
                            >
                                {/* Group Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-9 h-9 bg-slate-200 rounded-xl flex items-center justify-center text-slate-700 font-bold text-sm font-montserrat">
                                        {letter}
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-900 font-montserrat uppercase tracking-tight">Subjects Starting with {letter}</h3>
                                        <p className="text-[9px] text-slate-500 font-inter uppercase tracking-widest">{subjects.length} Subjects</p>
                                    </div>
                                </div>

                                {/* Subjects List */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {subjects.map((subject) => {
                                        const Icon = iconMap[subject.name] || iconMap[subject.icon as any] || Book;
                                        const subjectSlug = subject.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                                        return (
                                            <Link
                                                key={subject.id}
                                                href={`/academics/library/past-papers/${level}/${subjectSlug}`}
                                            >
                                                <motion.div
                                                    whileHover={{ y: -3, scale: 1.02, backgroundColor: "rgba(241, 245, 249, 1)" }}
                                                    className="flex items-center gap-3 p-3 bg-slate-100/50 rounded-xl cursor-pointer transition-all group border border-transparent hover:border-slate-200 hover:shadow-sm h-full"
                                                >
                                                    <div className="w-9 h-9 bg-white rounded-lg shadow-sm flex items-center justify-center text-slate-400 group-hover:text-green-600 transition-colors">
                                                        <Icon size={18} strokeWidth={1.5} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-[11px] font-bold text-slate-800 font-montserrat leading-tight">{subject.name}</h4>
                                                        <p className="text-[9px] text-slate-500 font-inter">{subject.papersCount} papers</p>
                                                    </div>
                                                    <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                                                        <ArrowRight size={10} />
                                                    </div>
                                                </motion.div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredGroups.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-slate-400 font-medium">No subjects found matching your criteria</p>
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedLetter(null); }}
                                className="mt-4 text-xs font-bold text-slate-900 hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
