"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const ResourcesSection = () => {
    return (
        <section className="bg-[#f0f9fa] py-16 md:py-24 px-4 md:px-8 lg:px-16 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-2 lg:order-1 space-y-8"
                    >
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-0">
                                Need resources?
                            </h2>
                            <div className="h-0.5 w-24 bg-green-400 mt-2" />
                        </div>

                        <div className="space-y-6 max-w-xl">
                            <p className="text-gray-800 text-lg md:text-xl leading-relaxed">
                                Our digital library avails textbooks, past papers,
                                focused study texts, and interactive integration
                                activities.
                            </p>
                            <p className="text-gray-800 text-lg md:text-xl leading-relaxed">
                                To ensure students can learn effectively, practice
                                confidently, and achieve academic success.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Link
                                href="/academics/resources"
                                className="inline-flex items-center justify-center px-10 py-3 bg-[#3250E6] hover:bg-[#2a44c9] text-white font-medium rounded-2xl transition-all duration-300 ease-out text-lg hover:scale-105 hover:shadow-lg active:scale-100"
                            >
                                Explore
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Column: Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-1 lg:order-2 relative h-[300px] md:h-[450px] lg:h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-sm"
                    >
                        <Image
                            src="/Wemps Images/resources.png"
                            alt="Digital resources and learning tools"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
