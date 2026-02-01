"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import {
    Save,
    CheckCircle,
    Info,
    AlertCircle,
    RotateCcw,
    FileText,
    CreditCard
} from "lucide-react";

type Grade = "S.1" | "S.2" | "S.3" | "S.4" | "S.5" | "S.6";

const GRADES: Grade[] = ["S.1", "S.2", "S.3", "S.4", "S.5", "S.6"];
const ACADEMIC_YEAR = "2026-2027";

export default function FeeManager() {
    const [fees, setFees] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const { data: feeData, error: feeError } = await supabase
                .from("fee_structures")
                .select("*")
                .eq("academic_year", ACADEMIC_YEAR);

            if (feeError) throw feeError;

            const feeMap: Record<string, any> = {};
            GRADES.forEach(g => {
                feeMap[g] = {
                    day_tuition: 0,
                    boarding_tuition: 0,
                    functional: 0,
                    requirements: "",
                    day_id: null,
                    boarding_id: null
                };
            });

            feeData?.forEach(f => {
                const grade = f.grade as Grade;
                if (f.boarding_type === "day") {
                    feeMap[grade].day_tuition = f.tuition;
                    feeMap[grade].functional = f.functional_fees;
                    feeMap[grade].requirements = f.requirements_list || "";
                    feeMap[grade].day_id = f.id;
                } else {
                    feeMap[grade].boarding_tuition = f.tuition;
                    feeMap[grade].boarding_id = f.id;
                }
            });
            setFees(feeMap);
        } catch (error: any) {
            console.error("Error fetching data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (grade: Grade, field: string, value: string) => {
        if (field === "requirements") {
            setFees(prev => ({
                ...prev,
                [grade]: { ...prev[grade], [field]: value }
            }));
        } else {
            const numValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
            setFees(prev => ({
                ...prev,
                [grade]: { ...prev[grade], [field]: numValue }
            }));
        }
    };

    const handleSaveAll = async () => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            const updates = [];

            for (const grade of GRADES) {
                const data = fees[grade];

                // Day Structure
                const dayData = {
                    grade,
                    boarding_type: "day",
                    academic_year: ACADEMIC_YEAR,
                    tuition: data.day_tuition,
                    functional_fees: data.functional,
                    requirements_list: data.requirements,
                    is_active: true
                };

                if (data.day_id) {
                    updates.push(supabase.from("fee_structures").update(dayData).eq("id", data.day_id));
                } else {
                    updates.push(supabase.from("fee_structures").insert([dayData]));
                }

                // Boarding Structure
                const boardingData = {
                    grade,
                    boarding_type: "boarding",
                    academic_year: ACADEMIC_YEAR,
                    tuition: data.boarding_tuition,
                    functional_fees: data.functional,
                    requirements_list: data.requirements,
                    is_active: true
                };

                if (data.boarding_id) {
                    updates.push(supabase.from("fee_structures").update(boardingData).eq("id", data.boarding_id));
                } else {
                    updates.push(supabase.from("fee_structures").insert([boardingData]));
                }
            }

            await Promise.all(updates);
            setSaveSuccess(true);
            fetchAllData();
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error: any) {
            alert("Error saving: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex items-center gap-3 text-slate-500">
                    <RotateCcw className="w-5 h-5 animate-spin" />
                    <span>Loading fee data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight">
                        Fee <span className="text-amber-500">System Manager</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 max-w-xl">
                        Manage tuition and functional fees. Note: Requirements are listed as items for students to purchase themselves
                        and are not included in the school UGX total.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSaveAll}
                        disabled={saving}
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${saveSuccess ? "bg-green-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
                            } disabled:opacity-50`}
                    >
                        {saveSuccess ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : saveSuccess ? "Saved Successfully" : "Update All Fees"}
                    </button>
                </div>
            </div>

            {/* Fees Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">Class</th>
                                <th className="px-6 py-4 text-xs font-bold text-amber-600 uppercase tracking-wider">Day Tuition</th>
                                <th className="px-6 py-4 text-xs font-bold text-amber-600 uppercase tracking-wider border-r border-slate-100">Boarding Tuition</th>
                                <th className="px-6 py-4 text-xs font-bold text-green-600 uppercase tracking-wider border-r border-slate-100">Functional</th>
                                <th className="px-6 py-4 text-xs font-bold text-blue-600 uppercase tracking-wider">Requirement Items (Self-Purchase)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {GRADES.map((grade) => (
                                <tr key={grade} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 align-top">
                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 text-white font-bold text-sm">
                                            {grade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <input
                                            type="text"
                                            value={fees[grade].day_tuition.toLocaleString()}
                                            onChange={(e) => handleInputChange(grade, "day_tuition", e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                        />
                                    </td>
                                    <td className="px-6 py-4 align-top border-r border-slate-100">
                                        <input
                                            type="text"
                                            value={fees[grade].boarding_tuition.toLocaleString()}
                                            onChange={(e) => handleInputChange(grade, "boarding_tuition", e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                        />
                                    </td>
                                    <td className="px-6 py-4 align-top border-r border-slate-100">
                                        <input
                                            type="text"
                                            value={fees[grade].functional.toLocaleString()}
                                            onChange={(e) => handleInputChange(grade, "functional", e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <textarea
                                            value={fees[grade].requirements}
                                            onChange={(e) => handleInputChange(grade, "requirements", e.target.value)}
                                            placeholder="e.g. 2 Reams of paper, 1 Broom..."
                                            rows={2}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* School Pay Setup Info */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-600 rounded-xl">
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
                            School Pay Integration
                        </h2>
                        <p className="text-sm text-slate-600">
                            The public page will feature the <strong>School Pay</strong> payment method exclusively.
                            Ensure all fee codes and student IDs are correctly mapped in the School Pay system to match these UGX values.
                        </p>
                    </div>
                </div>
            </div>

            {/* Guidelines */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Management Guidelines
                </h2>
                <ul className="space-y-4 text-sm text-slate-600">
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">1</span>
                        <p><strong>Requirements Items:</strong> List items separated by commas or new lines. These will appear as a checklist for parents, but their cost will <strong>not</strong> be added to the school's tuition total.</p>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">2</span>
                        <p><strong>Numerical Values:</strong> The system automatically cleans inputs. You don't need to type commas or "UGX".</p>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">3</span>
                        <p><strong>Real-time Sync:</strong> Updates saved here will reflect immediately on the light-themed public fees page.</p>
                    </li>
                </ul>
            </div>
        </div>
    );
}
