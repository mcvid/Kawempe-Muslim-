"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { BookOpen, Brain, CheckCircle, Clock, Download, Lightbulb, Target, Zap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Orbitron } from "next/font/google";

const schoolFont = Orbitron({
    subsets: ["latin"],
    weight: ["400", "700"],
});

interface Note {
    id: string;
    title: string;
    subject: string;
    level: string;
    file_url: string;
    created_at: string;
}

const StudyTips = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('past_papers')
            .select('*')
            .eq('paper_type', 'Notes')
            .order('created_at', { ascending: false })
            .limit(5);
        if (data) setNotes(data);
        setLoading(false);
    };

    const tips = [
        {
            title: "Active Recall",
            description: "Don't just re-read your notes. Test yourself! Close the book and try to recite what you learned.",
            icon: Brain,
            color: "green",
            bgColor: "bg-green-100",
            iconColor: "text-green-600",
            borderColor: "border-green-200"
        },
        {
            title: "Spaced Repetition",
            description: "Review material at increasing intervals (1 day, 3 days, 1 week) to move it to long-term memory.",
            icon: Clock,
            color: "blue",
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
            borderColor: "border-blue-200"
        },
        {
            title: "The Pomodoro Technique",
            description: "Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer break.",
            icon: Target,
            color: "red",
            bgColor: "bg-red-100",
            iconColor: "text-red-600",
            borderColor: "border-red-200"
        },
        {
            title: "Teach What You Learn",
            description: "Explaining concepts to others reinforces your understanding and reveals gaps in your knowledge.",
            icon: Lightbulb,
            color: "yellow",
            bgColor: "bg-amber-100",
            iconColor: "text-amber-600",
            borderColor: "border-amber-200"
        },
        {
            title: "Mind Mapping",
            description: "Create visual diagrams connecting ideas. This helps you see relationships between concepts.",
            icon: Zap,
            color: "green",
            bgColor: "bg-green-100",
            iconColor: "text-green-600",
            borderColor: "border-green-200"
        },
        {
            title: "Practice Problems",
            description: "Apply what you learn by solving practice problems. Active learning beats passive reading.",
            icon: CheckCircle,
            color: "blue",
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
            borderColor: "border-blue-200"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-16 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">

                {/* Header Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center space-y-6 pb-10 border-b border-slate-200"
                >
                    <Link
                        href="/academics/resources"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 transition-colors mb-4"
                    >
                        <ArrowLeft size={16} />
                        Back to Resources
                    </Link>

                    <div className="space-y-4 max-w-3xl mx-auto">
                        <h1 className={`${schoolFont.className} text-4xl sm:text-7xl font-black text-slate-900 tracking-tighter uppercase`}>
                            Study <span className="text-green-600">Tips</span>
                        </h1>
                        <p className="text-slate-500 text-base sm:text-xl font-light leading-relaxed">
                            Maximize your learning potential with these proven strategies.
                            <span className="hidden sm:inline"> Master the art of effective studying.</span>
                        </p>
                    </div>
                </motion.div>

                {/* Tips Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tips.map((tip, index) => {
                        const IconComponent = tip.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -4 }}
                                className={`bg-white rounded-2xl p-8 text-center border ${tip.borderColor} hover:shadow-xl transition-all duration-300`}
                            >
                                {/* Icon */}
                                <div className={`w-16 h-16 ${tip.bgColor} rounded-full mx-auto mb-6 flex items-center justify-center`}>
                                    <IconComponent size={28} className={tip.iconColor} />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-slate-800 mb-3">
                                    {tip.title}
                                </h3>

                                {/* Description */}
                                <p className="text-slate-500 leading-relaxed">
                                    {tip.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Notes Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-50 rounded-3xl p-8 sm:p-12"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <BookOpen size={24} className="text-green-600" />
                        </div>
                        <h2 className={`${schoolFont.className} text-2xl sm:text-3xl font-bold text-slate-800 uppercase tracking-tight`}>
                            Recent Class Notes
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400">
                                Loading notes...
                            </div>
                        ) : notes.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                No notes uploaded yet. Check back later!
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notes.map((note, index) => (
                                    <motion.div
                                        key={note.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.05 }}
                                        className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                                    >
                                        <div>
                                            <h4 className="font-semibold text-slate-800 mb-1">
                                                {note.title}
                                            </h4>
                                            <span className="text-sm text-slate-400">
                                                {note.subject} • {note.level}
                                            </span>
                                        </div>
                                        <a
                                            href={note.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 font-semibold text-sm rounded-lg hover:bg-green-600 hover:text-white transition-all"
                                        >
                                            <Download size={14} />
                                            Download
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Color Legend */}
                {/*  */}

            </div>
        </div>
    );
};

export default StudyTips;
