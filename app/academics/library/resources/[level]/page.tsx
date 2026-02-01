"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Footer from '@/app/components/Footer';
import LibraryNavBar from '@/app/components/LibraryNavBar';
import LibraryHamburgerMenu from '@/app/components/LibraryHamburgerMenu';
import SubjectAlphabetSection from '@/app/components/SubjectAlphabetSection';

export default function LevelResourcesPage() {
    const params = useParams();
    const levelSlug = params.level as string;

    // Format display names
    const levelDisplay = levelSlug.split('-').map(word => {
        if (word.toLowerCase() === 'uce') return 'UCE';
        if (word.toLowerCase() === 'idaad') return 'Idaad';
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <LibraryHamburgerMenu />

            <div id="library-nav-section" className="hidden md:block bg-white pt-24 pb-4">
                <LibraryNavBar />
            </div>

            <section className="bg-[#1E3A8A] text-white py-16 px-6 md:px-12 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight font-[var(--font-barlow)] uppercase">
                        {levelDisplay} <span className="text-blue-400">Study Materials</span>
                    </h1>
                    <p className="text-sm md:text-base text-blue-100 max-w-2xl leading-relaxed opacity-90">
                        Access detailed study notes, revision guides, and textbooks for your {levelDisplay} subjects.
                    </p>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -mr-32 -mt-32" />
            </section>

            <section className="py-10 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Select a Subject
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Browse study resources organized by major academic departments.</p>
                </div>
            </section>

            <SubjectAlphabetSection level={levelSlug} />

            <Footer />
        </div>
    );
}
