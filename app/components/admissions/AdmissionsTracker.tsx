"use client";
import React, { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Search, Loader2, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

type ApplicationResult = {
    id: string;
    student_name: string;
    status: string;
    reference_no: string;
    created_at: string;
    entry_class?: string;
};

const AdmissionsTracker = () => {
    const [referenceNo, setReferenceNo] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ApplicationResult | null>(null);
    const [error, setError] = useState("");

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!referenceNo.trim()) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const { data, error } = await supabase
                .from("admission_applications")
                .select("*")
                .eq("reference_no", referenceNo.trim().toUpperCase())
                .maybeSingle();

            if (error) throw error;

            if (data) {
                setResult(data);
            } else {
                setError("No application found with this reference number. Please check and try again.");
            }
        } catch (err) {
            console.error("Error tracking application:", err);
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "approved":
            case "accepted":
                return {
                    icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
                    bg: "bg-green-50",
                    badge: "bg-green-100 text-green-700",
                    label: "Approved",
                    message: "Congratulations! Your application has been approved. Please check your email for enrollment instructions.",
                };
            case "rejected":
                return {
                    icon: <XCircle className="w-12 h-12 text-red-500" />,
                    bg: "bg-red-50",
                    badge: "bg-red-100 text-red-700",
                    label: "Declined",
                    message: "We regret to inform you that your application was not successful. Please contact admissions for more information.",
                };
            case "under_review":
                return {
                    icon: <Clock className="w-12 h-12 text-amber-500" />,
                    bg: "bg-amber-50",
                    badge: "bg-amber-100 text-amber-700",
                    label: "Under Review",
                    message: "Your application is currently being reviewed by our admissions team. We will notify you soon.",
                };
            default:
                return {
                    icon: <AlertCircle className="w-12 h-12 text-gray-500" />,
                    bg: "bg-gray-50",
                    badge: "bg-gray-100 text-gray-700",
                    label: "Pending",
                    message: "Your application has been received and is awaiting review. Thank you for your patience.",
                };
        }
    };

    return (
        <section className={`py-16 bg-white ${poppins.variable}`} id="track-status">
            <div className="max-w-2xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className={`text-3xl font-bold text-gray-900 mb-3 ${poppins.className}`}>
                        Track Your Application
                    </h2>
                    <p className="text-gray-600">
                        Enter your reference number to check the status of your admission application
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleTrack} className="flex gap-3 mb-8">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Enter reference number"
                            value={referenceNo}
                            onChange={(e) => setReferenceNo(e.target.value.toUpperCase())}
                            className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl text-lg font-medium tracking-wider focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all uppercase"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !referenceNo.trim()}
                        className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Track"
                        )}
                    </button>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 mb-6">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Result Card */}
                {result && (
                    <div className={`rounded-2xl p-8 text-center ${getStatusConfig(result.status).bg} border border-gray-100 animate-in fade-in zoom-in duration-300`}>
                        <div className="flex justify-center mb-4">
                            {getStatusConfig(result.status).icon}
                        </div>

                        <h3 className={`text-xl font-bold text-gray-900 mb-3 ${poppins.className}`}>
                            {result.student_name}
                        </h3>

                        <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide mb-4 ${getStatusConfig(result.status).badge}`}>
                            {getStatusConfig(result.status).label}
                        </span>

                        <p className="text-gray-600 leading-relaxed">
                            {getStatusConfig(result.status).message}
                        </p>

                        {result.entry_class && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <span className="text-sm text-gray-500">Applied for: </span>
                                <span className="font-medium text-gray-900">{result.entry_class}</span>
                            </div>
                        )}

                        {(result.status === "approved" || result.status === "accepted") && (
                            <div className="mt-6 p-4 bg-green-100 rounded-xl">
                                <p className="text-sm text-green-700 font-medium tracking-tight">
                                    📧 Check your registered email for enrollment instructions and next steps.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdmissionsTracker;
