"use client";

import React from 'react';
import { SuccessHero } from '@/app/components/academics/SuccessHero';
import { SuccessMessages } from '@/app/components/academics/SuccessMessages';
import { SuccessFacilities } from '@/app/components/academics/SuccessFacilities';
import Footer from '@/app/components/Footer';

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-white">
            <SuccessHero />
            <SuccessMessages />
            <SuccessFacilities />

            <Footer />
        </main>
    );
}
