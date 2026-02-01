"use client";
import React from 'react';
import HistoryHero from '@/app/components/about/HistoryHero';
import MissionMore from '@/app/components/about/MissionMore';
import Footer from '@/app/components/Footer';

export default function MissionMorePage() {
    return (
        <main className="min-h-screen bg-[#F9FAFB] pt-32 md:pt-40">
            {/* Mission, Vision, Core Values Section */}
            <MissionMore />

            {/* Footer */}
            <Footer />
        </main>
    );
}
