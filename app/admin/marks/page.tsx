"use client";

import { ClipboardList, Save, Search, Table, ChevronRight } from "lucide-react";

export default function MarksAdmin() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight">Academic <span className="text-[#006400]">Grading</span></h1>
                <p className="text-slate-500 text-sm mt-1">Central portal for entering student marks and term results.</p>
            </div>

            {/* Selection Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                <select className="px-4 py-3 bg-[#F8F8F8] border-transparent rounded-xl focus:outline-none font-bold text-[10px] uppercase tracking-widest font-[var(--font-barlow)]">
                    <option>Select Class</option>
                </select>
                <select className="px-4 py-3 bg-[#F8F8F8] border-transparent rounded-xl focus:outline-none font-bold text-[10px] uppercase tracking-widest font-[var(--font-barlow)]">
                    <option>Select Subject</option>
                </select>
                <select className="px-4 py-3 bg-[#F8F8F8] border-transparent rounded-xl focus:outline-none font-bold text-[10px] uppercase tracking-widest font-[var(--font-barlow)]">
                    <option>Select Term</option>
                </select>
                <button className="bg-[#006400] text-white rounded-xl py-3 font-bold text-[10px] uppercase tracking-widest hover:shadow-lg transition-all">
                    Load Sheet
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 flex flex-col items-center text-center">
                <Table className="w-16 h-16 text-slate-100 mb-4" />
                <h2 className="text-lg font-bold text-slate-300 uppercase tracking-tighter">Grading Sheet Offline</h2>
                <p className="text-slate-300 text-[10px] uppercase font-bold tracking-[2px] mt-2">Select class and subject parameters to activate the grading interface.</p>
            </div>
        </div>
    );
}
