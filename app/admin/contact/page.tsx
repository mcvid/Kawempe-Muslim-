"use client";

import { MessageSquare, Mail, Search, ChevronRight } from "lucide-react";

export default function ContactAdmin() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight">Contact <span className="text-[#006400]">Pulse</span></h1>
                <p className="text-slate-500 text-sm mt-1">Review and respond to public inquiries and messages.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Filter messages..."
                        className="w-full pl-12 pr-4 py-4 bg-[#F8F8F8] border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:bg-white focus:border-[#006400] transition-all font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="px-6 py-4 bg-[#F8F8F8] border-transparent rounded-xl focus:outline-none font-bold text-[10px] uppercase tracking-widest font-[var(--font-barlow)]">
                        <option>Unread</option>
                        <option>Archived</option>
                        <option>All Messages</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <MessageSquare className="w-10 h-10 text-blue-300" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-2">Inbox is Clean</h2>
                <p className="text-slate-500 text-sm max-w-sm">No new inquiries from the public website at the moment. You're all caught up!</p>
            </div>
        </div>
    );
}
