"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import {
    Plus,
    Trash2,
    Edit,
    Tag,
    Layers,
    MoveUp,
    MoveDown,
} from "lucide-react";

type Department = {
    id: string;
    name: string;
    slug: string;
    slug: string;
    description?: string;
    image_url?: string;
    sort_order: number;
};

type Subject = {
    id: string;
    name: string;
    department_id: string;
};

export default function DepartmentsManager() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    // Department Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newDept, setNewDept] = useState({ name: "", sort_order: 0, image_url: "", description: "" });
    const [uploading, setUploading] = useState(false);

    // Subject Modal State
    const [selectedDeptForSubjects, setSelectedDeptForSubjects] = useState<Department | null>(null);
    const [deptSubjects, setDeptSubjects] = useState<Subject[]>([]);
    const [newSubjectName, setNewSubjectName] = useState("");
    const [newSubjectLevel, setNewSubjectLevel] = useState("O Level");


    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const { data, error } = await supabase
                .from("departments")
                .select("*")
                .order("sort_order", { ascending: true });

            if (error) throw error;
            setDepartments(data || []);
        } catch (error: any) {
            console.error("Error fetching departments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `departments/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);

            setNewDept(prev => ({ ...prev, image_url: data.publicUrl }));
        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleAdd = async () => {
        if (!newDept.name) return;
        const slug = newDept.name.toLowerCase().replace(/\s+/g, '-');

        try {
            const { error } = await supabase
                .from("departments")
                .insert([{ ...newDept, slug }]);

            if (error) throw error;
            fetchDepartments();
            setIsAddModalOpen(false);
            fetchDepartments();
            setIsAddModalOpen(false);
            setNewDept({ name: "", sort_order: 0, image_url: "", description: "" });
        } catch (error: any) {
            alert("Error adding department: " + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will unassign all subjects in this department.")) return;

        try {
            const { error } = await supabase
                .from("departments")
                .delete()
                .eq("id", id);

            if (error) throw error;
            fetchDepartments();
        } catch (error: any) {
            alert("Error deleting: " + error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Departments</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage academic groupings and organization</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                >
                    <Plus className="w-5 h-5" />
                    New Department
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl" />)
                ) : departments.map((dept) => (
                    <div key={dept.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-red-50 text-red-600">
                                <Layers className="w-6 h-6" />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDelete(dept.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{dept.name}</h3>
                        <div className="flex items-center gap-2 text-slate-500 mb-4">
                            <Tag className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium uppercase tracking-widest">{dept.slug}</span>
                        </div>

                        {dept.image_url && (
                            <img src={dept.image_url} alt={dept.name} className="w-full h-24 object-cover rounded-lg mb-4 opacity-80" />
                        )}

                        <button
                            onClick={() => {
                                setSelectedDeptForSubjects(dept);
                                fetchSubjects(dept.id);
                            }}
                            className="w-full py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors mb-4"
                        >
                            Manage Subjects
                        </button>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>Order: {dept.sort_order}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Subject Manager Modal */}
            {selectedDeptForSubjects && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-4 sm:p-8 w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{selectedDeptForSubjects.name} Subjects</h2>
                                <p className="text-sm text-slate-500">Add or remove subjects</p>
                            </div>
                            <button onClick={() => setSelectedDeptForSubjects(null)} className="p-2 hover:bg-slate-100 rounded-full">
                                <Trash2 className="w-5 h-5 opacity-0" /> {/* Spacer */}
                                <span className="text-2xl font-bold text-slate-400">&times;</span>
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mb-6">
                            <input
                                type="text"
                                value={newSubjectName}
                                onChange={(e) => setNewSubjectName(e.target.value)}
                                placeholder="New Subject Name (e.g. Biology)"
                                className="flex-[2] px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-green-500/20 rounded-xl outline-none"
                            />
                            <select
                                value={newSubjectLevel}
                                onChange={(e) => setNewSubjectLevel(e.target.value)}
                                className="flex-1 px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-green-500/20 rounded-xl outline-none"
                            >
                                <option value="O Level">O Level</option>
                                <option value="A Level">A Level</option>
                            </select>
                            <button
                                onClick={handleAddSubject}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px]"
                            >
                                Add
                            </button>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                            {deptSubjects.map(sub => (
                                <div key={sub.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl group">
                                    <span className="font-bold text-slate-700">{sub.name}</span>
                                    <button
                                        onClick={() => handleDeleteSubject(sub.id)}
                                        className="text-slate-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {deptSubjects.length === 0 && (
                                <p className="text-slate-400 text-center italic py-4">No subjects added yet.</p>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                            <button onClick={() => setSelectedDeptForSubjects(null)} className="text-slate-500 font-bold uppercase text-xs tracking-widest hover:text-slate-900">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Simple Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Add Department</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={newDept.name}
                                    onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-red-500/20 rounded-xl outline-none"
                                    placeholder="e.g. Science"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Sort Order</label>
                                <input
                                    type="number"
                                    value={newDept.sort_order}
                                    onChange={(e) => setNewDept({ ...newDept, sort_order: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-red-500/20 rounded-xl outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Image (Optional)</label>
                                {newDept.image_url ? (
                                    <div className="relative w-full h-32 mb-2 rounded-xl overflow-hidden border">
                                        <img src={newDept.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setNewDept({ ...newDept, image_url: "" })}
                                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-red-500/20 rounded-xl outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                    />
                                )}
                                {uploading && <p className="text-xs text-slate-400 mt-1 animate-pulse">Uploading...</p>}
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAdd}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );

    async function fetchSubjects(deptId: string) {
        const { data } = await supabase.from("subjects").select("*").eq("department_id", deptId).order("name");
        setDeptSubjects(data || []);
    }

    async function handleAddSubject() {
        if (!newSubjectName || !selectedDeptForSubjects) return;
        const { error } = await supabase.from("subjects").insert([{
            name: newSubjectName,
            department_id: selectedDeptForSubjects.id,
            level: newSubjectLevel
        }]);

        if (!error) {
            setNewSubjectName("");
            fetchSubjects(selectedDeptForSubjects.id);
        } else {
            alert(error.message);
        }
    }

    async function handleDeleteSubject(id: string) {
        if (!confirm("Delete this subject?")) return;
        const { error } = await supabase.from("subjects").delete().eq("id", id);
        if (!error && selectedDeptForSubjects) {
            fetchSubjects(selectedDeptForSubjects.id);
        }
    }
}
