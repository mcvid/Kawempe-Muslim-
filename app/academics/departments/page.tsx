"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, Phone, GraduationCap, ChevronRight, Users, BookOpen } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { Poppins, Barlow_Condensed } from "next/font/google";
import Footer from "@/app/components/Footer";
import StaffCarousel from "@/app/components/academics/StaffCarousel";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
});

const barlow = Barlow_Condensed({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-barlow",
});

type Department = {
    id: string;
    name: string;
    slug: string;
};

type Subject = {
    id: string;
    name: string;
    department_id: string;
};

type Teacher = {
    id: string;
    name: string;
    title?: string;
    role: string;
    qualification?: string;
    email?: string;
    phone?: string;
    image_url?: string;
    department_id: string;
    primary_subject_id?: string;
    subject_ids?: string[];
    subject_roles?: Record<string, string>;
    hierarchy_order: number;
};

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
    const [expandedDept, setExpandedDept] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [deptsRes, subjectsRes, teachersRes, teacherSubjsRes] = await Promise.all([
                supabase.from("departments").select("*").order("sort_order"),
                supabase.from("subjects").select("*").order("name"),
                supabase.from("teachers").select("*").order("hierarchy_order"),
                supabase.from("teacher_subjects").select("teacher_id, subject_id, role")
            ]);

            if (deptsRes.error) throw deptsRes.error;
            if (subjectsRes.error) throw subjectsRes.error;
            if (teachersRes.error) throw teachersRes.error;
            if (teacherSubjsRes.error) throw teacherSubjsRes.error;

            const transformedTeachers = (teachersRes.data || []).map(t => {
                const links = (teacherSubjsRes.data || []).filter(ts => ts.teacher_id === t.id);
                const roles: Record<string, string> = {};
                links.forEach(l => roles[l.subject_id] = l.role || 'teacher');

                return {
                    ...t,
                    subject_ids: links.map(ts => ts.subject_id),
                    subject_roles: roles
                };
            }).filter(t => t.id !== 'e376b0f7-ab4f-453f-9a1c-fa409e206c10');

            setDepartments(deptsRes.data || []);
            setSubjects(subjectsRes.data || []);
            setTeachers(transformedTeachers);
        } catch (error) {
            console.error("Error fetching departments data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filtered lists
    const filteredTeachers = useMemo(() => {
        let result = teachers;
        if (selectedSubjectId) {
            // Find the selected subject to get its name
            const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
            if (selectedSubject) {
                // Filter teachers who teach this subject (by name or ID)
                result = result.filter(t => {
                    const teacherSubjectIds = t.subject_ids || (t.primary_subject_id ? [t.primary_subject_id] : []);
                    return teacherSubjectIds.some(sid => {
                        const s = subjects.find(sub => sub.id === sid);
                        return s?.name === selectedSubject.name;
                    });
                });
            }
        }
        if (searchQuery) {
            result = result.filter(t =>
                t.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return result;
    }, [teachers, selectedSubjectId, searchQuery, subjects]);

    // Grouping for HoD view (when no subject is selected)
    const hods = useMemo(() => {
        return teachers.filter(t => t.role.toLowerCase() === 'hod');
    }, [teachers]);

    const uniqueSubjectsByDepartment = useMemo(() => {
        const grouped: Record<string, Subject[]> = {};
        subjects.forEach(s => {
            if (!grouped[s.department_id]) grouped[s.department_id] = [];
            // Deduplicate by name
            if (!grouped[s.department_id].some(ext => ext.name === s.name)) {
                grouped[s.department_id].push(s);
            }
        });
        return grouped;
    }, [subjects]);

    const selectedSubject = useMemo(() =>
        subjects.find(s => s.id === selectedSubjectId),
        [subjects, selectedSubjectId]);

    const activeHoD = useMemo(() => {
        if (!selectedSubject) return null;
        // A teacher is the active HOD for this subject if their role for this subject is 'hod'
        return filteredTeachers.find(t => {
            if (!t.subject_roles) return false;
            // Check by ID or matching subject name
            const matchingSubjectIds = subjects
                .filter(s => s.name === selectedSubject.name)
                .map(s => s.id);
            return matchingSubjectIds.some(sid => t.subject_roles?.[sid] === 'hod');
        });
    }, [selectedSubject, filteredTeachers, subjects]);

    const otherTeachers = useMemo(() => {
        if (!selectedSubject) return [];
        const hodId = activeHoD?.id;
        return filteredTeachers.filter(t => t.id !== hodId);
    }, [selectedSubject, filteredTeachers, activeHoD]);

    if (loading) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin" />
        </div>;
    }

    return (
        <main className={`min-h-screen bg-white ${poppins.variable} ${barlow.variable} font-[var(--font-poppins)] pt-24`}>
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-96px)]">

                {/* Desktop Sidebar (Hidden on Mobile) */}
                <aside className="hidden lg:flex w-[320px] bg-white border-r border-slate-100 flex-col h-[calc(100vh-96px)] sticky top-24">
                    <div className="p-8 border-b border-slate-100 bg-white z-10">
                        <button
                            onClick={() => { setSelectedSubjectId(null); setExpandedDept(null); }}
                            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 ${!selectedSubjectId
                                ? "bg-red-600 text-white"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            <Users size={18} />
                            <span className="text-sm font-bold uppercase tracking-widest">All Staff</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-2 no-scrollbar">
                        {departments.map(dept => {
                            const isExpanded = expandedDept === dept.id;
                            const selectedSubjObj = subjects.find(s => s.id === selectedSubjectId);
                            const isActive = selectedSubjObj && uniqueSubjectsByDepartment[dept.id]?.some(s => s.name === selectedSubjObj.name);

                            return (
                                <div key={dept.id} className="border-b border-slate-50 last:border-0 pb-2">
                                    <button
                                        onClick={() => setExpandedDept(isExpanded ? null : dept.id)}
                                        className={`w-full flex items-center justify-between text-left py-4 group transition-colors duration-300`}
                                    >
                                        <h4 className={`text-[20px] leading-tight font-medium ${isActive || isExpanded ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"}`}>
                                            {dept.name}
                                        </h4>
                                        <ChevronRight
                                            size={20}
                                            className={`transition-transform duration-300 ${isExpanded ? "rotate-90 text-red-600" : "text-slate-300"}`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-4 pb-6 flex flex-col gap-1 border-l-2 border-slate-100 ml-2">
                                                    {uniqueSubjectsByDepartment[dept.id]?.map(subject => (
                                                        <button
                                                            key={subject.id}
                                                            onClick={() => setSelectedSubjectId(subject.id)}
                                                            className={`relative pl-6 py-2 text-left text-sm transition-all duration-300 ${subjects.find(s => s.id === selectedSubjectId)?.name === subject.name
                                                                    ? "text-red-600 font-bold"
                                                                    : "text-slate-500 hover:text-slate-900 font-medium"
                                                                }`}
                                                        >
                                                            {subjects.find(s => s.id === selectedSubjectId)?.name === subject.name && (
                                                                <motion.div
                                                                    layoutId="active-indicator"
                                                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-red-600"
                                                                />
                                                            )}
                                                            {subject.name}
                                                        </button>
                                                    ))}
                                                    {(!uniqueSubjectsByDepartment[dept.id] || uniqueSubjectsByDepartment[dept.id].length === 0) && (
                                                        <div className="pl-6 py-2 text-xs text-slate-300 italic">No subjects listed</div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 bg-white flex flex-col">
                    {/* Mobile Navigation Header (Sticky) */}
                    <div className="lg:hidden sticky top-20 z-50 bg-white border-b border-slate-100 flex flex-col">
                        {/* Departments Horizontal Scroll */}
                        <div className="flex overflow-x-auto no-scrollbar py-3 px-4 gap-2 border-b border-slate-50/50">
                            <button
                                onClick={() => { setSelectedSubjectId(null); setExpandedDept(null); }}
                                className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${!selectedSubjectId
                                    ? "bg-red-600 text-white shadow-lg shadow-red-100"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                    }`}
                            >
                                All Staff
                            </button>
                            {departments.map(dept => {
                                const isExpanded = expandedDept === dept.id;
                                const selectedSubjObj = subjects.find(s => s.id === selectedSubjectId);
                                const isActive = (selectedSubjObj && uniqueSubjectsByDepartment[dept.id]?.some(s => s.name === selectedSubjObj.name)) || isExpanded;

                                return (
                                    <button
                                        key={dept.id}
                                        onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
                                        className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isActive
                                            ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                            : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                            }`}
                                    >
                                        {dept.name}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Secondary Subjects Scroll (Only if Dept Expanded) */}
                        <AnimatePresence>
                            {expandedDept && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="bg-slate-50 border-b border-slate-100"
                                >
                                    <div className="flex overflow-x-auto no-scrollbar py-3 px-4 gap-4">
                                        {uniqueSubjectsByDepartment[expandedDept]?.map(subject => (
                                            <button
                                                key={subject.id}
                                                onClick={() => setSelectedSubjectId(subject.id)}
                                                className={`whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-colors ${subjects.find(s => s.id === selectedSubjectId)?.name === subject.name
                                                        ? "text-red-600"
                                                        : "text-slate-400 hover:text-slate-500"
                                                    }`}
                                            >
                                                {subject.name}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Mobile Sticky Search Bar */}
                        <div className="px-4 py-3 bg-white/80 backdrop-blur-md">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search teacher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-2 border-transparent focus:border-red-100 focus:bg-white rounded-full outline-none transition-all font-medium text-sm text-slate-900 placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-12 lg:p-16 flex-1">
                        {/* Desktop Search Bar (Hidden on Mobile) */}
                        <div className="hidden lg:block max-w-4xl mx-auto mb-16">
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Browse teachers name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-[30px] outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="max-w-6xl mx-auto">
                            <AnimatePresence mode="wait">
                                {!selectedSubjectId ? (
                                    <motion.div
                                        key="all-hods"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="text-center mb-12">
                                            <h1 className={`${barlow.className} text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4`}>
                                                Academic Heads
                                            </h1>
                                            <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            <div className="block md:hidden col-span-full">
                                                <StaffCarousel
                                                    items={hods.map((teacher) => {
                                                        const primarySubj = subjects.find(s => s.id === teacher.primary_subject_id)?.name;
                                                        const displayName = primarySubj || "";
                                                        return <TeacherCard key={teacher.id} teacher={teacher} showRole subjectName={displayName} availableSubjects={subjects} />;
                                                    })}
                                                />
                                            </div>
                                            {hods.map((teacher) => {
                                                const primarySubj = subjects.find(s => s.id === teacher.primary_subject_id)?.name;
                                                const displayName = primarySubj || "";
                                                return (
                                                    <div key={teacher.id} className="hidden md:block">
                                                        <TeacherCard teacher={teacher} showRole subjectName={displayName} availableSubjects={subjects} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={selectedSubjectId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-20"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mb-2">
                                            <h1 className={`${barlow.className} text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none`}>
                                                {selectedSubject?.name}
                                            </h1>
                                            <span className="text-xs font-black uppercase tracking-[0.4em] text-red-600 bg-red-50 px-4 py-2 rounded-full">Hierarchy</span>
                                        </div>

                                        {activeHoD && (
                                            <div className="flex flex-col items-center">
                                                <div className="mb-10 text-center">
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Head of Subject</h3>
                                                    <TeacherCard teacher={activeHoD} isLarge showRole subjectName={selectedSubject?.name} />
                                                </div>
                                                <div className="w-0.5 h-16 bg-slate-100 flex-shrink-0" />
                                            </div>
                                        )}

                                        <div className="space-y-12">
                                            <div className="text-center">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Department Staff</h3>
                                                {otherTeachers.length === 0 ? (
                                                    <p className="text-slate-400 italic">No other staff listed in this subject yet.</p>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                                                        <div className="block md:hidden col-span-full">
                                                            <StaffCarousel
                                                                items={otherTeachers.map((teacher) => (
                                                                    <TeacherCard key={teacher.id} teacher={teacher} availableSubjects={subjects} />
                                                                ))}
                                                            />
                                                        </div>
                                                        {otherTeachers.map((teacher) => (
                                                            <div key={teacher.id} className="hidden md:block">
                                                                <TeacherCard teacher={teacher} availableSubjects={subjects} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

function TeacherCard({ teacher, isLarge = false, showRole = false, subjectName, availableSubjects }: { teacher: Teacher, isLarge?: boolean, showRole?: boolean, subjectName?: string, availableSubjects?: Subject[] }) {
    const teacherSubjNames = useMemo(() => {
        if (!availableSubjects) return [];
        const ids = teacher.subject_ids || (teacher.primary_subject_id ? [teacher.primary_subject_id] : []);
        const names = ids.map(id => availableSubjects.find(s => s.id === id)?.name).filter(Boolean) as string[];
        return [...new Set(names)]; // Deduplicate
    }, [teacher, availableSubjects]);

    const displaySubjects = subjectName || teacherSubjNames.join(" & ") || "Staff";
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`bg-white rounded-[32px] overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 ${isLarge ? "max-w-md mx-auto" : "w-full"
                }`}
        >
            <div className={`relative ${isLarge ? "h-[350px]" : "h-[280px]"} bg-slate-100`}>
                {teacher.image_url ? (
                    <Image
                        src={teacher.image_url}
                        alt={teacher.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Users size={isLarge ? 64 : 48} />
                    </div>
                )}

                {/* Overlay for large view */}
                {isLarge && (
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </div>

            <div className={`p-6 ${showRole ? 'bg-red-50' : 'bg-white'}`}>
                <div className="mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-1 block">
                        {showRole ? (displaySubjects ? `HOD ${displaySubjects}` : "Head of Department") : displaySubjects}
                    </span>
                    <h3 className={`${barlow.className} text-2xl font-black text-slate-900 uppercase tracking-tight leading-none`}>
                        {teacher.title} {teacher.name}
                    </h3>
                </div>

                <div className="space-y-3">
                    {teacher.qualification && (
                        <div className="flex items-center gap-2 text-slate-600">
                            <GraduationCap size={14} className="text-slate-400" />
                            <span className="text-[11px] font-bold uppercase tracking-tight truncate">{teacher.qualification}</span>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
                        {teacher.email && (
                            <a href={`mailto:${teacher.email}`} className="flex items-center gap-1.5 text-slate-400 hover:text-red-600 transition-colors">
                                <Mail size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none pt-0.5">Contact</span>
                            </a>
                        )}
                        {teacher.phone && (
                            <a href={`tel:${teacher.phone}`} className="flex items-center gap-1.5 text-slate-400 hover:text-red-600 transition-colors">
                                <Phone size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none pt-0.5">Call</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
