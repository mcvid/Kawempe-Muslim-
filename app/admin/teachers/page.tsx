"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import {
    Search,
    Plus,
    GraduationCap,
    ChevronLeft,
    ChevronRight,
    Eye,
    Trash2,
    Edit,
    Mail,
    Phone,
    X,
} from "lucide-react";

// Helper type for filtering subject selection
type Subject = {
    id: string;
    name: string;
    department_id: string;
};

type Teacher = {
    id: string;
    name: string;
    email: string;
    phone: string;
    department_id: string;
    primary_subject_id: string;
    subject_ids?: string[];
    subject_roles?: Record<string, string>; // { subject_id: role }
    role: string;
    qualification: string;
    status: string;
    image_url: string;
    hierarchy_order: number;
    created_at: string;
};

export default function TeachersManager() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDept, setFilterDept] = useState("");

    // Add Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [availableDepts, setAvailableDepts] = useState<{ id: string, name: string }[]>([]);
    const [availableSubjects, setAvailableSubjects] = useState<{ id: string, name: string, department_id: string }[]>([]);
    const [newTeacher, setNewTeacher] = useState({
        name: "",
        email: "",
        phone: "",
        department_id: "",
        primary_subject_id: "",
        role: "teacher",
        qualification: "",
        status: "active",
        image_url: "",
        hierarchy_order: 10
    });
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
    const [subjectRoles, setSubjectRoles] = useState<Record<string, string>>({}); // { subject_id: role }
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [uploading, setUploading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchMetadata = async () => {
        const { data: depts } = await supabase.from("departments").select("id, name").order("name");
        const { data: subjs } = await supabase.from("subjects").select("id, name, department_id").order("name");
        setAvailableDepts(depts || []);
        setAvailableSubjects(subjs || []);
    };

    const resetForm = () => {
        setNewTeacher({
            name: "",
            email: "",
            phone: "",
            department_id: "",
            primary_subject_id: "",
            role: "teacher",
            qualification: "",
            status: "active",
            image_url: "",
            hierarchy_order: 10
        });
        setSelectedSubjectIds([]);
        setSubjectRoles({});
        setEditingTeacher(null);
        setIsAddModalOpen(false);
    };

    const handleSaveTeacher = async () => {
        if (!newTeacher.name || !newTeacher.email) {
            alert("Name and Email are required");
            return;
        }

        let teacherId = editingTeacher?.id;
        let error = null;

        const teacherToSave = { ...newTeacher };
        // Clean up any extra fields that shouldn't be in the DB
        // @ts-ignore
        delete teacherToSave.subject_ids;
        // @ts-ignore
        delete teacherToSave.subject_roles;

        if (editingTeacher) {
            // Update
            const { error: updateError } = await supabase
                .from("teachers")
                .update(teacherToSave)
                .eq("id", teacherId);
            error = updateError;
        } else {
            // Insert
            const { data, error: insertError } = await supabase
                .from("teachers")
                .insert([teacherToSave])
                .select()
                .single();
            error = insertError;
            teacherId = data?.id;
        }

        if (error) {
            alert(error.message);
        } else if (teacherId) {
            // Sync Subjects
            // Delete old ones first
            await supabase.from("teacher_subjects").delete().eq("teacher_id", teacherId);

            if (selectedSubjectIds.length > 0) {
                const subjectEntries = selectedSubjectIds.map(sid => ({
                    teacher_id: teacherId,
                    subject_id: sid,
                    role: (newTeacher.role === 'hod' && sid === newTeacher.primary_subject_id) ? 'hod' : 'teacher'
                }));
                const { error: subjectError } = await supabase
                    .from("teacher_subjects")
                    .insert(subjectEntries);
                if (subjectError) alert("Teacher saved but subjects failed: " + subjectError.message);
            }

            resetForm();
            fetchTeachers();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `teachers/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);

            setNewTeacher(prev => ({ ...prev, image_url: data.publicUrl }));
        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
        fetchMetadata();
    }, []);

    // Filter subjects when department changes
    const filteredSubjects = availableSubjects.filter(
        s => !newTeacher.department_id || s.department_id === newTeacher.department_id
    );

    // Deduplicate subjects by name for the dropdown
    const uniqueFilteredSubjects = filteredSubjects.filter((subject, index, self) =>
        index === self.findIndex((s) => s.name === subject.name)
    );

    const fetchTeachers = async () => {
        try {
            const { data: tch, error: tchErr } = await supabase
                .from("teachers")
                .select("*")
                .order("name", { ascending: true });

            if (tchErr) throw tchErr;

            const { data: tSubjs } = await supabase.from("teacher_subjects").select("teacher_id, subject_id, role");

            const transformed = (tch || []).map(t => {
                const subs = (tSubjs || []).filter(ts => ts.teacher_id === t.id);
                const roles: Record<string, string> = {};
                subs.forEach(s => roles[s.subject_id] = s.role || 'teacher');

                return {
                    ...t,
                    subject_ids: subs.map(ts => ts.subject_id),
                    subject_roles: roles
                };
            });

            setTeachers(transformed);
        } catch (error: any) {
            console.error("Error fetching teachers:", error.message || error, error.details || "");
        } finally {
            setLoading(false);
        }
    };

    const filteredTeachers = teachers.filter((teacher) => {
        const subject = availableSubjects.find(s => s.id === teacher.primary_subject_id);
        const matchesSearch =
            teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subject?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.role?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = !filterDept || teacher.department_id === filterDept;
        return matchesSearch && matchesDept;
    });

    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
    const paginatedTeachers = filteredTeachers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalDepartmentsCount = availableDepts.length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Teachers</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Manage teaching staff and assignments
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Teacher
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                            <GraduationCap className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{teachers.length}</p>
                            <p className="text-xs text-slate-500">Total Teachers</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{totalDepartmentsCount}</p>
                            <p className="text-xs text-slate-500">Departments</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-100">
                            <GraduationCap className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">
                                {teachers.filter((t) => t.status === "active").length}
                            </p>
                            <p className="text-xs text-slate-500">Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    />
                </div>
                <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                >
                    <option value="">All Departments</option>
                    {availableDepts.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Teacher
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Subjects
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                                            Loading...
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedTeachers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No teachers found
                                    </td>
                                </tr>
                            ) : (
                                paginatedTeachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-medium">
                                                    {teacher.name?.charAt(0) || "T"}
                                                </div>
                                                <span className="font-medium text-slate-900">{teacher.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Mail className="w-4 h-4 text-slate-400" />
                                                    {teacher.email || "-"}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Phone className="w-4 h-4 text-slate-400" />
                                                    {teacher.phone || "-"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(teacher.subject_ids || [])
                                                    .map(sid => availableSubjects.find(s => s.id === sid)?.name)
                                                    .filter(Boolean)
                                                    .map((name, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">
                                                            {name}
                                                        </span>
                                                    ))
                                                }
                                                {(!teacher.subject_ids || teacher.subject_ids.length === 0) && (
                                                    <span className="text-slate-400 text-[10px] italic">No subjects</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-1 text-xs font-medium rounded-full ${teacher.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {teacher.status || "Active"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingTeacher(teacher);
                                                        setNewTeacher({ ...teacher });
                                                        setSelectedSubjectIds(teacher.subject_ids || []);
                                                        setSubjectRoles(teacher.subject_roles || {});
                                                        setIsAddModalOpen(true);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 className="w-4 h-4" />
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
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                        <p className="text-sm text-slate-500">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(currentPage * itemsPerPage, filteredTeachers.length)} of{" "}
                            {filteredTeachers.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium text-slate-600">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Add Teacher Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-4 sm:p-8 w-full max-w-2xl shadow-2xl h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h2>
                            <button onClick={resetForm} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                                <X className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-sm uppercase text-slate-400">Basic Info</h3>
                                <input
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border focus:border-green-500"
                                    placeholder="Full Name"
                                    value={newTeacher.name}
                                    onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                />
                                <input
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border focus:border-green-500"
                                    placeholder="Email Address"
                                    value={newTeacher.email}
                                    onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                />
                                <input
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border focus:border-green-500"
                                    placeholder="Phone Number"
                                    value={newTeacher.phone}
                                    onChange={e => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                                />
                                {newTeacher.image_url ? (
                                    <div className="relative w-full h-32 mb-2 rounded-xl overflow-hidden border">
                                        <img src={newTeacher.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setNewTeacher({ ...newTeacher, image_url: "" })}
                                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Profile Image (Optional)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-green-500/20 rounded-xl outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                        />
                                        {uploading && <p className="text-xs text-slate-400 mt-1 animate-pulse">Uploading...</p>}
                                    </div>
                                )}
                            </div>

                            {/* Academic Role */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-sm uppercase text-slate-400">Academic Role</h3>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border focus:border-green-500"
                                    value={newTeacher.department_id}
                                    onChange={e => setNewTeacher({ ...newTeacher, department_id: e.target.value })}
                                >
                                    <option value="">Select Department</option>
                                    {availableDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Teaches Subjects</label>
                                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border max-h-40 overflow-y-auto">
                                        {uniqueFilteredSubjects.map(s => (
                                            <label key={s.id} className={`flex items-start gap-2 cursor-pointer group p-2 rounded-lg border transition-all ${newTeacher.primary_subject_id === s.id
                                                ? "bg-green-50 border-green-200"
                                                : "hover:bg-slate-100 border-transparent"
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-green-600 focus:ring-green-500 shrink-0"
                                                    checked={selectedSubjectIds.includes(s.id)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setSelectedSubjectIds([...selectedSubjectIds, s.id]);
                                                            // Set first one as primary if none selected
                                                            if (!newTeacher.primary_subject_id) {
                                                                setNewTeacher({ ...newTeacher, primary_subject_id: s.id });
                                                            }
                                                        } else {
                                                            setSelectedSubjectIds(selectedSubjectIds.filter(id => id !== s.id));
                                                            if (newTeacher.primary_subject_id === s.id) {
                                                                setNewTeacher({ ...newTeacher, primary_subject_id: selectedSubjectIds.find(id => id !== s.id) || "" });
                                                            }
                                                        }
                                                    }}
                                                />
                                                <div className="flex flex-col">
                                                    <span className={`text-sm leading-tight transition-colors ${selectedSubjectIds.includes(s.id) ? "text-slate-900 font-medium" : "text-slate-600"}`}>
                                                        {s.name}
                                                    </span>
                                                    {newTeacher.primary_subject_id === s.id && (
                                                        <span className="mt-1 w-fit text-[9px] font-bold uppercase text-green-600 bg-white px-1.5 py-0.5 rounded border border-green-200 shadow-sm">
                                                            Primary
                                                        </span>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {uniqueFilteredSubjects.length === 0 && (
                                        <p className="text-[10px] text-slate-400 italic">Select a department first to see subjects.</p>
                                    )}
                                </div>

                                {/* Primary Subject Selector */}
                                {selectedSubjectIds.length > 0 && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-green-600">
                                            Primary / Leadership Subject
                                        </label>
                                        <div className="text-[10px] text-slate-400 mb-1">
                                            This determines which subject they lead if they are an HOD.
                                        </div>
                                        <select
                                            className="w-full px-4 py-3 bg-green-50 rounded-xl outline-none border border-green-200 focus:border-green-500 text-green-800 font-medium"
                                            value={newTeacher.primary_subject_id}
                                            onChange={e => setNewTeacher({ ...newTeacher, primary_subject_id: e.target.value })}
                                        >
                                            {uniqueFilteredSubjects
                                                .filter(s => selectedSubjectIds.includes(s.id))
                                                .map(s => (
                                                    <option key={s.id} value={s.id}>
                                                        {s.name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                )}

                                <select
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border focus:border-green-500"
                                    value={newTeacher.role}
                                    onChange={e => setNewTeacher({ ...newTeacher, role: e.target.value })}
                                >
                                    <option value="teacher">Teacher</option>
                                    <option value="hod">Head of Department</option>
                                    <option value="senior_teacher">Senior Teacher</option>
                                    <option value="admin">Administrator</option>
                                </select>

                                <input
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border focus:border-green-500"
                                    placeholder="Qualification (e.g. BSc. Educ)"
                                    value={newTeacher.qualification}
                                    onChange={e => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={resetForm}
                                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold uppercase tracking-widest text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveTeacher}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-green-600/20 hover:bg-green-700"
                            >
                                {editingTeacher ? 'Update Teacher' : 'Save Teacher'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
