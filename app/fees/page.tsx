"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import {
    GraduationCap,
    Monitor,
    Check,
    CreditCard,
    Info,
    ArrowRight,
    Banknote,
    Smartphone,
    ShieldCheck,
    Calendar,
    Users,
    ChevronRight,
    Lock,
    Globe
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/app/components/Footer";

type Grade = "S.1" | "S.2" | "S.3" | "S.4" | "S.5" | "S.6";
type BoardingType = "day" | "boarding";

interface FeeStructure {
    id: string;
    grade: Grade;
    boarding_type: BoardingType;
    tuition: number;
    functional_fees: number;
    requirements_list: string;
}

const GRADES: Grade[] = ["S.1", "S.2", "S.3", "S.4", "S.5", "S.6"];
const ACADEMIC_YEAR = "2026-2027";

export default function FeesPage() {
    const [selectedGrade, setSelectedGrade] = useState<Grade>("S.1");
    const [boardingType, setBoardingType] = useState<BoardingType>("day");
    const [feeStructure, setFeeStructure] = useState<FeeStructure | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeeStructure();
    }, [selectedGrade, boardingType]);

    const fetchFeeStructure = async () => {
        try {
            const { data, error } = await supabase
                .from("fee_structures")
                .select("*")
                .eq("grade", selectedGrade)
                .eq("boarding_type", boardingType)
                .eq("academic_year", ACADEMIC_YEAR)
                .eq("is_active", true)
                .single();

            if (error && error.code !== "PGRST116") throw error;
            setFeeStructure(data);
        } catch (error: any) {
            console.error("Error fetching fees:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGradeChange = (val: number) => {
        const newGrade = GRADES[val];
        if (newGrade !== selectedGrade) {
            setSelectedGrade(newGrade);
            if (typeof window !== "undefined" && window.navigator.vibrate) {
                window.navigator.vibrate(10);
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-UG", {
            style: "decimal",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const totalFees = feeStructure ? feeStructure.tuition + feeStructure.functional_fees : 0;

    const requirements = feeStructure?.requirements_list
        ? feeStructure.requirements_list.split(/[,|\n]/).map(s => s.trim()).filter(s => s)
        : [];

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1B] font-inter pt-24 md:pt-[120px] pb-32 overflow-hidden selection:bg-red-500 selection:text-white">
            {/* Geometric Background Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Hero Section: Fee Calculator */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-poppins font-bold uppercase tracking-widest mb-6 border border-red-100"
                        >
                            <Lock size={12} strokeWidth={2.5} />
                            Secured Academic Gateway
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-poppins font-black text-[#1A1A1B] tracking-tight leading-none mb-4">
                            Invest in <span className="text-red-600">Excellence.</span>
                        </h1>
                        <p className="text-slate-400 font-inter font-medium tracking-tight text-lg md:text-xl italic">
                            Academic Year {ACADEMIC_YEAR} • Transparency by Design
                        </p>
                    </div>

                    {/* Fee Calculator Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group"
                    >
                        {/* Decorative Inner Glow */}
                        <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-7">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white">
                                        <GraduationCap size={20} />
                                    </div>
                                    <h2 className="text-xl font-poppins font-bold tracking-tight">Fee Calculator</h2>
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-xs font-poppins font-bold uppercase tracking-widest text-slate-400">Target Level</label>
                                            <span className="text-sm font-poppins font-black text-red-600 px-3 py-1 bg-red-50 rounded-lg border border-red-100 italic">Class: {selectedGrade}</span>
                                        </div>
                                        <div className="relative pt-6">
                                            {/* Track */}
                                            <div className="absolute top-[28px] left-0 w-full h-[3px] bg-slate-100 rounded-full" />
                                            <motion.div
                                                className="absolute top-[28px] left-0 h-[3px] bg-red-600 rounded-full"
                                                animate={{ width: `${(GRADES.indexOf(selectedGrade) / (GRADES.length - 1)) * 100}%` }}
                                            />
                                            <input
                                                type="range"
                                                min={0}
                                                max={5}
                                                step={1}
                                                value={GRADES.indexOf(selectedGrade)}
                                                onChange={(e) => handleGradeChange(parseInt(e.target.value))}
                                                className="relative z-10 w-full h-1.5 bg-transparent appearance-none cursor-pointer accent-red-600 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-red-600 [&::-webkit-slider-thumb]:rounded-full"
                                            />
                                            <div className="flex justify-between mt-6 px-1">
                                                {GRADES.map((g) => (
                                                    <button
                                                        key={g}
                                                        onClick={() => setSelectedGrade(g)}
                                                        className={`text-xs font-poppins font-black transition-all ${selectedGrade === g ? "text-red-600" : "text-slate-300 hover:text-red-400"}`}
                                                    >
                                                        {g}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <label className="text-xs font-poppins font-bold uppercase tracking-widest text-slate-400 mb-4 block">Residency</label>
                                            <div className="flex p-1.5 bg-slate-50 border border-slate-200 rounded-2xl">
                                                <button
                                                    onClick={() => setBoardingType("day")}
                                                    className={`flex-1 py-3 text-[11px] font-inter font-bold uppercase tracking-widest transition-all rounded-xl ${boardingType === "day" ? "bg-white text-red-600 border border-slate-100" : "text-slate-400 hover:text-red-600"}`}
                                                >
                                                    Day
                                                </button>
                                                <button
                                                    onClick={() => setBoardingType("boarding")}
                                                    className={`flex-1 py-3 text-[11px] font-inter font-bold uppercase tracking-widest transition-all rounded-xl ${boardingType === "boarding" ? "bg-white text-red-600 border border-slate-100" : "text-slate-400 hover:text-red-600"}`}
                                                >
                                                    Boarding
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-poppins font-bold uppercase tracking-widest text-slate-400 mb-4 block">Termly Period</label>
                                            <div className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-inter font-bold text-slate-600 tracking-widest uppercase">
                                                First Term 2026/27
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 h-full">
                                {/* The Total "Fintech" Card - Flat Gradient */}
                                <motion.div
                                    layout
                                    className="h-full bg-gradient-to-br from-[#1A1A1B] via-[#2A2A2B] to-[#1A1A1B] rounded-[2rem] p-8 md:p-10 text-white flex flex-col justify-between border border-white/5 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />

                                    <div>
                                        <div className="flex items-center gap-2 text-red-500 mb-10">
                                            <ShieldCheck size={16} />
                                            <span className="text-[10px] font-inter font-black uppercase tracking-[0.3em]">Verified Settlement</span>
                                        </div>
                                        <h3 className="text-xs font-inter font-bold text-white/40 uppercase tracking-[0.3em] mb-4">Total Term Fee</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-poppins font-bold text-red-500">UGX</span>
                                            <motion.span
                                                key={totalFees}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-5xl md:text-6xl font-poppins font-black tracking-tighter tabular-nums"
                                            >
                                                {formatCurrency(totalFees)}
                                            </motion.span>
                                        </div>
                                    </div>

                                    <div className="mt-12 space-y-4">
                                        <Link
                                            href="/admissions/contact"
                                            className="w-full py-5 bg-white text-[#1A1A1B] font-poppins font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-red-50 transition-colors"
                                        >
                                            Generate Invoice
                                            <ChevronRight size={16} strokeWidth={3} />
                                        </Link>
                                        <button className="w-full py-5 border border-white/10 text-white/60 font-poppins font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:text-white hover:bg-white/5 transition-all">
                                            Scholarship Inquiry
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Breakdown & Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-20">

                    {/* Left: Fee Breakdown */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center gap-6 mb-10">
                            <h2 className="text-3xl font-poppins font-black text-[#1A1A1B] tracking-tight uppercase">Structure <span className="text-red-600">Details</span></h2>
                            <div className="flex-1 h-[1px] bg-slate-100" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                className="p-10 bg-white border border-slate-200 rounded-[2.5rem] hover:border-red-100 transition-all duration-500 group"
                            >
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-8 border border-slate-100 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                                    <Monitor size={24} strokeWidth={1.5} />
                                </div>
                                <h4 className="text-[10px] font-inter font-black uppercase tracking-[0.3em] text-slate-300 mb-3 italic">Operations Module</h4>
                                <h3 className="text-2xl font-poppins font-bold mb-4 tracking-tight uppercase">Functional Fees</h3>
                                <p className="text-sm text-slate-400 font-inter font-medium leading-relaxed mb-10 tracking-tight italic">
                                    Encompasses lab resources, high-speed campus connectivity, and library modernization.
                                </p>
                                <div className="text-3xl font-poppins font-black tabular-nums">
                                    <span className="text-xs text-slate-300 mr-2 uppercase">UGX</span>
                                    {formatCurrency(feeStructure?.functional_fees || 0)}
                                </div>
                            </motion.div>

                            <motion.div
                                className="p-10 bg-white border border-slate-200 rounded-[2.5rem] hover:border-red-100 transition-all duration-500 group"
                            >
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-8 border border-slate-100 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                                    <Globe size={24} strokeWidth={1.5} />
                                </div>
                                <h4 className="text-[10px] font-inter font-black uppercase tracking-[0.3em] text-slate-300 mb-3 italic">Academic Module</h4>
                                <h3 className="text-2xl font-poppins font-bold mb-4 tracking-tight uppercase">Standard Tuition</h3>
                                <p className="text-sm text-slate-400 font-inter font-medium leading-relaxed mb-10 tracking-tight italic">
                                    Covers faculty compensation, classroom maintenance, and core educational pedagogy.
                                </p>
                                <div className="text-3xl font-poppins font-black tabular-nums">
                                    <span className="text-xs text-slate-300 mr-2 uppercase">UGX</span>
                                    {formatCurrency(feeStructure?.tuition || 0)}
                                </div>
                            </motion.div>
                        </div>

                        {/* Supply Checklist */}
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 mt-12">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h3 className="text-2xl font-poppins font-black tracking-tight mb-2 uppercase">Scholastic <span className="text-red-600">Checklist</span></h3>
                                    <p className="text-xs font-inter font-bold text-slate-400 uppercase tracking-widest italic">Mandatory supplies for term entry</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl text-slate-400">
                                    <Info size={20} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {requirements.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-red-200 transition-all">
                                        <div className="w-6 h-6 bg-white border-2 border-slate-200 rounded-lg flex items-center justify-center group-hover:border-red-600 group-hover:bg-red-50 transition-all">
                                            <Check size={14} className="text-red-600 scale-0 group-hover:scale-100 transition-transform" strokeWidth={4} />
                                        </div>
                                        <span className="text-xs font-inter font-bold text-slate-600 uppercase tracking-tight">{item}</span>
                                    </div>
                                ))}
                                {requirements.length === 0 && (
                                    <div className="col-span-2 py-10 text-center italic text-slate-400 text-xs font-inter font-bold uppercase tracking-widest">No requirements specified for this class.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Policy Sidebar */}
                    <div className="lg:col-span-4 space-y-8 sticky top-24">
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.2rem] text-white">
                            <h3 className="text-xs font-inter font-black uppercase tracking-[0.3em] text-red-500 mb-10 italic">Financial Directives</h3>
                            <div className="space-y-12">
                                <div className="flex gap-6">
                                    <div className="w-1 h-12 bg-red-600 rounded-full flex-shrink-0" />
                                    <div>
                                        <h4 className="text-[10px] font-inter font-black uppercase tracking-widest text-white/40 mb-2">Policy Code 01</h4>
                                        <p className="text-[13px] font-inter font-bold leading-relaxed text-white/80 uppercase">Tuition must be cleared prior to registration each term.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-1 h-12 bg-white/10 rounded-full flex-shrink-0" />
                                    <div>
                                        <h4 className="text-[10px] font-inter font-black uppercase tracking-widest text-white/40 mb-2">Policy Code 02</h4>
                                        <p className="text-[13px] font-inter font-bold leading-relaxed text-white/60 uppercase">Late settlement incurs a 5% administrative surcharge.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-1 h-12 bg-red-600 rounded-full flex-shrink-0" />
                                    <div>
                                        <h4 className="text-[10px] font-inter font-black uppercase tracking-widest text-white/40 mb-2">Policy Code 03</h4>
                                        <p className="text-[13px] font-inter font-bold leading-relaxed text-white/80 uppercase italic">10% tuition discount applied for biological families (3+).</p>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                className="w-full mt-14 py-5 bg-red-600 rounded-2xl font-poppins font-black text-xs uppercase tracking-[0.2em]"
                            >
                                Download Prospectus
                            </motion.button>
                        </div>

                        {/* Payment Cards */}
                        <div className="p-8 bg-white border border-slate-200 rounded-[2.2rem]">
                            <h3 className="text-[10px] font-inter font-black uppercase tracking-widest text-slate-300 mb-8 italic">Secure Payment Channels</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-red-200 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-600">
                                            <Banknote size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-inter font-black text-slate-500 uppercase tracking-widest italic">Bank Deposit</p>
                                            <p className="text-xs font-inter font-black uppercase">Stanbic 903...</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={14} className="text-slate-200 group-hover:text-red-500" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-red-200 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-600">
                                            <Smartphone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-inter font-black text-slate-500 uppercase tracking-widest italic">Mobile Money</p>
                                            <p className="text-xs font-inter font-black uppercase">MTN / Airtel</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={14} className="text-slate-200 group-hover:text-red-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <Footer />

            {/* Mobile Fintech Sticky Total - No Shadows */}
            <AnimatePresence>
                <motion.div
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-8"
                >
                    <div className="bg-[#1A1A1B] border border-white/10 rounded-[2rem] p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-inter font-black uppercase tracking-[0.3em] text-red-500 mb-1 italic">Term Total</p>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xs font-inter font-bold text-white/30 tracking-widest">UGX</span>
                                <span className="text-2xl font-poppins font-black text-white tabular-nums tracking-tighter">
                                    {formatCurrency(totalFees)}
                                </span>
                            </div>
                        </div>
                        <button className="h-14 w-14 bg-red-600 text-white rounded-2xl flex items-center justify-center active:scale-95 transition-transform">
                            <ChevronRight size={24} strokeWidth={3} />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
