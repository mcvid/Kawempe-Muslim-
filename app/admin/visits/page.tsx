"use client";

import VisitsManager from "@/app/components/admin/VisitsManager";

export default function VisitsAdminPage() {
    return (
        <div className="space-y-6 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Visit Management</h1>
                    <p className="text-slate-500 text-sm">Review and manage campus tour requests from prospective students and parents.</p>
                </div>
            </div>
            
            <VisitsManager />
        </div>
    );
}
