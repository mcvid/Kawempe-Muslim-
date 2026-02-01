"use client";
import React from "react";
import Image from "next/image";
import { Crimson_Pro, Poppins } from "next/font/google"; // Assuming standard font imports
// import Link from "next/link";
// import { motion } from "framer-motion";

const crimson = Crimson_Pro({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-crimson",
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    variable: "--font-poppins",
});

const MainSection = () => {
    return (
        <section className={`py-20 bg-white ${crimson.variable} ${poppins.variable}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN - LARGE IMAGE WITH OVERLAY */}
                    <div className="lg:col-span-7 relative min-h-[600px] lg:min-h-[800px] rounded-[40px] overflow-hidden group">
                        <Image
                            src="/b2.png" // Placeholder - ideally a student reading a book
                            alt="Student Reading"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                        {/* Floating Card Overlay with Transparent Gradient */}
                        <div className="absolute bottom-6 left-6 right-6 lg:left-12 lg:right-auto lg:w-[400px] bg-white/95 backdrop-blur-sm p-8 rounded-3xl border border-white/40">
                            <h3 className={`${poppins.className} text-xl font-medium text-slate-900 mb-3`}>
                                A Place for Every Learner
                            </h3>
                            <p className={`${poppins.className} text-slate-800 mb-6 text-sm leading-relaxed font-medium`}>
                                Looking to transfer? We welcome disciplined students into our S.2, S.3, and S.4 classes based on merit and vacancy availability.
                            </p>
                            <button className="bg-[#FACC15] text-slate-900 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#EAB308] transition-colors border-none ring-0">
                                Inquire vacancies
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - STACK OF CARDS */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* Card 1: A-Level */}
                        <div className="bg-white border border-slate-100 rounded-[30px] p-8 lg:p-10 flex flex-col items-start gap-4">
                            <h3 className={`${poppins.className} text-xl lg:text-2xl font-medium text-slate-900`}>
                                Elevate Your Potential in A-level.
                            </h3>
                            <p className={`${poppins.className} text-slate-600 text-sm lg:text-base leading-relaxed`}>
                                Choose from a wide range of UNEB-standard Science and Arts combinations. Benefit from our state-of-the-art labs and expert subject specialists.
                            </p>
                            <button className="mt-2 bg-[#FACC15] text-slate-900 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#EAB308] transition-colors self-end lg:self-start border-none">
                                Inquire vacancies
                            </button>
                        </div>

                        {/* Card 2: Contact Form */}
                        <div className="bg-[#f0f0f0] border border-slate-200 rounded-[30px] p-8 lg:p-10">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className={`${poppins.className} text-xl font-bold text-slate-700`}>
                                    Missing something?
                                </h3>
                            </div>

                            <form className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact Admissions</label>
                                    <input type="text" placeholder="Name" className="bg-transparent border-b border-slate-300 px-0 py-2 text-sm focus:outline-none focus:border-slate-800 placeholder:text-slate-400" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <input type="email" placeholder="Email address" className="bg-transparent border-b border-slate-300 px-0 py-2 text-sm focus:outline-none focus:border-slate-800 placeholder:text-slate-400" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <input type="text" placeholder="Leave a message" className="bg-transparent border-b border-slate-300 px-0 py-2 text-sm focus:outline-none focus:border-slate-800 placeholder:text-slate-400" />
                                </div>

                                <button className="mt-4 bg-[#1e6091] text-white py-3 rounded-full text-sm font-medium hover:bg-[#164d75] transition-colors">
                                    Submit
                                </button>
                                <p className="text-[10px] text-center text-slate-400 mt-2">
                                    Your contact profile won&apos;t be shared. Never submit passwords.
                                </p>
                            </form>
                        </div>

                        {/* Card 3: Foundation */}
                        <div className="bg-[#F0FDF4] border border-green-100 rounded-[30px] p-8 lg:p-10 flex flex-col items-start gap-4 flex-grow justify-center">
                            <h3 className={`${poppins.className} text-xl lg:text-2xl font-medium text-slate-900`}>
                                Lay the Foundation for Your Greatness
                            </h3>
                            <p className={`${poppins.className} text-slate-600 text-sm lg:text-base leading-relaxed`}>
                                Transition from Primary to Secondary with confidence. Join a community that nurtures your talent, sharpens your mind, and builds your character from day one.
                            </p>
                            <button className="mt-2 bg-[#FACC15] text-slate-900 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#EAB308] transition-colors self-end lg:self-start border-none">
                                Inquire vacancies
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default MainSection;
