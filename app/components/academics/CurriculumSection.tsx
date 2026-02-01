"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const CurriculumSection = () => {
    return (
        <section className="bg-[#f0f9fa] min-h-[600px] flex items-center px-8 py-16 md:px-20 relative overflow-hidden">
            {/* Blue decorative bar on far left */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#2563eb]" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start z-10">

                {/* Left Column: Heading & Button */}
                <div className="space-y-12 pt-0 md:pt-12">
                    <h2 className="text-3xl md:text-3xl font-bold text-gray-900 leading-tight">
                        Everything you need <br />
                        to succeed <br />
                        academically
                    </h2>
                    <Link href="/academics/success">
                        <button className="bg-[#3b59ff] hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg transition-colors font-medium">
                            View all
                        </button>
                    </Link>
                </div>

                {/* Right Column: Image + Text Stack */}
                <div className="space-y-6 flex flex-col items-start w-full">
                    <div className="relative w-full h-[350px] overflow-hidden rounded-[2.5rem] shadow-lg">
                        <Image
                            src="/Wemps Images/uce.jpg"
                            alt="Curriculum UCE"
                            fill
                            className="object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.srcset = "https://images.unsplash.com/photo-1497633760581-c8c79b7ac84b?q=80&w=2071&auto=format&fit=crop";
                            }}
                        />
                    </div>

                    <div className="max-w-md space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900">
                            Curriculum Overview
                        </h3>
                        <p className="text-gray-800 text-lg leading-relaxed">
                            Explore our NCDC-aligned programs, designed to balance theory
                            and practice while strengthening foundational knowledge and
                            critical thinking skills.
                        </p>
                    </div>
                </div>
            </div>

            {/* Teal Decorative Bottom Line */}
            <div className="absolute bottom-0 right-0 w-1/2 h-2 bg-[#4fd1c5]" />
        </section>
    );
};
