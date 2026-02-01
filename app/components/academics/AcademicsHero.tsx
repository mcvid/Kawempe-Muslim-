"use client";
import React from 'react';

export const AcademicsHero = () => {
    return (
        <section className="relative w-full h-screen min-h-[600px] text-white">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/Wemps Images/brooke-cagle-g1Kr4Ozfoac-unsplash.jpg')" }}
            />

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content - Centered */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                {/* Top decorative line */}
                <div className="w-0.5 h-24 md:h-32 bg-green-400 mb-8" />

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide uppercase leading-tight max-w-4xl">
                    A Conducive <br />
                    Environment For <br />
                    Your Study
                </h1>

                {/* Subtitle */}
                <p className="mt-6 text-sm md:text-base tracking-widest text-green-300 uppercase">
                    Excellence in Education
                </p>

                {/* Bottom decorative line */}
                <div className="w-0.5 h-24 md:h-32 bg-green-400 mt-8" />
            </div>
        </section>
    );
};
