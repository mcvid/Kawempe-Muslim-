"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LibraryNavBar from '@/app/components/LibraryNavBar';
import LibraryHamburgerMenu from '@/app/components/LibraryHamburgerMenu';
import Footer from '@/app/components/Footer';
import SubjectHero from '@/app/components/SubjectHero';
import SubjectYearSection from '@/app/components/SubjectYearSection';
import { getSubjectYears } from '@/app/academics/library/actions';

export default function SubjectPage() {
    const params = useParams();
    const levelSlug = params.level as string;
    const subjectSlug = params.subject as string;

    const [years, setYears] = useState<{ year: number, filesCount: number }[]>([]);
    const [loading, setLoading] = useState(true);

    // Format display names
    const levelDisplay = levelSlug.split('-').map(word => {
        if (word.toLowerCase() === 'uce') return 'UCE';
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');

    const subjectDisplay = subjectSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    useEffect(() => {
        const fetchYears = async () => {
            setLoading(true);
            const data = await getSubjectYears(levelSlug, subjectDisplay);
            // Also try with raw slug if no data (for flexibility)
            if (data.length === 0) {
                const data2 = await getSubjectYears(levelSlug, subjectSlug);
                setYears(data2);
            } else {
                setYears(data);
            }
            setLoading(false);
        };
        fetchYears();
    }, [levelSlug, subjectDisplay, subjectSlug]);

    const totalPapers = years.reduce((acc, y) => acc + y.filesCount, 0);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <LibraryHamburgerMenu />

            <div id="library-nav-section" className="hidden md:block bg-white pt-24 pb-4">
                <LibraryNavBar />
            </div>

            <SubjectHero
                level={levelDisplay}
                subjectName={subjectDisplay}
                papersCount={totalPapers}
                yearsCount={years.length}
                teacher={{ name: "Department Head" }}
            />

            {loading ? (
                <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Loading available years...
                </div>
            ) : (
                <SubjectYearSection
                    subjectName={subjectDisplay}
                    level={levelDisplay}
                    years={years.map(y => ({ year: y.year.toString(), filesCount: y.filesCount }))}
                    syllabusFilesCount={0}
                    levelSlug={levelSlug}
                    subjectSlug={subjectSlug}
                />
            )}

            <Footer />
        </div>
    );
}
