"use client";

import React, { useState, useEffect } from 'react';
import Footer from '@/app/components/Footer';
import LibraryNavBar from '@/app/components/LibraryNavBar';
import LibraryHamburgerMenu from '@/app/components/LibraryHamburgerMenu';
import { Book, Download, FileText, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/app/lib/supabase';

interface Resource {
    id: string;
    title: string;
    subject: string;
    level: string;
    resource_type: string;
    file_url: string;
    file_size: string | null;
    description: string | null;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function OLevelResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            const { data } = await supabase
                .from('resources')
                .select('*')
                .eq('level', 'o-level')
                .order('created_at', { ascending: false });
            if (data) setResources(data);
            setLoading(false);
        };
        fetchResources();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <LibraryHamburgerMenu />

            <div className="hidden md:block bg-white pt-24 pb-4">
                <LibraryNavBar />
            </div>

            {/* Hero */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-28 md:pt-32 pb-12 px-4 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider mb-4">O Level</span>
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">O Level Study Resources</h1>
                        <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                            Access notes, guides, and study materials for O Level subjects.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <section className="flex-1 py-10 md:py-14 px-4 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <motion.div className="mb-6" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-base md:text-lg font-bold text-slate-900 mb-1">Available Resources</h2>
                        <p className="text-xs md:text-sm text-slate-600">{resources.length} resources available</p>
                    </motion.div>

                    {loading ? (
                        <div className="text-center py-16 text-slate-400"><p className="text-sm">Loading...</p></div>
                    ) : resources.length > 0 ? (
                        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            {resources.map((resource) => (
                                <motion.a
                                    key={resource.id}
                                    href={resource.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <BookOpen size={20} />
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full uppercase tracking-wider">
                                            {resource.resource_type}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{resource.title}</h3>
                                    <p className="text-xs text-slate-500 mb-3">{resource.subject}</p>
                                    {resource.description && (
                                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{resource.description}</p>
                                    )}
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <FileText size={12} /> {resource.file_size || "PDF"}
                                        </span>
                                        <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:underline">
                                            Download <Download size={12} />
                                        </span>
                                    </div>
                                </motion.a>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                            <Book className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">No O Level resources available yet.</p>
                            <p className="text-slate-400 text-sm">Check back soon for new content.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
