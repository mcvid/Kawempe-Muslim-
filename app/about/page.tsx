import React from 'react';
import Footer from '../components/Footer';
import AboutHero from '../components/about/AboutHero';
import AboutInfo from '../components/about/AboutInfo';
import AboutActivities from '../components/about/AboutActivities';

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <AboutHero />

            {/* Info Section with Side Nav */}
            <AboutInfo />

            {/* Activities Slideshow */}
            <AboutActivities />

            {/* Footer */}
            <Footer />
        </div>
    );
}
