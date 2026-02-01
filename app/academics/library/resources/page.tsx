"use client";

import React from 'react';
import Footer from '@/app/components/Footer';
import LibraryNavBar from '@/app/components/LibraryNavBar';
import LibraryHero from '@/app/components/LibraryHero';
import TrustedByStudents from '@/app/components/TrustedByStudents';
import WhyChoosePastPapers from '@/app/components/WhyChoosePastPapers';
import ResourcePrograms from '@/app/components/ResourcePrograms';
import ReadyToStartCTA from '@/app/components/ReadyToStartCTA';
import LibraryHamburgerMenu from '@/app/components/LibraryHamburgerMenu';

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Floating Hamburger Menu */}
            <LibraryHamburgerMenu />

            {/* Navigation Bar Section - Hidden on mobile, hamburger menu is used instead */}
            <div id="library-nav-section" className="hidden md:block bg-white pt-24 pb-4">
                <LibraryNavBar />
            </div>

            {/* Hero Section (Dark Background) */}
            <LibraryHero
                title="Access Learning Resources for Kawempe Muslim Secondary School"
                description="Access digital books, revision notes, and academic guides tailored to the national curriculum."
                searchPlaceholder="Search Resources"
            />

            {/* Trusted by Students Section */}
            <TrustedByStudents />

            {/* Why Choose Our Past Papers Section */}
            <WhyChoosePastPapers />

            {/* Popular Programs Section */}
            <ResourcePrograms />

            {/* Ready to Start CTA Section */}
            <ReadyToStartCTA />

            <Footer />
        </div>
    );
}
