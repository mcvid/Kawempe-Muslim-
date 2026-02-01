"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { FileText, Upload, Trash2, Download, BookOpen, Filter, Plus, X } from "lucide-react";

type Level = "o-level" | "a-level" | "idaad" | "uce";

interface PastPaper {
    id: string;
    title: string;
    subject: string;
    level: Level;
    year: number;
    term: number | null;
    paper_type: string;
    file_url: string;
    file_size: string | null;
    downloads: number;
    created_at: string;
}

interface Subject {
    id: string;
    name: string;
    level: string;
}

const LEVELS: { id: Level; label: string }[] = [
    { id: "o-level", label: "O-Level" },
    { id: "a-level", label: "A-Level" },
    { id: "idaad", label: "Idaad" },
    { id: "uce", label: "UCE" },
];

const PAPER_TYPES = ["Exam", "Test", "Assignment", "Marking Scheme", "Notes"];

export default function PastPapersManager() {
    const [papers, setPapers] = useState<PastPaper[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<Level>("o-level");
    const [file, setFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        subject: "",
        subject_id: "",
        level: "o-level" as Level,
        year: new Date().getFullYear(),
        term: 1,
        paper_type: "Exam"
    });

    // Filter states
    const [filterSubject, setFilterSubject] = useState("");
    const [filterYear, setFilterYear] = useState<number | "all">("all");

    useEffect(() => {
        fetchPapers();
        fetchSubjects();
    }, []);

    const fetchPapers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("past_papers")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setPapers(data);
        if (error) console.error("Error fetching papers:", error);
        setLoading(false);
    };

    const fetchSubjects = async () => {
        const { data, error } = await supabase
            .from("subjects")
            .select("*")
            .order("sort_order", { ascending: true });

        if (data) setSubjects(data);
        if (error) console.error("Error fetching subjects:", error);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Please select a file to upload");
        if (!formData.title || !formData.subject) return alert("Please fill all required fields");

        setUploading(true);
        try {
            // 1. Upload file to storage
            const fileExt = file.name.split(".").pop();
            const fileName = `${formData.subject}_${formData.level}_${Date.now()}.${fileExt}`.replace(/\s+/g, "_");
            const { error: uploadError } = await supabase.storage
                .from("academic_resources")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get public URL
            const { data: urlData } = supabase.storage
                .from("academic_resources")
                .getPublicUrl(fileName);

            // 3. Insert record into database
            const { error: dbError } = await supabase
                .from("past_papers")
                .insert([{
                    title: formData.title,
                    subject: formData.subject,
                    subject_id: formData.subject_id || null,
                    level: formData.level,
                    year: formData.year,
                    term: formData.term,
                    paper_type: formData.paper_type,
                    file_url: urlData.publicUrl,
                    file_size: formatFileSize(file.size)
                }]);

            if (dbError) throw dbError;

            // Reset form
            setFormData({
                title: "",
                subject: "",
                subject_id: "",
                level: activeTab,
                year: new Date().getFullYear(),
                term: 1,
                paper_type: "Exam"
            });
            setFile(null);
            fetchPapers();
            alert("Past paper uploaded successfully!");
        } catch (error: any) {
            console.error("Error uploading paper:", error);
            alert("Failed to upload paper. " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, fileUrl: string) => {
        if (!window.confirm("Are you sure you want to delete this paper?")) return;

        try {
            const { error: dbError } = await supabase
                .from("past_papers")
                .delete()
                .eq("id", id);

            if (dbError) throw dbError;

            // Delete from storage
            const fileName = fileUrl.split("/").pop();
            if (fileName) {
                await supabase.storage.from("academic_resources").remove([fileName]);
            }

            setPapers(papers.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting paper:", error);
            alert("Error deleting paper");
        }
    };

    // Filter papers by active tab and filters
    const filteredPapers = papers.filter(paper => {
        const matchesLevel = paper.level === activeTab;
        const matchesSubject = !filterSubject || paper.subject.toLowerCase().includes(filterSubject.toLowerCase());
        const matchesYear = filterYear === "all" || paper.year === filterYear;
        return matchesLevel && matchesSubject && matchesYear;
    });

    // Get subjects for the active level
    const levelSubjects = subjects.filter(s => s.level === activeTab);

    // Get unique years for filter
    const availableYears = [...new Set(papers.filter(p => p.level === activeTab).map(p => p.year))].sort((a, b) => b - a);

    // Update form level when tab changes
    const handleTabChange = (level: Level) => {
        setActiveTab(level);
        setFormData({ ...formData, level, subject: "", subject_id: "" });
        setFilterSubject("");
        setFilterYear("all");
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight">
                    Past Papers <span className="text-[#006400]">Manager</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Upload and manage past exam papers and study materials.
                </p>
            </div>

            {/* Level Tabs - Scrollable on mobile */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-full md:w-fit overflow-x-auto">
                {LEVELS.map(level => (
                    <button
                        key={level.id}
                        onClick={() => handleTabChange(level.id)}
                        className={`px-3 md:px-5 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === level.id
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        {level.label}
                        <span className="ml-1.5 md:ml-2 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full bg-slate-200">
                            {papers.filter(p => p.level === level.id).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Upload Form */}
            <div className="bg-slate-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4 md:mb-6">
                    <Plus className="w-5 h-5" />
                    Upload New Paper
                </h3>

                <form onSubmit={handleUpload} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Title / Description
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. End of Term Mathematics Exam"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all"
                            required
                        />
                    </div>

                    {/* Subject and Year Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Subject
                            </label>
                            <select
                                value={formData.subject_id}
                                onChange={(e) => {
                                    const id = e.target.value;
                                    const name = id ? levelSubjects.find(s => s.id === id)?.name || "" : "";
                                    setFormData({ ...formData, subject_id: id, subject: name });
                                }}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all"
                                required
                            >
                                <option value="">Select Subject</option>
                                {levelSubjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Year
                            </label>
                            <input
                                type="number"
                                min="2000"
                                max="2100"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Term
                            </label>
                            <select
                                value={formData.term}
                                onChange={(e) => setFormData({ ...formData, term: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all"
                            >
                                <option value={1}>Term 1</option>
                                <option value={2}>Term 2</option>
                                <option value={3}>Term 3</option>
                            </select>
                        </div>
                    </div>

                    {/* Paper Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Paper Type
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {PAPER_TYPES.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, paper_type: type })}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.paper_type === type
                                        ? "bg-[#006400] text-white"
                                        : "bg-white border border-slate-200 text-slate-600 hover:border-[#006400]"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Document File (PDF/Word)
                        </label>
                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${file ? "border-[#006400] bg-green-50" : "border-slate-300 bg-white hover:border-slate-400"
                            } ${uploading ? "opacity-50 cursor-wait" : ""}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className={`w-8 h-8 mb-2 ${file ? "text-[#006400]" : "text-slate-400"}`} />
                                <p className="text-sm text-slate-600">
                                    {file ? file.name : "Click to upload or drag and drop"}
                                </p>
                                {file && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        {formatFileSize(file.size)}
                                    </p>
                                )}
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={uploading || !file}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#006400] text-white rounded-xl font-semibold text-sm hover:bg-[#005200] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Upload className="w-4 h-4" />
                        {uploading ? "Uploading..." : "Upload Paper"}
                    </button>
                </form>
            </div>

            {/* Papers List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">
                        {LEVELS.find(l => l.id === activeTab)?.label} Papers
                    </h2>

                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            value={filterYear === "all" ? "all" : filterYear}
                            onChange={(e) => setFilterYear(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                        >
                            <option value="all">All Years</option>
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-500">
                        Loading papers...
                    </div>
                ) : filteredPapers.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No papers found for this level.</p>
                        <p className="text-slate-400 text-sm">Upload your first paper above.</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-3">
                            {filteredPapers.map(paper => (
                                <div key={paper.id} className="bg-white rounded-xl p-4 border border-slate-100">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                                {paper.year}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            <a
                                                href={paper.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Download className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(paper.id, paper.file_url)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="font-medium text-slate-900 text-sm mb-1">{paper.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span>{paper.subject}</span>
                                        <span>•</span>
                                        <span>{paper.paper_type}</span>
                                        <span>•</span>
                                        <span>{paper.file_size || "-"}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 text-left">
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Title</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Year</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Size</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredPapers.map(paper => (
                                        <tr key={paper.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-medium text-slate-900">{paper.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-slate-600">{paper.subject}</td>
                                            <td className="px-4 py-4">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                                    {paper.year}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-slate-600">{paper.paper_type}</td>
                                            <td className="px-4 py-4 text-slate-500 text-sm">{paper.file_size || "-"}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-2">
                                                    <a
                                                        href={paper.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(paper.id, paper.file_url)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
