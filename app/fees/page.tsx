"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import {
    GraduationCap,
    Monitor,
    Check,
    CreditCard,
    Info,
    ArrowRight
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
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-[family-name:var(--font-inter)] pt-16 md:pt-[140px] pb-32">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Section */}
                <div className="text-center md:text-center mb-16 px-4">
                    <h1 className="text-5xl md:text-7xl font-poppins font-[800] uppercase tracking-[0.1em] leading-none text-[#0F172A] mb-6 inline-block">
                        School <span className="text-[#F59E0B]">Fees</span>
                    </h1>
                    <p className="text-[#64748B] max-w-2xl mx-auto font-normal tracking-wide text-lg md:text-xl font-inter">
                        Ensuring excellence through transparent and fair academic investment for the 2026-2027 year.
                    </p>
                </div>

                {/* Top Controls: Slider & Toggle (Bento Header) */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
                    <div className="flex-1 w-full lg:w-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748B] font-poppins">Grade Selection</h2>
                            <span className="px-4 py-1 bg-amber-50 text-[#F59E0B] text-xs font-bold rounded-full border border-amber-100 uppercase tracking-widest font-poppins">
                                Class: {selectedGrade}
                            </span>
                        </div>
                        <div className="relative pt-2">
                            {/* Thicker Slider Track for Mobile-First Touch */}
                            <div className="absolute top-[11px] left-0 w-full h-[8px] bg-slate-200 rounded-full" />
                            <div
                                className="absolute top-[11px] left-0 h-[8px] bg-[#F59E0B] rounded-full transition-all duration-300 pointer-events-none"
                                style={{ width: `${(GRADES.indexOf(selectedGrade) / (GRADES.length - 1)) * 100}%` }}
                            />
                            <input
                                type="range"
                                min={0}
                                max={5}
                                step={1}
                                value={GRADES.indexOf(selectedGrade)}
                                onChange={(e) => handleGradeChange(parseInt(e.target.value))}
                                className="relative z-10 w-full h-[8px] bg-transparent appearance-none cursor-pointer accent-[#F59E0B] [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#F59E0B] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                            />
                            <div className="flex justify-between mt-4 px-1 font-inter">
                                {GRADES.map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setSelectedGrade(g)}
                                        className={`text-[12px] font-medium transition-all ${selectedGrade === g ? "text-[#F59E0B] font-bold scale-110" : "text-[#64748B] hover:text-[#0F172A]"}`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block w-px h-16 bg-slate-100 mx-8" />

                    <div className="flex bg-slate-50 p-1.5 rounded-full border border-slate-100 self-center">
                        <button
                            onClick={() => setBoardingType("day")}
                            className={`px-10 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.1em] transition-all font-poppins ${boardingType === "day"
                                ? "bg-[#F59E0B] text-white shadow-sm"
                                : "text-[#64748B] hover:text-[#0F172A]"
                                }`}
                        >
                            Day Scholar
                        </button>
                        <button
                            onClick={() => setBoardingType("boarding")}
                            className={`px-10 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.1em] transition-all font-poppins ${boardingType === "boarding"
                                ? "bg-[#F59E0B] text-white shadow-sm"
                                : "text-[#64748B] hover:text-[#0F172A]"
                                }`}
                        >
                            Boarding
                        </button>
                    </div>
                </div>

                {/* Main Content: Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch mb-12">

                    {/* 1. School Tuition (4 columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-4 bg-white rounded-[2.5rem] border-t-4 border-t-[#F59E0B] border-x border-b border-slate-100 p-10 flex flex-col hover:border-[#F59E0B]/50 transition-all duration-500 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]"
                    >
                        <div className="mb-12">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8">
                                <GraduationCap size={24} />
                            </div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748B] mb-3 font-poppins">Academic Core</h3>
                            <h2 className="text-xl font-poppins font-semibold text-[#0F172A] leading-tight mb-4 tracking-[0.05em] uppercase">School Tuition</h2>
                            <p className="text-sm text-[#64748B] font-inter leading-relaxed">
                                Covers the cost of everyday learning, classroom materials, and teacher-led academic sessions throughout the term.
                            </p>
                        </div>
                        <div className="mt-auto">
                            <p className="text-4xl font-[700] text-[#0F172A] mb-2 font-inter tabular-nums tracking-tight">
                                <span className="text-sm font-semibold text-[#64748B] mr-2 uppercase tracking-wider">UGX</span>
                                {formatCurrency(feeStructure?.tuition || 0)}
                            </p>
                            <p className="text-[12px] font-normal text-[#64748B] leading-relaxed max-w-[240px] font-inter uppercase tracking-widest font-semibold opacity-60">
                                Termly Coverage
                            </p>
                        </div>
                    </motion.div>

                    {/* 2. Functional Fees (4 columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-4 bg-white rounded-[2.5rem] border-t-4 border-t-[#F59E0B] border-x border-b border-slate-100 p-10 flex flex-col hover:border-[#F59E0B]/50 transition-all duration-500 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]"
                    >
                        <div className="mb-12">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8">
                                <Monitor size={24} />
                            </div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748B] mb-3 font-poppins uppercase">Operations</h3>
                            <h2 className="text-xl font-poppins font-semibold text-[#0F172A] leading-tight mb-4 tracking-[0.05em] uppercase">Functional Fees</h2>
                            <p className="text-sm text-[#64748B] font-inter leading-relaxed">
                                Supporting ICT infrastructure, library updates, extracurricular activities, and general campus enrichment.
                            </p>
                        </div>
                        <div className="mt-auto">
                            <p className="text-4xl font-[700] text-[#0F172A] mb-2 font-inter tabular-nums tracking-tight">
                                <span className="text-sm font-semibold text-[#64748B] mr-2 uppercase tracking-wider">UGX</span>
                                {formatCurrency(feeStructure?.functional_fees || 0)}
                            </p>
                            <p className="text-[12px] font-normal text-[#64748B] leading-relaxed max-w-[240px] font-inter uppercase tracking-widest font-semibold opacity-60">
                                Resource Fund
                            </p>
                        </div>
                    </motion.div>

                    {/* 3. Total Year Estimate (4 columns) - Authority Emerald */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-4 bg-[#065F46] rounded-[2.5rem] p-10 text-white flex flex-col justify-between relative overflow-hidden shadow-xl"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                            <CreditCard size={180} />
                        </div>
                        <div>
                            <h3 className="text-xl font-poppins font-semibold tracking-[0.05em] mb-2 uppercase">
                                Total <span className="underline underline-offset-8 decoration-white/20">Term Fee</span>
                            </h3>
                            <p className="text-[11px] text-white/40 uppercase tracking-widest font-bold font-poppins">Official Investment</p>
                        </div>
                        <div>
                            <div className="mb-12 font-inter">
                                <p className="text-5xl font-bold tracking-tighter mb-1 tabular-nums">
                                    {formatCurrency(totalFees)}
                                </p>
                                <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">Ugandan Shillings</p>
                            </div>
                            <div className="flex items-center justify-between p-5 bg-black/20 rounded-3xl border border-white/5 group hover:bg-black/30 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                        <CreditCard size={18} />
                                    </div>
                                    <div className="font-inter">
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Integration</p>
                                        <p className="text-sm font-bold tracking-tight text-white">School Pay</p>
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-[#F59E0B] group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </motion.div>

                    {/* 4. Requirements Checklist (8 columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-8 bg-white rounded-[2.5rem] border-t-4 border-t-[#F59E0B] border-x border-b border-slate-100 p-10 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]"
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                            <div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748B] mb-3 font-poppins">Supply Checklist</h3>
                                <h2 className="text-3xl font-poppins font-bold text-[#0F172A] leading-tight mb-4 tracking-[0.05em] uppercase">Student Requirements</h2>
                                <p className="text-sm text-[#64748B] font-inter leading-relaxed max-w-md">
                                    Personal scholastic and hygiene items required for term readiness. These should be purchased independently.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 text-[#0F172A] rounded-3xl border border-slate-100 text-[13px] font-medium max-w-sm">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                    <Info size={16} className="text-[#F59E0B]" />
                                </div>
                                <p className="leading-relaxed font-poppins uppercase text-[10px] tracking-widest font-bold text-[#64748B]"> Mandatory Reporting Items </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {requirements.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 4 }}
                                    className="group flex items-center gap-6 p-6 bg-slate-50/50 hover:bg-white rounded-[2rem] border border-transparent hover:border-slate-100 transition-all duration-300"
                                >
                                    <div className="w-5 h-5 flex items-center justify-center text-emerald-500 flex-shrink-0">
                                        <Check size={20} className="stroke-[1.5px]" />
                                    </div>
                                    <span className="text-[14px] font-[400] text-slate-600 font-inter uppercase tracking-tight">{item}</span>
                                </motion.div>
                            ))}
                            {requirements.length === 0 && (
                                <p className="text-[#64748B] text-sm font-medium col-span-2 py-8 text-center italic font-inter">No class-specific requirements found.</p>
                            )}
                        </div>
                    </motion.div>

                    {/* 5. Support & Application (4 columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-4 bg-white rounded-[2.5rem] border-t-4 border-t-[#F59E0B] border-x border-b border-slate-100 p-10 flex flex-col justify-between shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]"
                    >
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#64748B] mb-8 font-poppins">Admissions Support</h3>
                            <div className="space-y-8 font-inter">
                                <div className="flex gap-5">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#065F46]" />
                                    </div>
                                    <p className="text-sm font-medium text-[#0F172A] leading-relaxed italic">
                                        Tuition must be cleared prior to registration each term.
                                    </p>
                                </div>
                                <div className="flex gap-5">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                                    </div>
                                    <p className="text-sm font-medium text-[#64748B] leading-relaxed italic">
                                        Independent purchase required for listed supplies.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <Link
                                href="/admissions/apply"
                                className="flex items-center justify-center gap-3 w-full py-6 bg-[#F59E0B] text-white rounded-full text-[13px] font-semibold uppercase tracking-[0.15em] hover:bg-[#D97706] transition-all shadow-lg shadow-amber-900/10 font-poppins"
                            >
                                Admissions Portal
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>

                </div>

            </div>

            {/* Footer */}
            <Footer />

            {/* Mobile Glassmorphism Total Bar */}
            <AnimatePresence>
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-4"
                >
                    <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 shadow-2xl flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-1 font-poppins">Term Total</p>
                            <p className="text-2xl font-bold font-inter tabular-nums text-[#0F172A]">
                                <span className="text-[10px] mr-1 opacity-50">UGX</span>
                                {formatCurrency(totalFees)}
                            </p>
                        </div>
                        <button className="h-12 w-12 bg-[#F59E0B] text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
