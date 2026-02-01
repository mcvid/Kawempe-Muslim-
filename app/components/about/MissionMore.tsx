"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Crimson_Pro } from 'next/font/google';

const crimson = Crimson_Pro({
    subsets: ['latin'],
    weight: ['300', '400', '600'],
});

const MissionMore = () => {
    return (
        <section className="py-20 bg-transparent flex flex-col justify-center min-h-[80vh]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="relative">
                    {/* Mission Box */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-[#D1D5DB] p-8 md:p-16 rounded-2xl w-full md:w-[60%] lg:w-[50%] z-10 relative"
                    >
                        <h2 className="text-xl md:text-2xl font-normal uppercase mb-6 tracking-[0.3em] text-slate-500 font-[var(--font-barlow)]">Mission</h2>
                        <p className={`text-2xl md:text-4xl text-slate-900 leading-tight ${crimson.className}`}>
                            To Produce Versatile Individuals through Quality Education and Islamic Values to address Global Challenges
                        </p>
                    </motion.div>

                    {/* Vision Box - Staggered */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-[#E5E7EB] p-8 md:p-16 rounded-2xl w-full md:w-[60%] lg:w-[50%] md:ml-auto md:-mt-20 lg:-mt-32 z-20 relative"
                    >
                        <h2 className="text-xl md:text-2xl font-normal uppercase mb-6 tracking-[0.3em] text-slate-500 font-[var(--font-barlow)]">Vision</h2>
                        <p className={`text-2xl md:text-4xl text-slate-900 leading-tight ${crimson.className}`}>
                            A fountain of enlightened and skilled young men and women rooted in Islamic values.
                        </p>
                    </motion.div>

                    {/* Core Values - Full Width Below */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="bg-[#F3F4F6] p-8 md:p-20 rounded-2xl w-full mt-12 md:mt-24 border border-slate-200/50"
                    >
                        <h2 className="text-xl md:text-2xl font-normal uppercase mb-12 tracking-[0.3em] text-slate-500 font-[var(--font-barlow)] text-center">Core Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                "Fear Allah",
                                "Academic Excellence",
                                "Ethics, Integrity & Team Work"
                            ].map((value, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-6 group">
                                    <div className="w-4 h-4 rounded-full bg-slate-400 group-hover:bg-green-600 transition-colors duration-500" />
                                    <p className={`text-2xl md:text-3xl text-slate-800 ${crimson.className}`}>{value}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default MissionMore;
