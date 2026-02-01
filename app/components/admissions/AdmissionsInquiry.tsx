"use client";
import React, { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Send, CheckCircle } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

interface InquiryFormData {
    parent_name: string;
    email: string;
    phone: string;
    student_level: string;
    message: string;
}

const AdmissionsInquiry = () => {
    const [formData, setFormData] = useState<InquiryFormData>({
        parent_name: "",
        email: "",
        phone: "",
        student_level: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from("admissions_inquiries").insert([formData]);
            if (error) throw error;
            setSubmitted(true);
        } catch (error) {
            console.error("Error submitting inquiry:", error);
            alert("There was an error submitting your inquiry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className={`py-16 px-6 ${poppins.variable}`}>
                <div className="max-w-xl mx-auto bg-green-50 p-10 rounded-3xl text-center border border-green-100 animate-in fade-in zoom-in duration-500">
                    <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className={`text-2xl font-bold text-slate-900 mb-4 ${poppins.className}`}>
                        Inquiry Received
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Thank you for your interest! Our admissions officer will get back to you within 24-48 hours via email or phone.
                    </p>
                    <button
                        className="px-8 py-3 bg-white text-green-600 border-2 border-green-600 rounded-xl font-bold hover:bg-green-600 hover:text-white transition-all transform active:scale-95"
                        onClick={() => setSubmitted(false)}
                    >
                        Send Another Inquiry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className={`py-16 bg-white ${poppins.variable}`} id="inquiry-form">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl font-bold text-slate-900 mb-4 ${poppins.className}`}>
                        Quick Admissions Inquiry
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Still have questions? Send us a quick message and our team will provide the answers you need.
                    </p>
                </div>

                <div className="bg-[#F8FAFC] p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Parent/Guardian Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.parent_name}
                                    onChange={e => setFormData({ ...formData, parent_name: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-300"
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-300"
                                    placeholder="Enter email address"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-300"
                                    placeholder="+256 ..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Intended Level of Entry</label>
                                <select
                                    required
                                    value={formData.student_level}
                                    onChange={e => setFormData({ ...formData, student_level: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-no-repeat appearance-none"
                                >
                                    <option value="">Select level...</option>
                                    <option value="S.1">Senior 1</option>
                                    <option value="S.2">Senior 2</option>
                                    <option value="S.3">Senior 3</option>
                                    <option value="S.4">Senior 4</option>
                                    <option value="S.5">Senior 5</option>
                                    <option value="S.6">Senior 6</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Message</label>
                            <textarea
                                value={formData.message}
                                required
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-5 py-4 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all min-h-[140px] resize-none placeholder:text-slate-300"
                                placeholder="Describe your inquiry or question here..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-green-700 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:grayscale"
                        >
                            {loading ? (
                                <span className="animate-pulse">Submitting...</span>
                            ) : (
                                <><Send size={20} /> Send Inquiry</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AdmissionsInquiry;
