"use client";
import React from 'react';
import Image from 'next/image';
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const facilities = [
    {
        title: "Our buildings sufficiently have a capacity of 52 classrooms",
        image: "/bg.jpg",
    },
    {
        title: "Our modern classes are a pleasing study environment",
        image: "/bg2.jpg",
    },
    {
        title: "Our laboratories enable the scientist to satisfy his curiosity",
        image: "/Wemps%20Images/chem%20(1).jpg",
    }
];

export const SuccessFacilities = () => {
    return (
        <section className={`py-20 bg-[#F5F7F8] ${inter.className}`}>
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col items-center md:items-start mb-16 gap-6">
                    <div className="w-full flex justify-center">
                        <button className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-semibold text-base shadow-md hover:bg-blue-700 transition-colors">
                            What do we have
                        </button>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-black self-start mt-8 pl-1">
                        Have our facilities
                    </h2>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {facilities.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 ease-out group border border-slate-100/50"
                        >
                            {/* Image - 4:3 Aspect Ratio for cinematic feel */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt="Facility"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Text Content - Minimalist Grey Box */}
                            <div className="bg-[#F3F4F6] p-8 h-full min-h-[140px] flex items-center">
                                <p className="text-slate-900 font-bold text-[15px] md:text-base leading-relaxed">
                                    {item.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Video Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="/students%20walking.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="/building%20in%20out.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </div>
                </div>
            </div>
        </section>
    );
};
