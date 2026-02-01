"use client";

import React from 'react';
import { Search, Calendar, Filter, ChevronDown } from 'lucide-react';

export default function PaperFilterBar() {
    return (
        <section className="px-4 md:px-12 py-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="bg-slate-200/80 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row items-end gap-6 shadow-sm border border-slate-200">

                    {/* Search Field */}
                    <div className="flex-1 w-full space-y-2">
                        <label className="text-sm font-bold text-slate-800 font-montserrat ml-1">Search Papers</label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Paper name , file name or type"
                                className="w-full pl-12 pr-4 py-3 bg-[#f8f1f1] border border-slate-200 rounded-2xl text-sm font-inter focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Class Select */}
                    <div className="w-full lg:w-48 space-y-2">
                        <div className="flex items-center gap-2 mb-1 ml-1">
                            <Calendar size={16} className="text-slate-600" />
                            <label className="text-sm font-bold text-slate-800 font-montserrat">Select Class</label>
                        </div>
                        <div className="relative">
                            <select className="w-full appearance-none pl-4 pr-10 py-3 bg-[#f8f1f1] border border-slate-200 rounded-2xl text-sm font-inter focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer text-slate-600">
                                <option value="">Select...</option>
                                <option value="senior-1">Senior 1</option>
                                <option value="senior-2">Senior 2</option>
                                <option value="senior-3">Senior 3</option>
                                <option value="senior-4">Senior 4</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Paper Type Select */}
                    <div className="w-full lg:w-48 space-y-2">
                        <div className="flex items-center gap-2 mb-1 ml-1">
                            <Filter size={16} className="text-slate-600" />
                            <label className="text-sm font-bold text-slate-800 font-montserrat">Paper type</label>
                        </div>
                        <div className="relative">
                            <select className="w-full appearance-none pl-4 pr-10 py-3 bg-[#f8f1f1] border border-slate-200 rounded-2xl text-sm font-inter focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer text-slate-600">
                                <option value="all">All types</option>
                                <option value="question-paper">Question Paper</option>
                                <option value="mark-scheme">Mark Scheme</option>
                                <option value="examiner-report">Examiner Report</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Term Select */}
                    <div className="w-full lg:w-48 space-y-2">
                        <label className="text-sm font-bold text-slate-800 font-montserrat ml-1">Select Term</label>
                        <div className="relative">
                            <select className="w-full appearance-none pl-4 pr-10 py-3 bg-[#f8f1f1] border border-slate-200 rounded-2xl text-sm font-inter focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer text-slate-600">
                                <option value="">Select...</option>
                                <option value="term-1">Term 1</option>
                                <option value="term-2">Term 2</option>
                                <option value="term-3">Term 3</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
