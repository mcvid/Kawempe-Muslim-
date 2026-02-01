"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { Clock, CalendarDays } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

interface Settings {
    academic_year: string;
    application_deadline: string;
    reporting_date: string;
}

const AdmissionsDates = () => {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await supabase.from("admissions_settings").select("*").maybeSingle();
                if (data) {
                    setSettings(data);
                } else {
                    setSettings({
                        academic_year: "2026",
                        application_deadline: "2026-02-15",
                        reporting_date: "2026-03-01"
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "To Be Announced";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    if (loading) return null;

    return (
        <section className={`py-16 bg-[#F8FAFC] ${poppins.variable}`}>
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-10">
                    <h2 className={`text-3xl font-bold text-slate-900 mb-3 ${poppins.className}`}>
                        Important Dates
                    </h2>
                    <p className="text-slate-600">
                        Stay informed about our upcoming academic year {settings?.academic_year || ""} admissions schedule.
                    </p>
                </div>

                <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                    <div className="divide-y divide-slate-100">
                        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-red-500" />
                                </div>
                                <div>
                                    <h4 className={`text-lg font-bold text-slate-900 ${poppins.className}`}>
                                        Application Deadline
                                    </h4>
                                    <p className="text-slate-500 text-sm">Submit your online or physical forms before this date.</p>
                                </div>
                            </div>
                            <div className={`text-2xl font-bold text-slate-900 ${poppins.className}`}>
                                {formatDate(settings?.application_deadline)}
                            </div>
                        </div>

                        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                                    <CalendarDays className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 className={`text-lg font-bold text-slate-900 ${poppins.className}`}>
                                        Reporting Date
                                    </h4>
                                    <p className="text-slate-500 text-sm">Official start date for first term students.</p>
                                </div>
                            </div>
                            <div className={`text-2xl font-bold text-slate-900 ${poppins.className}`}>
                                {formatDate(settings?.reporting_date)}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-400 text-sm italic">
                    * Dates are subject to change by school administration. Applicants will be notified in such cases.
                </p>
            </div>
        </section>
    );
};

export default AdmissionsDates;
