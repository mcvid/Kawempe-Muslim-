"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { FileText, CheckCircle2 } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

interface Requirement {
    document_name: string;
    purpose: string;
    is_mandatory: boolean;
}

const defaultRequirements: Requirement[] = [
    { document_name: "PLE / UCE Results Slip", purpose: "Evidence of standard academic qualification for O or A Level entry.", is_mandatory: true },
    { document_name: "Previous Academic Reports", purpose: "The last two termly reports from the student’s previous school.", is_mandatory: true },
    { document_name: "Birth Certificate Copy", purpose: "Required for age verification and official records.", is_mandatory: true },
    { document_name: "Passport Photos (3)", purpose: "Standard studio photos for identity card and student files.", is_mandatory: true },
    { document_name: "Transfer / Leaving Letter", purpose: "Required for students transferring between secondary schools.", is_mandatory: false }
];

const AdmissionsRequirements = () => {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequirements = async () => {
            try {
                const { data } = await supabase
                    .from("admissions_requirements")
                    .select("*")
                    .order("created_at", { ascending: true });

                if (data && data.length > 0) {
                    setRequirements(data);
                } else {
                    setRequirements(defaultRequirements);
                }
            } catch (error) {
                console.error("Error fetching admissions requirements:", error);
                setRequirements(defaultRequirements);
            } finally {
                // setLoading(false);
            }
        };
        fetchRequirements();
    }, []);

    return (
        <section className={`py-16 bg-[#F8FAFC] ${poppins.variable}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 mb-4 ${poppins.className}`}>
                        Admission Requirements
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Please ensure you have the following documents ready before starting your application process.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Eligibility Header Card */}
                    <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h4 className={`text-xl font-bold text-slate-900 mb-4 ${poppins.className}`}>
                                Basic Eligibility Criteria
                            </h4>
                            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    "Must have completed previous academic level with required grades.",
                                    "Commitment to follow school rules and Islamic values.",
                                    "Passing the school entrance interview or assessment."
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-slate-600">
                                        <span className="text-green-600 font-bold">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {requirements.map((req, index) => (
                        <div key={index} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-slate-300 transition-all group">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${req.is_mandatory ? "bg-red-50" : "bg-blue-50"}`}>
                                <FileText className={`w-6 h-6 ${req.is_mandatory ? "text-red-500" : "text-blue-500"}`} />
                            </div>
                            <h4 className={`text-lg font-bold text-slate-900 mb-2 flex items-center gap-3 ${poppins.className}`}>
                                {req.document_name}
                                {req.is_mandatory && (
                                    <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-600 rounded-full uppercase tracking-wider font-bold">
                                        Mandatory
                                    </span>
                                )}
                            </h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {req.purpose}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AdmissionsRequirements;
