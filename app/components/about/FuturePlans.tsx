"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const plans = [
    {
        name: "Eco-Innovation Hub",
        details: "A state-of-the-art facility for STEM research and environmental sustainability projects.",
        image: "/Wemps Images/phy.jpg"
    },
    {
        name: "Olympic Sports Arena",
        details: "A multi-purpose gymnasium and professional-grade soccer pitch to nurture athletic talent.",
        image: "/c2.jpg"
    },
    {
        name: "Solar Smart Campus",
        details: "Complete transition to 100% renewable energy and campus-wide high-speed fiber connectivity.",
        image: "/Wemps Images/brooke-cagle-g1Kr4Ozfoac-unsplash.jpg"
    },
    {
        name: "Modern Female Residence",
        details: "Expanded, high-security boarding facilities designed for comfort and dedicated study spaces.",
        image: "/Wemps Images/backhouse.jpg"
    },
    {
        name: "Agri-Science Garden",
        details: "An interactive agricultural lab focused on modern farming techniques and food security.",
        image: "/Wemps Images/rat-proof-composter.jpg"
    },
    {
        name: "Digital Resource Library",
        details: "A hybrid library system integrating traditional books with global digital academic repositories.",
        image: "/Wemps Images/resources.png"
    }
];

const FuturePlans = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-[var(--font-barlow)] tracking-tighter uppercase mb-2">Our Future Plans</h2>
                    <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full" />
                </div>

                {/* Grid for desktop, Horizontal scroll for mobile */}
                <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 md:pb-0 no-scrollbar snap-x snap-mandatory">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="min-w-[300px] md:min-w-0 bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group snap-center border border-slate-100"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={plan.image}
                                    alt={plan.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-slate-800 mb-3 font-[var(--font-barlow)] uppercase tracking-tight group-hover:text-amber-500 transition-colors">
                                    {plan.name}
                                </h3>
                                <div className="w-16 h-1 bg-amber-400 mb-4 transform scale-x-100 group-hover:scale-x-150 transition-transform origin-left duration-500" />
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    {plan.details}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Scroll Indicator */}
                <div className="md:hidden mt-8 flex justify-center gap-2">
                    <div className="w-8 h-1 bg-amber-400 rounded-full" />
                    <div className="w-2 h-1 bg-slate-200 rounded-full" />
                    <div className="w-2 h-1 bg-slate-200 rounded-full" />
                </div>
            </div>
        </section>
    );
};

export default FuturePlans;
