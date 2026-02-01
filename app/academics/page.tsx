import React from 'react';
import { AcademicsHero } from '@/app/components/academics/AcademicsHero';
import { AcademicExcellence } from '@/app/components/academics/AcademicExcellence';
import { Paths } from '@/app/components/academics/Paths';
import { SubjectsSection } from '@/app/components/academics/SubjectsSection';
import { ElearningSection } from '@/app/components/academics/ElearningSection';
import { ResourcesSection } from '@/app/components/academics/ResourcesSection';
import { JourneySection } from '@/app/components/academics/JourneySection';
import Footer from '@/app/components/Footer';
import { motion } from 'framer-motion';
import { CurriculumSection } from '@/app/components/academics/CurriculumSection';

export default function AcademicsPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* New Hero Section - First */}
            <AcademicsHero />

            {/* Existing Content - Second */}
            <div className="pt-12 lg:pt-16">

                <AcademicExcellence />
                <CurriculumSection />
                <SubjectsSection />
                <ElearningSection />
                <Paths />
                <ResourcesSection />
                <JourneySection />
            </div>
            <Footer />
        </main>
    );
}
