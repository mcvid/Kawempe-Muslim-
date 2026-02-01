"use client";
import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

const AdmissionsContact = () => {
    const contactInfo = [
        {
            icon: <Phone className="w-6 h-6 text-green-600" />,
            bgColor: "bg-green-50",
            title: "Phone Inquiries",
            value: "+256 (0) 700 000 000",
            sub: "Monday - Friday, 8:00 AM - 5:00 PM"
        },
        {
            icon: <Mail className="w-6 h-6 text-blue-600" />,
            bgColor: "bg-blue-50",
            title: "Email Admissions",
            value: "admissions@bugisuhigh.ac.ug",
            sub: "For technical and application inquiries"
        },
        {
            icon: <MapPin className="w-6 h-6 text-amber-600" />,
            bgColor: "bg-amber-50",
            title: "Office Location",
            value: "Main Administration Block",
            sub: "Room 102, Ground Floor"
        }
    ];

    return (
        <section className={`py-16 bg-[#F8FAFC] ${poppins.variable}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl font-bold text-slate-900 mb-4 ${poppins.className}`}>
                        Admissions Support
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Have questions about the application process? Our team is here to help you every step of the way.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {contactInfo.map((info, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-3xl border border-slate-100 text-center flex flex-col items-center group hover:border-slate-300 transition-colors">
                            <div className={`w-14 h-14 ${info.bgColor} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105`}>
                                {info.icon}
                            </div>
                            <h4 className={`text-lg font-bold text-slate-900 mb-2 ${poppins.className}`}>
                                {info.title}
                            </h4>
                            <p className="text-xl font-bold text-slate-800 mb-1">
                                {info.value}
                            </p>
                            <p className="text-slate-400 text-sm italic">
                                {info.sub}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AdmissionsContact;
