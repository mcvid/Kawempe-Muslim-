"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Footer from '@/app/components/Footer';
import LibraryNavBar from '@/app/components/LibraryNavBar';
import PastPapersHero from '@/app/components/PastPapersHero';
import LibraryHamburgerMenu from '@/app/components/LibraryHamburgerMenu';
import WhyChooseSection from '@/app/components/WhyChooseSection';
import SubjectAlphabetSection from '@/app/components/SubjectAlphabetSection';

export default function LevelSubjectsPage() {
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

            <PastPapersHero />

            <section className="py-10 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight font-[var(--font-barlow)]">
                        {levelDisplay} <span className="text-green-600">Past Papers</span>
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Select a subject below to browse available years and papers.</p>
                </div>
            </section>

            <SubjectAlphabetSection level={levelSlug} />

            <WhyChooseSection />

            <Footer />
        </div>
    );
}
