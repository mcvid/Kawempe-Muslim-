"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

export const Paths = () => {
    return (
        <section className="bg-[#F0F9F7] py-16 md:py-24 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[300px] md:h-[450px] lg:h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-sm"
                    >
                        <Image
                            src="/Wemps Images/brooke-cagle-g1Kr4Ozfoac-unsplash.jpg"
                            alt="Student and mentor discussing during a learning path"
                            fill
                            className="object-cover"
                            priority
                            onError={(e) => {
                                // Fallback if local image fails
                                const target = e.target as HTMLImageElement;
                                target.srcset = "https://images.unsplash.com/photo-1523240715639-994ad08ca9aa?q=80&w=2070&auto=format&fit=crop";
                            }}
                        />
                    </motion.div>

                    {/* Right Column: Text Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-12"
                    >

                        {/* Section 1 */}
                        <motion.div variants={itemVariants} className="relative pl-8">
                            {/* Decorative Green Line */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-full" />
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                                Structured learning paths
                            </h3>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Our curriculum guides you through progressive skill development.
                                Each semester builds on previous knowledge to create mastery.
                            </p>
                        </motion.div>

                        {/* Section 2 */}
                        <motion.div variants={itemVariants} className="pl-8">
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                                Expert faculty guidance
                            </h3>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Experienced instructors bring real-world perspective to classroom instruction.
                                They remain available for mentorship and academic support.
                            </p>
                        </motion.div>

                        {/* Section 3 */}
                        <motion.div variants={itemVariants} className="pl-8">
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                                Flexible study options
                            </h3>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                We offer a various number of subjects and co-curricular activities.
                            </p>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
};
