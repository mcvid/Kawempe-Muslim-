"use client";
import React from 'react';
import StrategicHero from '@/app/components/about/StrategicHero';
import StrategicMessage from '@/app/components/about/StrategicMessage';
import FuturePlans from '@/app/components/about/FuturePlans';
import Footer from '@/app/components/Footer';

export default function StrategicPlanPage() {
    return (
        <main className="min-h-screen">
            {/* Achievements Slideshow Hero */}
            <StrategicHero />

            {/* Strategy Content Section */}
            <StrategicMessage />

            {/* Future Plans Gallery Section */}
            <FuturePlans />

            {/* Footer */}
            <Footer />
        </main>
    );
}
