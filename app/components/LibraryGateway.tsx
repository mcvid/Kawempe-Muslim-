"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FileText, Library, ArrowRight } from 'lucide-react';
import Footer from './Footer';
import LibraryHamburgerMenu from './LibraryHamburgerMenu';
import LibraryNavBar from './LibraryNavBar';

export default function LibraryGateway() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <LibraryHamburgerMenu />

            <div id="library-nav-section" className="hidden md:block bg-white pt-24 pb-4 border-b border-slate-100">
                <LibraryNavBar />
            </div>

            <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-20 relative">
                <div className="max-w-4xl w-full relative z-10">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center mb-8 md:mb-12"
                    >
                        <div className="inline-flex items-center justify-center p-2.5 md:p-3 rounded-full bg-white shadow-sm mb-4 md:mb-6 ring-1 ring-slate-100">
                            <Image
                                src="/logo.png"
                                width={64}
                                height={64}
                                alt="Kawempe Muslim Logo"
                                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">
                            Library & Resources
                        </h1>
                        <p className="text-slate-600 text-xs md:text-base max-w-lg mx-auto leading-relaxed px-4">
                            Select a category below to browse our extensive collection of academic materials.
                        </p>
                    </motion.div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
                        {/* Resources Card */}
                        <Link href="/academics/library/resources" className="group">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="bg-white rounded-xl p-6 md:p-8 h-full shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 group-hover:-translate-y-0.5 flex flex-col"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center mb-4 md:mb-6">
                                    <Library size={20} className="md:w-6 md:h-6" strokeWidth={1.5} />
                                </div>

                                <h2 className="text-base md:text-lg font-bold text-slate-900 mb-2 group-hover:text-[#1E3A8A] transition-colors">
                                    Learning Resources
                                </h2>
                                <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
                                    Access textbooks, recorded lessons, and study guides for all subjects.
                                </p>

                                <div className="mt-auto flex justify-end">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1E3A8A] group-hover:text-white transition-all duration-200">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>

                        {/* Past Papers Card */}
                        <Link href="/academics/library/past-papers" className="group">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="bg-[#1E3A8A] rounded-xl p-6 md:p-8 h-full shadow-md hover:shadow-xl transition-all duration-200 border border-blue-900 group-hover:-translate-y-0.5 flex flex-col"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/10 text-white flex items-center justify-center mb-4 md:mb-6">
                                    <FileText size={20} className="md:w-6 md:h-6" strokeWidth={1.5} />
                                </div>

                                <h2 className="text-base md:text-lg font-bold text-white mb-2">
                                    Past Papers
                                </h2>
                                <p className="text-blue-100/80 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
                                    Download exam papers, mark schemes, and reports organized by year.
                                </p>

                                <div className="mt-auto flex justify-end">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:bg-white group-hover:text-[#1E3A8A] transition-all duration-200">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
