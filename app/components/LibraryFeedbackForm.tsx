"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Send,
    Lightbulb,
    Bug,
    Sparkles,
    FileText,
    MessageCircle,
    PenTool
} from 'lucide-react';

const feedbackTypes = [
    { id: 'suggestion', label: 'Suggestion', icon: Lightbulb },
    { id: 'bug', label: 'Bug Report', icon: Bug },
    { id: 'feature', label: 'Feature request', icon: Sparkles },
    { id: 'missing', label: 'Missing Paper', icon: FileText },
    { id: 'general', label: 'General feedback', icon: MessageCircle },
    { id: 'other', label: 'Other', icon: PenTool },
];

export default function LibraryFeedbackForm() {
    const [selectedType, setSelectedType] = useState('suggestion');

    return (
        <section className="py-20 px-4 md:px-12 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 font-montserrat">Send feedback</h2>
                    <p className="text-slate-500 font-inter max-w-2xl mx-auto text-sm leading-relaxed">
                        Report any missing papers, suggest improvements, or share your feedback to help us serve you better
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#f8f1f1] rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100"
                >
                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                        {/* Personal Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-800 font-montserrat ml-1">Names</label>
                                <input
                                    type="text"
                                    placeholder="Enter Your Name"
                                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-inter focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-800 font-montserrat ml-1">E-mail address</label>
                                <input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-inter focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-800 font-montserrat ml-1">Class</label>
                                <input
                                    type="text"
                                    placeholder="Form 2"
                                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-inter focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-800 font-montserrat ml-1">
                                    Whatsapp number.<span className="text-slate-400 font-medium">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="+256 123456789"
                                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-inter focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Feedback Type Grid */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-800 font-montserrat ml-1">Feedback type</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {feedbackTypes.map((type) => {
                                    const Icon = type.icon;
                                    const isActive = selectedType === type.id;
                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setSelectedType(type.id)}
                                            className={`
                                                flex items-center gap-4 p-4 rounded-2xl border transition-all text-left
                                                ${isActive
                                                    ? 'bg-white border-amber-500 shadow-md transform -translate-y-1'
                                                    : 'bg-white/50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                                                }
                                            `}
                                        >
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isActive ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                                                {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                            <Icon size={20} className={isActive ? 'text-amber-600' : 'text-slate-400'} strokeWidth={isActive ? 2.5 : 2} />
                                            <span className={`text-sm font-bold font-montserrat ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Message Box */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-800 font-montserrat ml-1">Your messsage</label>
                            <textarea
                                rows={6}
                                placeholder="Tell us about your experience suggestions or any other issues you have encountered"
                                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-3xl text-sm font-inter focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                className="bg-[#1a1140] hover:bg-amber-600 text-white px-10 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-lg group active:scale-95"
                            >
                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                <span className="font-bold font-montserrat tracking-wide">Send feedback</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
