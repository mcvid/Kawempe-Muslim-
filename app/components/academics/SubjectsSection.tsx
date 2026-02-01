"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const subjectCategories = [
    {
        title: "General Sciences",
        image: "/Wemps Images/chem.jpg",
        href: "/academics/subjects#sciences"
    },
    {
        title: "Vocationals",
        image: "/Wemps Images/td.webp",
        href: "/academics/subjects#vocationals"
    },
    {
        title: "Humanities",
        image: "/Wemps Images/econ.jpg",
        href: "/academics/subjects#humanities"
    }
];

export const SubjectsSection = () => {
    return (
        <section className="bg-[#F0F9F7] py-16 md:py-20 lg:py-24 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Subject Category Menu with Alternating Indentation */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex flex-col gap-6 md:gap-8"
                    >

                        {/* General Sciences - Left aligned */}
                        <motion.div variants={itemVariants} className="flex items-center gap-4 md:gap-5">
                            <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-40 lg:h-40 flex-shrink-0 rounded-[20%] overflow-hidden">
                                <Image
                                    src={subjectCategories[0].image}
                                    alt={subjectCategories[0].title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-base md:text-lg lg:text-xl font-semibold text-black">
                                {subjectCategories[0].title}
                            </h3>
                        </motion.div>

                        {/* Vocationals - Indented to the right */}
                        <motion.div variants={itemVariants} className="flex items-center gap-4 md:gap-5 ml-16 md:ml-24 lg:ml-32">
                            <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-40 lg:h-40 flex-shrink-0 rounded-[20%] overflow-hidden">
                                <Image
                                    src={subjectCategories[1].image}
                                    alt={subjectCategories[1].title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-base md:text-lg lg:text-xl font-semibold text-black">
                                {subjectCategories[1].title}
                            </h3>
                        </motion.div>

                        {/* Humanities - Back to left aligned */}
                        <motion.div variants={itemVariants} className="flex items-center gap-4 md:gap-5">
                            <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-40 lg:h-40 flex-shrink-0 rounded-[20%] overflow-hidden">
                                <Image
                                    src={subjectCategories[2].image}
                                    alt={subjectCategories[2].title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-base md:text-lg lg:text-xl font-semibold text-black">
                                {subjectCategories[2].title}
                            </h3>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Feature Image + CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        {/* Large Books Image */}
                        <div className="relative h-[280px] md:h-[350px] lg:h-[380px] w-full rounded-3xl overflow-hidden">
                            <Image
                                src="/Wemps Images/brooke-cagle-g1Kr4Ozfoac-unsplash.jpg"
                                alt="Textbooks on shelf - Science, History, English, Arts"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* More Button - Centered at bottom with hover animation */}
                        <Link
                            href="/academics/subjects"
                            className="mt-10 md:mt-12 inline-flex items-center justify-center px-12 py-3.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-all duration-300 ease-out text-base md:text-lg hover:scale-105 hover:translate-y-[-2px] active:scale-100"
                        >
                            More
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

