"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Download, Info } from 'lucide-react';

interface PaperCardProps {
    title: string;
    classLevel: string;
    fileName: string;
    onView?: () => void;
    onDownload?: () => void;
}

export default function PaperCard({
    title,
    classLevel,
    fileName,
    onView,
    onDownload
}: PaperCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            className="bg-slate-200/50 rounded-2xl border border-slate-200 p-0 overflow-hidden flex flex-col group transition-all"
        >
            {/* Header Area */}
            <div className="p-4 flex items-center justify-between border-b border-slate-200/60 bg-slate-200/30">
                <div className="w-6 h-6 rounded-full border border-slate-400 flex items-center justify-center text-slate-600">
                    <span className="text-[10px] font-bold">1</span>
                </div>
                <div className="w-5 h-5 rounded-full border border-slate-300" />
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-800 font-montserrat">{title}</h3>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{classLevel}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-inter mb-6 truncate">{fileName}</p>

                {/* Actions */}
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={onView}
                        className="p-2 text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition-all"
                        title="View Paper"
                    >
                        <Eye size={20} strokeWidth={1.5} />
                    </button>

                    <button
                        onClick={onDownload}
                        className="flex-1 bg-[#1a1140] hover:bg-amber-600 text-white rounded-xl py-2 px-4 flex items-center justify-center gap-2 transition-all group/btn"
                    >
                        <Download size={16} className="group-hover/btn:translate-y-0.5 transition-transform" />
                        <span className="text-[11px] font-bold uppercase tracking-widest font-inter">Download</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
