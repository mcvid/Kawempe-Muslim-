"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LibraryNavBar from '@/app/components/LibraryNavBar';
import LibraryHamburgerMenu from '@/app/components/LibraryHamburgerMenu';
import Footer from '@/app/components/Footer';
import { Download, Bookmark, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { getResources } from '@/app/academics/library/actions';

export default function SubjectResourcesListingPage() {
    const params = useParams();
    const levelSlug = params.level as string;
    const subjectSlug = params.subject as string;

    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Format display names
    const levelDisplay = levelSlug.split('-').map(word => {
        if (word.toLowerCase() === 'uce') return 'UCE';
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');

    const subjectDisplay = subjectSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            const data = await getResources(levelSlug, subjectDisplay);
            setResources(data);
            setLoading(false);
        };
        fetchResources();
    }, [levelSlug, subjectDisplay]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <LibraryHamburgerMenu />

            <div id="library-nav-section" className="hidden md:block bg-white pt-24 pb-4">
                <LibraryNavBar />
            </div>

            <section className="bg-slate-900 text-white py-12 px-6 md:px-12 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex items-center gap-3 text-green-500 mb-4">
                        <GraduationCap size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">{levelDisplay} • Academic resources</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight font-[var(--font-barlow)] uppercase">
                        {subjectDisplay} <span className="text-green-500">Materials</span>
                    </h1>
                    <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
                        Comprehensive study notes and guides for {subjectDisplay} curated by KMSS departments.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6 md:px-12 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight font-[var(--font-barlow)]">
                            Available <span className="text-green-600">Material</span>
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">Click to download or view in browser</p>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Loading resources...
                        </div>
                    ) : resources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resources.map((res, idx) => (
                                <motion.div
                                    key={res.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/5 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-green-600 group-hover:bg-green-50 transition-all">
                                            <Bookmark size={24} />
                                        </div>
                                        <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-green-700 group-hover:bg-green-100 transition-colors">
                                            {res.resource_type || 'NOTES'}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-slate-900 mb-2 leading-tight group-hover:text-green-600 transition-colors">
                                        {res.title}
                                    </h3>

                                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 border-t border-slate-50 pt-4">
                                        <span>{res.file_size || 'PDF'}</span>
                                        <span>•</span>
                                        <span className="text-slate-300">Updated {new Date(res.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <a
                                        href={res.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-600 transition-all group-hover:scale-[1.02] active:scale-95 shadow-lg shadow-slate-200"
                                    >
                                        <Download size={14} />
                                        Download Now
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-300">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-dashed border-slate-200">
                                <Bookmark size={40} strokeWidth={1} />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest">No resources uploaded yet</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
