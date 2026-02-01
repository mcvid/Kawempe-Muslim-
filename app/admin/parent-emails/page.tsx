"use client";

import { Mail, Send, Users, History, Plus } from "lucide-react";

export default function ParentEmailsAdmin() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight">Parent <span className="text-[#006400]">Comms</span></h1>
                    <p className="text-slate-500 text-sm mt-1">Send official emails and newsletters to the parent community.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#006400] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4" />
                    New Email
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-slate-50 text-slate-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 uppercase tracking-wide">Mailing Lists</h3>
                            <p className="text-xs text-slate-500">Manage 1,200+ parent email contacts</p>
                        </div>
                    </div>
                    <button className="w-full py-3 bg-slate-50 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-colors">Manage Lists</button>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-slate-50 text-slate-600">
                            <History className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 uppercase tracking-wide">Sent Campaigns</h3>
                            <p className="text-xs text-slate-500">View performance of previous emails</p>
                        </div>
                    </div>
                    <button className="w-full py-3 bg-slate-50 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-colors">View Analytics</button>
                </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-12 flex flex-col items-center justify-center border border-slate-100 text-center">
                <Mail className="w-12 h-12 text-slate-200 mb-4" />
                <h2 className="text-lg font-bold text-slate-400 uppercase tracking-tight">Ready to Broadcast</h2>
                <p className="text-slate-400 text-xs max-w-xs mx-auto mt-2">Start a new campaign to reach out to the entire KMSS parent community instantly.</p>
            </div>
        </div>
    );
}
