"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import {
    Search,
    Plus,
    Filter,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    User,
    GraduationCap,
    Calendar,
    School,
    ArrowUpRight,
    Download,
} from "lucide-react";

type Student = {
    id: string;
    name: string;
    class_name: string;
    gender: string;
    admission_number: string;
    parent_name: string;
    parent_contact: string;
    created_at: string;
};

export default function StudentsManager() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterClass, setFilterClass] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data, error } = await supabase
                .from("students")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setStudents(data || []);
        } catch (error: any) {
            console.error("Error fetching students:", error.message || error, error.details || "");
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.admission_number?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = !filterClass || student.class_name === filterClass;
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const classes = [...new Set(students.map((s) => s.class_name).filter(Boolean))];

    return (
        <div className="space-y-8 animate-fade-in font-[var(--font-montserrat)]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight">
                        Student <span className="text-[#006400]">Registry</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Manage student records, enrollment details, and academic profiles.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all font-[var(--font-barlow)]">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <Link
                        href="/admin/students/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#006400] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:shadow-xl hover:bg-green-800 transition-all font-[var(--font-barlow)]"
                    >
                        <Plus className="w-4 h-4" />
                        Register Student
                    </Link>
                </div>
            </div>

            {/* Stats Cards (Minimalist Flat Style) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Registered", value: students.length, color: "text-[#1E3A8A]", bg: "bg-blue-50" },
                    { label: "Male Students", value: students.filter(s => s.gender === 'Male').length, color: "text-[#006400]", bg: "bg-green-50" },
                    { label: "Female Students", value: students.filter(s => s.gender === 'Female').length, color: "text-[#C8102E]", bg: "bg-red-50" },
                    { label: "Active Classes", value: classes.length, color: "text-[#FFD700]", bg: "bg-yellow-50" },
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-2xl border border-slate-100 bg-white flex flex-col justify-between h-28`}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">{stat.label}</span>
                        <span className={`text-3xl font-black font-[var(--font-barlow)] ${stat.color}`}>{loading ? "..." : stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-[#F8F8F8] border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:bg-white focus:border-[#006400] transition-all font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="px-6 py-4 bg-[#F8F8F8] border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:bg-white focus:border-[#006400] font-bold text-[10px] uppercase tracking-widest font-[var(--font-barlow)]"
                    >
                        <option value="">All Classes</option>
                        {classes.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#F8F8F8] border-b border-slate-200">
                                <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[2px] font-[var(--font-barlow)]">
                                    Student Profile
                                </th>
                                <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[2px] font-[var(--font-barlow)]">
                                    Class Room
                                </th>
                                <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[2px] font-[var(--font-barlow)]">
                                    ID Number
                                </th>
                                <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[2px] font-[var(--font-barlow)]">
                                    Gender
                                </th>
                                <th className="text-right px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[2px] font-[var(--font-barlow)]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6">
                                            <div className="h-8 bg-slate-50 rounded-xl" />
                                        </td>
                                    </tr>
                                ))
                            ) : paginatedStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 rounded-full bg-slate-50">
                                                <User className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-400 font-medium">No students found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="group hover:bg-[#F8F8F8] transition-all duration-300"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-[#1E3A8A] font-bold font-[var(--font-barlow)] group-hover:scale-110 transition-transform shadow-sm">
                                                    {student.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 font-[var(--font-barlow)] uppercase tracking-wide text-lg">
                                                        {student.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-medium">{student.parent_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#006400] uppercase tracking-tight">{student.class_name}</span>
                                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Section A</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <code className="text-[11px] font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-lg uppercase">
                                                {student.admission_number || "PENDING"}
                                            </code>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${student.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {student.gender}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#006400] hover:border-[#006400] transition-all">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </button>
                                                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-500 transition-all">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-8 py-6 bg-[#F8F8F8]">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
