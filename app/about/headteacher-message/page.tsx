"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Crimson_Pro } from "next/font/google";
import { Quote } from "lucide-react";

// Font for that "academic" feel
const schoolFont = Crimson_Pro({
    subsets: ["latin"],
    weight: ["400", "600"],
    display: "swap",
});

export default function HeadteacherMessagePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header / Nav-like area */}
            <div className="bg-[#1E3A8A] text-white pt-32 pb-12 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Headteacher&apos;s Message
                    </h1>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        A word of welcome and vision from our leadership.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                    {/* Left Column: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-5/12 sticky top-[-14rem] lg:top-24"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                            <Image
                                src="/hm.png"
                                alt="Hajat Kibirige Zulaika - Headteacher"
                                width={600}
                                height={700}
                                className="w-full h-auto object-cover"
                                priority
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-8">
                                <h3 className="text-white text-2xl font-bold">Hajat Kibirige Zulaika</h3>
                                <p className="text-white/80 font-medium">Headteacher</p>
                            </div>
                        </div>

                        {/* Quote decoration */}
                        <div className="mt-8 hidden lg:block">
                            <Quote className="text-[#1E3A8A]/20 w-24 h-24 rotate-180" />
                        </div>
                    </motion.div>


                    {/* Right Column: Text Content */}
                    <motion.div
                        className="w-full lg:w-7/12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className={`${schoolFont.className} text-slate-800 space-y-8 text-lg md:text-xl leading-relaxed`}>

                            <p className="font-semibold text-[#1E3A8A] text-2xl md:text-3xl leading-snug">
                                "Assalam alaikum warahmatullahi wabarakatuh. Welcome to Kawempe Muslim Secondary School."
                            </p>

                            <p>
                                We are dedicated to providing quality education rooted in academic excellence, discipline, and strong Islamic values. Our goal is to nurture well-rounded students who are confident, responsible, and capable of making meaningful contributions to society.
                            </p>

                            <p>
                                At Kawempe Muslim Secondary School, we emphasize both academic achievement and personal growth. We provide a supportive and inclusive environment where every student is encouraged to explore their potential, develop critical thinking skills, and pursue their passions. Our experienced staff are committed to guiding students not only in their studies but also in character development, ensuring they embody integrity, respect, and compassion in all aspects of life.
                            </p>

                            <p>
                                We also offer a rich variety of programs, extracurricular activities, and leadership opportunities designed to prepare our students for the challenges of the modern world while keeping them grounded in Islamic principles. By fostering a culture of excellence, curiosity, and ethical responsibility, we aim to equip our students with the knowledge, skills, and confidence they need to succeed academically, socially, and spiritually.
                            </p>

                            <p>
                                We warmly invite you to explore our school, join our learning community, and become part of a tradition of excellence, faith, and holistic development.
                            </p>

                            <p className="font-semibold text-slate-900 border-l-4 border-[#1E3A8A] pl-6 italic">
                                May your time with us be fruitful and inspiring.
                            </p>

                            <div className="pt-8">
                                <div className="h-0.5 w-24 bg-[#1E3A8A] mb-4"></div>
                                <p className="text-base font-sans font-bold text-slate-900 uppercase tracking-widest">
                                    Hajat Kibirige Zulaika
                                </p>
                                <p className="text-sm font-sans text-slate-500">
                                    Headteacher, Kawempe Muslim S.S.
                                </p>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}
