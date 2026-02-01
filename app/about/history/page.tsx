"use client";
import React from 'react';
import HistoryHero from '@/app/components/about/HistoryHero';
import HistoryMessage from '@/app/components/about/HistoryMessage';
import Timeline from '@/app/components/about/Timeline';
import Footer from '@/app/components/Footer';

export default function HistoryPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HistoryHero />

      {/* Introductory Message */}
      <HistoryMessage />

      {/* Timeline Section */}
      <Timeline />

      {/* Footer */}
      <Footer />
    </main>
  );
}
