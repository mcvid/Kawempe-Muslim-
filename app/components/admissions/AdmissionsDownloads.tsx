"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { Download, FileText } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

interface DownloadItem {
    label: string;
    file_url: string;
    file_type: string;
    sort_order?: number;
}

const defaultDownloads: DownloadItem[] = [
    { label: "Application Form (PDF)", file_url: "#", file_type: "PDF" },
    { label: "School Prospectus 2026", file_url: "#", file_type: "PDF" },
    { label: "Fees Structure & Financial Policy", file_url: "#", file_type: "PDF" },
    { label: "Student Code of Conduct", file_url: "#", file_type: "PDF" }
];

const AdmissionsDownloads = () => {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDownloads = async () => {
            try {
                const { data } = await supabase
                    .from("admissions_downloads")
                    .select("*")
                    .order("sort_order", { ascending: true });

                if (data && data.length > 0) {
                    setDownloads(data);
                } else {
                    setDownloads(defaultDownloads);
                }
            } catch (error) {
                console.error("Error fetching downloads:", error);
                setDownloads(defaultDownloads);
            } finally {
                // setLoading(false);
            }
        };
        fetchDownloads();
    }, []);

    return (
        <section className={`py-16 bg-white ${poppins.variable}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 mb-4 ${poppins.className}`}>
                        Admissions Resources
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Quickly download important documents and templates for your application.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {downloads.map((item, index) => (
                        <a
                            key={index}
                            href={item.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col p-8 bg-[#F8FAFC] rounded-3xl border border-slate-100 hover:border-blue-200 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl border border-slate-50 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                <FileText className={`w-6 h-6 ${index % 2 === 0 ? "text-red-500" : "text-blue-500"}`} />
                            </div>
                            <h4 className={`text-slate-900 font-bold mb-6 flex-grow ${poppins.className}`}>
                                {item.label}
                            </h4>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400 font-medium uppercase tracking-wider">{item.file_type}</span>
                                <div className="flex items-center gap-2 text-blue-600 font-bold">
                                    Download <Download className="w-4 h-4" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AdmissionsDownloads;
