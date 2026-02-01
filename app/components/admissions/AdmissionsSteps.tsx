"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

interface Step {
    title: string;
    description: string;
    sort_order?: number;
}

const defaultSteps: Step[] = [
    { title: "Obtain Application Form", description: "Forms are available at the school bursar’s office or can be downloaded from our resources section." },
    { title: "Submit Documentation", description: "Return the completed form along with previous academic reports, birth certificate copies, and passport photos." },
    { title: "Entrance Assessment", description: "Prospective students may be required to sit a brief diagnostic assessment to determine appropriate class placement." },
    { title: "Admission Decision", description: "Successful applicants are notified within 5 working days and issued an admission letter with reporting details." },
    { title: "Registration & Reporting", description: "Complete the registration by paying the required fees and reporting to campus on the specified date." }
];

const AdmissionsSteps = () => {
    const [steps, setSteps] = useState<Step[]>([]);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSteps = async () => {
            try {
                const { data } = await supabase
                    .from("admissions_steps")
                    .select("*")
                    .order("sort_order", { ascending: true });

                if (data && data.length > 0) {
                    setSteps(data);
                } else {
                    setSteps(defaultSteps);
                }
            } catch (error) {
                console.error("Error fetching admissions steps:", error);
                setSteps(defaultSteps);
            } finally {
                // setLoading(false);
            }
        };
        fetchSteps();
    }, []);

    return (
        <section className={`py-16 bg-white ${poppins.variable}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 mb-4 ${poppins.className}`}>
                        Admission Procedure
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Follow these simple steps to become a part of the Kawempe Muslim Secondary School community.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative pt-10 px-6 pb-8 bg-[#F8FAFC] rounded-3xl border border-slate-100 hover:border-slate-300 transition-all group">
                            <div className={`absolute -top-6 left-6 w-12 h-12 ${["bg-red-500", "bg-blue-500", "bg-amber-500", "bg-green-600", "bg-indigo-500"][index % 5]
                                } text-white rounded-2xl flex items-center justify-center font-bold text-xl transition-transform group-hover:scale-105`}>
                                {index + 1}
                            </div>
                            <h4 className={`text-lg font-bold text-slate-900 mb-3 ${poppins.className}`}>
                                {step.title}
                            </h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {step.description}
                            </p>

                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-10 -right-4 w-8 h-[2px] bg-slate-200 z-0" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AdmissionsSteps;
