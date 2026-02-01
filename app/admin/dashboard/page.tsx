"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Users,
    FileText,
    MessageSquare,
    Megaphone,
    Calendar,
    AlertCircle,
    TrendingUp,
    Plus,
    ArrowUpRight,
    Newspaper,
    GraduationCap,
    DollarSign,
    Trophy,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

type Stats = {
    pendingApps: number;
    pendingInquiries: number;
    unreadMessages: number;
    totalNews: number;
    upcomingEvents: number;
    totalStudents: number;
    totalTeachers: number;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        pendingApps: 0,
        pendingInquiries: 0,
        unreadMessages: 0,
        totalNews: 0,
        upcomingEvents: 0,
        totalStudents: 0,
        totalTeachers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [apps, inqs, msgs, news, events, students, teachers] = await Promise.all([
                supabase.from("admission_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
                supabase.from("admissions_inquiries").select("*", { count: "exact", head: true }).eq("status", "pending"),
                supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "Unread"),
                supabase.from("news").select("*", { count: "exact", head: true }),
                supabase.from("events").select("*", { count: "exact", head: true }).gte("event_date", new Date().toISOString()),
                supabase.from("students").select("*", { count: "exact", head: true }),
                supabase.from("teachers").select("*", { count: "exact", head: true }),
            ]);

            setStats({
                pendingApps: apps.count || 0,
                pendingInquiries: inqs.count || 0,
                unreadMessages: msgs.count || 0,
                totalNews: news.count || 0,
                upcomingEvents: events.count || 0,
                totalStudents: students.count || 0,
                totalTeachers: teachers.count || 0,
            });
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    // Color tokens from breakdown
    const schoolColors = {
        primary: "#006400", // Green
        secondary: "#FFD700", // Yellow
        accent: "#C8102E", // Red
        blue: "#1E3A8A", // Blue
    };

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Page Title Section */}
            <div>
                <h5 className="text-base md:text-lg font-semibold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight">
                    <span className="text-[#006400]">Terminal</span>
                </h5>
                <p className="text-slate-500 mt-2 font-medium max-w-xl">
                    Welcome to the Kawempe Muslim Secondary School central management system. Monitor operations and updates across the campus.
                </p>
            </div>

            {/* Quick Stats Grid (Barlow Typography) */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-3 bg-[#006400] rounded-full" />
                    <h4 className="text-[30px] font-semibold text-slate-400 uppercase tracking-[3px]">At A Glance</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Students */}
                    <div className="bg-white w-65 rounded-2xl p-5 border border-slate-100 group overflow-hidden">
                        <div className="flex items-center justify-between mb-3" >
                            <div className="p-2 rounded-lg bg-blue-50 text-[#1E3A8A]">
                                <Users className="w-10.5 h-5.5" />
                            </div>
                            <span className="text-[8px] font-semibold text-slate-300 uppercase tracking-widest">Live</span>
                        </div>
                        <p className="text-[20px] font-medium text-slate-400 uppercase tracking-wide mb-0.5 truncate">Total Enrollment</p>
                        <p className="text-lg font-bold text-slate-900 font-[var(--font-barlow)]">{loading ? "..." : stats.totalStudents}</p>
                    </div>

                    {/* Staff */}
                    <div className="bg-white  w-65  rounded-2xl p-5 border border-slate-100 group overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-green-50 text-[#006400]">
                                <GraduationCap className="w-10.5 h-3.5" />
                            </div>
                            <span className="text-[8px] font-semibold text-slate-300 uppercase tracking-widest">Staff</span>
                        </div>
                        <p className="text-[20px] font-medium text-slate-400 uppercase tracking-wide mb-0.5 ">Active Faculty</p>
                        <p className="text-lg font-bold text-slate-900 font-[var(--font-barlow)]">{loading ? "..." : stats.totalTeachers}</p>
                    </div>

                    {/* News */}
                    <div className="bg-white rounded-2xl w-65 p-5 border border-slate-100 group overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-yellow-50 text-[#FFD700]">
                                <Newspaper className="w-10.5 h-3.5" />
                            </div>
                            <span className="text-[8px] font-semibold text-slate-300 uppercase tracking-widest">Public</span>
                        </div>
                        <p className="text-[20px] font-medium text-slate-400 uppercase tracking-wide mb-0.5 ">Articles Published</p>
                        <p className="text-lg font-bold text-slate-900 font-[var(--font-barlow)]">{loading ? "..." : stats.totalNews}</p>
                    </div>

                    {/* Events */}
                    <div className="bg-white rounded-2xl w-65 p-5 border border-slate-100 group overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-red-50 text-[#C8102E]">
                                <Calendar className="w-10.5 h-3.5" />
                            </div>
                            <span className="text-[8px] font-semibold text-slate-300 uppercase tracking-widest">Calendar</span>
                        </div>
                        <p className="text-[20px] font-medium text-slate-400 uppercase tracking-wide mb-0.5 ">Upcoming Events</p>
                        <p className="text-lg font-bold text-slate-900 font-[var(--font-barlow)]">{loading ? "..." : stats.upcomingEvents}</p>
                    </div>
                </div>
            </section>

            {/* Critical Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Admissions Table Preview */}
                <section className="bg-white rounded-3xl p-6 border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div className="min-w-0 flex-1">
                            <h4 className="text-base  text-[20px] font-semibold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight truncate">Admissions Pending</h4>
                            <p className="text-[15px] text-slate-400 font-normal tracking-wide italic truncate">Require immediate review</p>
                        </div>
                        <Link
                            href="/admin/admissions"
                            className="p-3 bg-slate-50 text-slate-400 hover:text-[#1E3A8A] hover:bg-blue-50 rounded-2xl transition-all"
                        >
                            <ArrowUpRight className="w-10    h-8" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-10 h-8 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center text-blue-800 font-semibold text-[9px] font-[var(--font-barlow)]">
                                    APP
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[15px] font-semibold text-slate-700 uppercase tracking-wide font-[var(--font-barlow)] truncate">New Applications</p>
                                    <p className="text-[13px] text-slate-400 font-normal truncate">Waiting for review</p>
                                </div>
                            </div>
                            <div className="text-base font-bold text-slate-900 font-[var(--font-barlow)] ml-2">
                                {stats.pendingApps}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-10 h-8 flex-shrink-0 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-800 font-semibold text-[9px] font-[var(--font-barlow)]">
                                    INQ
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[15px] font-semibold text-slate-700 uppercase tracking-wide font-[var(--font-barlow)] truncate">Inquiries</p>
                                    <p className="text-[13px] text-slate-400 font-normal truncate">Admission questions</p>
                                </div>
                            </div>
                            <div className="text-base font-bold text-slate-900 font-[var(--font-barlow)] ml-2">
                                {stats.pendingInquiries}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Command Center */}
                <section className="bg-slate-900 rounded-3xl p-6 relative overflow-hidden">
                    <h4 className="text-[25px] font-semibold text-white font-[var(--font-barlow)] uppercase tracking-tight mb-6">Command Center</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href="/admin/news/new"
                            className="bg-white/5 hover:bg-white/10 text-white  p-4 rounded-2xl transition-all duration-300 border border-white/5 flex flex-col items-center justify-center gap-2 text-center"
                        >
                            <Newspaper className="w-8 h-8 text-blue-400" />
                            <span className="text-[12px] font-semibold uppercase tracking-[2px] font-[var(--font-barlow)] truncate px-1 w-full">Push News</span>
                        </Link>

                        <Link
                            href="/admin/events/new"
                            className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-2xl transition-all duration-300 border border-white/5 flex flex-col items-center justify-center gap-2 text-center overflow-hidden"
                        >
                            <Calendar className="w-8 h-8 text-green-400" />
                            <span className="text-[12px] font-semibold uppercase tracking-[2px] font-[var(--font-barlow)] truncate px-1 w-full">Set Event</span>
                        </Link>

                        <Link
                            href="/admin/announcements"
                            className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-2xl transition-all duration-300 border border-white/5 flex flex-col items-center justify-center gap-2 text-center overflow-hidden"
                        >
                            <Megaphone className="w-8 h-8 text-yellow-400" />
                            <span className="text-[12px] font-semibold uppercase tracking-[2px] font-[var(--font-barlow)] truncate px-1 w-full">Broadcast</span>
                        </Link>

                        <Link
                            href="/admin/finance"
                            className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-2xl transition-all duration-300 border border-white/5 flex flex-col items-center justify-center gap-2 text-center overflow-hidden"
                        >
                            <DollarSign className="w-8 h-8 text-red-400" />
                            <span className="text-[12px] font-semibold uppercase tracking-[2px] font-[var(--font-barlow)] truncate px-1 w-full">Ledger</span>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
