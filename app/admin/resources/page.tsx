"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import {
    Plus,
    Search,
    GraduationCap,
    BookOpen,
    FileText,
    Trash2,
    Edit,
    Settings,
    Check,
    X,
    Upload,
    ArrowRight
} from "lucide-react";

type Level = "o-level" | "a-level" | "idaad" | "uce";

interface Subject {
    id: string;
    name: string;
    level: string;
    code: string | null;
    icon: string | null;
    sort_order: number;
    is_active: boolean;
}

interface Resource {
    id: string;
    title: string;
    subject: string;
    level: string;
    resource_type: string;
    file_url: string;
    file_size: string | null;
    created_at: string;
}

const LEVELS: { id: Level; label: string }[] = [
    { id: "o-level", label: "O-Level" },
    { id: "a-level", label: "A-Level" },
    { id: "idaad", label: "Idaad" },
    { id: "uce", label: "UCE" },
];

const RESOURCE_TYPES = ["Notes", "Guide", "Textbook", "Video", "Assignment"];

export default function ResourcesManager() {
    const [activeTab, setActiveTab] = useState<"subjects" | "resources">("subjects");
    const [activeLevel, setActiveLevel] = useState<Level>("o-level");
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [showSubjectForm, setShowSubjectForm] = useState(false);
    const [newSubject, setNewSubject] = useState({ name: "", code: "", sort_order: 0 });

    const [showResourceForm, setShowResourceForm] = useState(false);
    const [newResource, setNewResource] = useState({ title: "", subject: "", subject_id: "", resource_type: "Notes" });
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        fetchInitialData();
    }, [activeLevel]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [subjRes, resRes] = await Promise.all([
                supabase.from("subjects").select("*").eq("level", activeLevel).order("sort_order"),
                supabase.from("resources").select("*").eq("level", activeLevel).order("created_at", { ascending: false })
            ]);

            if (subjRes.data) setSubjects(subjRes.data);
            if (resRes.data) setResources(resRes.data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data, error } = await supabase
                .from("subjects")
                .insert([{
                    name: newSubject.name,
                    code: newSubject.code,
                    level: activeLevel,
                    sort_order: newSubject.sort_order || subjects.length + 1
                }]);

            if (error) throw error;
            setNewSubject({ name: "", code: "", sort_order: 0 });
            setShowSubjectForm(false);
            fetchInitialData();
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleUploadResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Please select a file");
        if (!newResource.subject) return alert("Please select a subject");

        setSaving(true);
        try {
            // 1. Upload to storage
            const fileExt = file.name.split(".").pop();
            const fileName = `notes_${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from("academic_resources")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: urlData } = supabase.storage
                .from("academic_resources")
                .getPublicUrl(fileName);

            // 3. Save Record
            const { error: dbError } = await supabase
                .from("resources")
                .insert([{
                    title: newResource.title,
                    subject: newResource.subject,
                    subject_id: newResource.subject_id || null,
                    level: activeLevel,
                    resource_type: newResource.resource_type,
                    file_url: urlData.publicUrl,
                    file_size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
                }]);

            if (dbError) throw dbError;

            setNewResource({ title: "", subject: "", subject_id: "", resource_type: "Notes" });
            setFile(null);
            setShowResourceForm(false);
            fetchInitialData();
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const deleteItem = async (type: "subject" | "resource", id: string) => {
        if (!confirm("Are you sure? This cannot be undone.")) return;

        const table = type === "subject" ? "subjects" : "resources";
        const { error } = await supabase.from(table).delete().eq("id", id);

        if (error) alert("Error: " + error.message);
        else fetchInitialData();
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight">
                    Academics <span className="text-green-600">Resources</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">Manage subjects and study materials for students.</p>
            </div>

            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-full md:w-fit">
                <button
                    onClick={() => setActiveTab("subjects")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "subjects" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                    Subjects
                </button>
                <button
                    onClick={() => setActiveTab("resources")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "resources" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                    Notes & Guides
                </button>
            </div>

            {/* Level Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {LEVELS.map(level => (
                    <button
                        key={level.id}
                        onClick={() => setActiveLevel(level.id)}
                        className={`px-5 py-2.5 rounded-xl whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-all border ${activeLevel === level.id ? "bg-green-600 border-green-600 text-white" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}
                    >
                        {level.label}
                    </button>
                ))}
            </div>

            {/* Main Editor Area Area */}
            <div className="space-y-8">

                {activeTab === "subjects" ? (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Enrolled Subjects</h3>
                            <button
                                onClick={() => setShowSubjectForm(!showSubjectForm)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all active:scale-95"
                            >
                                {showSubjectForm ? <X size={14} /> : <Plus size={14} />}
                                {showSubjectForm ? "Close Form" : "Add Subject"}
                            </button>
                        </div>

                        {showSubjectForm && (
                            <form onSubmit={handleAddSubject} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Subject Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Mathematics"
                                        value={newSubject.name}
                                        onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Subject Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. MTH"
                                        value={newSubject.code}
                                        onChange={e => setNewSubject({ ...newSubject, code: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        disabled={saving}
                                        className="w-full py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : "Create Subject"}
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subjects.map(subject => (
                                <div key={subject.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-green-200 hover:bg-green-50/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-green-600 transition-colors">
                                            <GraduationCap size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{subject.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subject.code || "No Code"}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteItem("subject", subject.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900">Academic Resources</h3>
                            <button
                                onClick={() => setShowResourceForm(!showResourceForm)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-green-700 transition-all active:scale-95"
                            >
                                {showResourceForm ? <X size={14} /> : <Upload size={14} />}
                                {showResourceForm ? "Close Form" : "Upload Material"}
                            </button>
                        </div>

                        {showResourceForm && (
                            <form onSubmit={handleUploadResource} className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 space-y-6 animate-in fade-in slide-in-from-top-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Resource Title</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Unit 1: Algebra Fundamentals"
                                            value={newResource.title}
                                            onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Target Subject</label>
                                        <select
                                            required
                                            value={newResource.subject_id}
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                const name = id ? subjects.find(s => s.id === id)?.name || "" : "";
                                                setNewResource({ ...newResource, subject_id: id, subject: name });
                                            }}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all"
                                        >
                                            <option value="">Select a subject...</option>
                                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Material Type</label>
                                        <div className="flex flex-wrap gap-2">
                                            {RESOURCE_TYPES.map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setNewResource({ ...newResource, resource_type: type })}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${newResource.resource_type === type ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">File Document</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex-1 relative flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-white hover:border-green-400 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <FileText size={16} className={file ? "text-green-600" : "text-slate-400"} />
                                                    <span className="text-xs font-semibold text-slate-600 truncate max-w-[150px]">
                                                        {file ? file.name : "Choose PDF/Doc..."}
                                                    </span>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={e => setFile(e.target.files?.[0] || null)}
                                                />
                                            </label>
                                            <button
                                                disabled={saving || !file}
                                                className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50 transition-all"
                                            >
                                                {saving ? "Uploading..." : "Publish"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}

                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Material</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {resources.map(res => (
                                        <tr key={res.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-slate-50 rounded-lg text-slate-400 group-hover:text-green-600 transition-colors flex items-center justify-center">
                                                        <FileText size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 text-sm leading-none mb-1.5">{res.title}</p>
                                                        <p className="text-xs text-slate-500">{res.file_size || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold leading-none inline-block">{res.subject}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-medium text-slate-500">{res.resource_type}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => deleteItem("resource", res.id)}
                                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {resources.length === 0 && (
                                <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                                    <BookOpen size={48} strokeWidth={1} />
                                    <p className="text-sm font-medium">No resources uploaded for this level yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
