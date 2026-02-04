"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Plus, Trash2, Save, X, Layers, Calendar, Clock, BookOpen, Users } from "lucide-react";

type ClassItem = { id: string; name: string };
type StreamItem = { id: string; name: string; class_id: string };
type SubjectItem = { id: string; name: string; level: string };
type TeacherItem = { id: string; name: string; primary_subject_id?: string; subject_ids?: string[] };

type TimetableEntry = {
    id?: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    subject_id?: string;
    teacher_id?: string;
    custom_label?: string; // For Break/Lunch
    component_label?: string; // e.g. Paper 1, Paper 2, Practical
    is_break?: boolean; // UI helper
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const defaultTimeSlots = [
    { start: "08:00", end: "09:00" },
    { start: "09:00", end: "10:00" },
    { start: "10:00", end: "10:30", is_break: true, label: "Break" },
    { start: "10:30", end: "11:30" },
    { start: "11:30", end: "12:30" },
    { start: "12:30", end: "13:30" },
    { start: "13:30", end: "14:30", is_break: true, label: "Lunch" },
    { start: "14:30", end: "15:30" },
    { start: "15:30", end: "16:30" },
];

export default function TimetableEditor() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [streams, setStreams] = useState<StreamItem[]>([]);
    const [subjects, setSubjects] = useState<SubjectItem[]>([]);
    const [teachers, setTeachers] = useState<TeacherItem[]>([]);

    const [selectedClassId, setSelectedClassId] = useState("");
    const [selectedStreamId, setSelectedStreamId] = useState("");
    const [timetableId, setTimetableId] = useState<string | null>(null);
    const [entries, setEntries] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(false);

    // Editor State
    const [editingCell, setEditingCell] = useState<{ day: string, start: string } | null>(null);
    const [isExtraSession, setIsExtraSession] = useState(false);
    const [editForm, setEditForm] = useState<{ subject_id: string, teacher_id: string, label: string, start_time: string, end_time: string, component_label: string }>({
        subject_id: "",
        teacher_id: "",
        label: "",
        start_time: "",
        end_time: "",
        component_label: ""
    });

    // Stream Manager Modal
    const [isStreamModalOpen, setIsStreamModalOpen] = useState(false);
    const [newStreamName, setNewStreamName] = useState("");

    useEffect(() => {
        fetchMetadata();
    }, []);

    useEffect(() => {
        if (selectedClassId) fetchStreams(selectedClassId);
    }, [selectedClassId]);

    useEffect(() => {
        if (selectedStreamId) fetchTimetable(selectedStreamId);
    }, [selectedStreamId]);

    const fetchMetadata = async () => {
        const { data: cls } = await supabase.from("academic_classes").select("*").order("sort_order");
        const { data: tch } = await supabase.from("teachers").select("id, name, primary_subject_id").order("name");
        const { data: tSubjs } = await supabase.from("teacher_subjects").select("teacher_id, subject_id");

        const teachersWithSubjects = (tch || []).map(t => ({
            ...t,
            subject_ids: (tSubjs || [])
                .filter(ts => ts.teacher_id === t.id)
                .map(ts => ts.subject_id)
        }));

        setClasses(cls || []);
        setTeachers(teachersWithSubjects);
    };

    const fetchSubjectsForLevel = async (level: string) => {
        const { data } = await supabase.from("subjects").select("*").eq("level", level).order("name");
        setSubjects(data || []);
    };

    const fetchStreams = async (classId: string) => {
        const selectedClass = classes.find(c => c.id === classId);
        // @ts-ignore
        if (selectedClass?.level) fetchSubjectsForLevel(selectedClass.level);

        const { data } = await supabase.from("class_streams").select("*").eq("class_id", classId);
        setStreams(data || []);
        setSelectedStreamId("");
    };

    const fetchTimetable = async (streamId: string) => {
        setLoading(true);
        let { data: tt } = await supabase
            .from("timetables")
            .select("id")
            .eq("stream_id", streamId)
            .eq("is_active", true)
            .single();

        if (!tt) {
            const { data: newTT } = await supabase
                .from("timetables")
                .insert([{ stream_id: streamId, academic_year: "2026", term: "Term 1" }])
                .select()
                .single();
            tt = newTT;
        }

        if (tt) {
            setTimetableId(tt.id);
            const { data: fetchedEntries } = await supabase
                .from("timetable_entries")
                .select("*")
                .eq("timetable_id", tt.id)
                .order("start_time");
            setEntries(fetchedEntries || []);
        }
        setLoading(false);
    };

    const handleCellClick = (day: string, slot?: { start: string, end: string, is_break?: boolean, label?: string }) => {
        setEditingCell({ day, start: slot?.start || "08:00" });
        setIsExtraSession(!slot);

        const existing = entries.find(e =>
            e.day_of_week === day &&
            (slot ? e.start_time.startsWith(slot.start) : false)
        );

        if (existing) {
            setEditForm({
                subject_id: existing.subject_id || "",
                teacher_id: existing.teacher_id || "",
                label: existing.custom_label || "",
                start_time: existing.start_time.slice(0, 5),
                end_time: existing.end_time.slice(0, 5),
                component_label: existing.component_label || ""
            });
        } else {
            setEditForm({
                subject_id: "",
                teacher_id: "",
                label: slot?.is_break ? slot.label || "Break" : "",
                start_time: slot?.start || "08:00",
                end_time: slot?.end || "09:00",
                component_label: ""
            });
        }
    };

    const saveEntry = async () => {
        if (!timetableId || !editingCell) return;

        const entryData = {
            timetable_id: timetableId,
            day_of_week: editingCell.day,
            start_time: editForm.start_time,
            end_time: editForm.end_time,
            subject_id: editForm.subject_id || null,
            teacher_id: editForm.teacher_id || null,
            custom_label: editForm.label || null,
            component_label: editForm.component_label || null
        };

        const existing = entries.find(e => e.day_of_week === editingCell.day && e.start_time.startsWith(editingCell.start));

        if (existing) {
            await supabase.from("timetable_entries").update(entryData).eq("id", existing.id);
        } else {
            await supabase.from("timetable_entries").insert([entryData]);
        }

        setEditingCell(null);
        fetchTimetable(selectedStreamId);
    };

    const deleteEntry = async () => {
        if (!editingCell) return;
        const existing = entries.find(e => e.day_of_week === editingCell.day && e.start_time.startsWith(editingCell.start));
        if (existing) {
            await supabase.from("timetable_entries").delete().eq("id", existing.id);
            fetchTimetable(selectedStreamId);
        }
        setEditingCell(null);
    };

    const getCellContent = (day: string, slotStart: string) => {
        const entry = entries.find(e => e.day_of_week === day && e.start_time.startsWith(slotStart));

        const overlapping = entries.find(e => {
            if (e.day_of_week !== day) return false;
            const start = e.start_time.slice(0, 5);
            const end = e.end_time.slice(0, 5);
            return start < slotStart && end > slotStart;
        });

        if (!entry && !overlapping) return null;

        if (overlapping && !entry) {
            return (
                <div className="text-[10px] text-slate-300 font-medium italic text-center py-2">
                    Cont...
                </div>
            );
        }

        if (entry) {
            const subject = subjects.find(s => s.id === entry.subject_id);
            const teacher = teachers.find(t => t.id === entry.teacher_id);
            return (
                <div className="space-y-1 h-full flex flex-col justify-center p-1 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-[10px] font-bold text-slate-900 truncate">
                        {entry.custom_label || subject?.name || "Untitled"}
                        {entry.component_label && (
                            <span className="ml-1 px-1 bg-slate-100 text-[8px] rounded text-slate-500">
                                {entry.component_label}
                            </span>
                        )}
                    </div>
                    {!entry.custom_label && teacher && (
                        <div className="text-[9px] text-slate-400 font-medium truncate">
                            {teacher.name}
                        </div>
                    )}
                    <div className="text-[9px] text-blue-500 font-bold">
                        {entry.start_time.slice(0, 5)}-{entry.end_time.slice(0, 5)}
                    </div>
                </div>
            );
        }
    };

    async function handleAddStream() {
        if (!newStreamName || !selectedClassId) return;
        const { error } = await supabase.from("class_streams").insert([{ name: newStreamName, class_id: selectedClassId }]);
        if (!error) {
            setNewStreamName("");
            fetchStreams(selectedClassId);
        } else {
            alert(error.message);
        }
    }

    async function handleDeleteStream(id: string) {
        if (!confirm("Delete this stream? This will delete all associated timetables.")) return;
        const { error } = await supabase.from("class_streams").delete().eq("id", id);
        if (!error) {
            fetchStreams(selectedClassId);
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Timetable Editor</h1>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl border border-slate-200">
                <select
                    className="p-2 border rounded-lg"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                >
                    <option value="">Select Class</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <select
                    className="p-2 border rounded-lg"
                    value={selectedStreamId}
                    onChange={(e) => setSelectedStreamId(e.target.value)}
                    disabled={!selectedClassId}
                >
                    <option value="">Select Stream</option>
                    {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                {selectedStreamId && !loading && (
                    <div className="ml-auto text-sm text-green-600 font-bold flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live Editor Active
                    </div>
                )}

                {selectedClassId && (
                    <div className="ml-auto flex items-center gap-2">
                        <button
                            onClick={() => handleCellClick("Monday")}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-xl border border-blue-100 transition-all font-bold text-xs uppercase tracking-wider"
                            title="Add Prep or Extra Session"
                        >
                            <Calendar size={18} />
                            Add Extra Session
                        </button>

                        <button
                            onClick={() => setIsStreamModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 hover:text-green-600 hover:bg-green-100 rounded-xl border border-slate-200 transition-all font-bold text-xs uppercase tracking-wider"
                            title="Manage Streams"
                        >
                            <Layers size={18} />
                            Manage Streams
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            {selectedStreamId && (
                <div className="space-y-8">
                    {/* Extra Sessions List (Before Grid) */}
                    {entries.filter(e => e.start_time < "08:00" || e.end_time > "17:00").length > 0 && (
                        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                            <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Clock size={16} />
                                Extra Sessions (Prep / Early / Late)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {entries.filter(e => e.start_time < "08:00" || e.end_time > "17:00").map((e, idx) => {
                                    const sub = subjects.find(s => s.id === e.subject_id);
                                    return (
                                        <div
                                            key={e.id || idx}
                                            onClick={() => handleCellClick(e.day_of_week, { start: e.start_time.slice(0, 5), end: e.end_time.slice(0, 5) })}
                                            className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm cursor-pointer hover:border-blue-400 transition-all flex justify-between items-center"
                                        >
                                            <div>
                                                <div className="text-xs font-bold text-slate-400 uppercase">{e.day_of_week}</div>
                                                <div className="font-bold text-slate-900">{e.custom_label || sub?.name || "Untitled"}</div>
                                                <div className="text-xs text-blue-600 font-bold">{e.start_time.slice(0, 5)} - {e.end_time.slice(0, 5)}</div>
                                            </div>
                                            <Calendar size={20} className="text-blue-100" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
                        <div className="min-w-[800px]">
                            {/* Header Row */}
                            <div className="grid grid-cols-[100px_repeat(6,1fr)] bg-slate-50 border-b border-slate-200">
                                <div className="p-4 text-xs font-bold uppercase text-slate-400">Time</div>
                                {days.map(d => (
                                    <div key={d} className="p-4 text-xs font-bold uppercase text-slate-600 border-l border-slate-200 text-center">
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Time Slots */}
                            {defaultTimeSlots.map((slot) => (
                                <div key={slot.start} className="grid grid-cols-[100px_repeat(6,1fr)] border-b border-slate-100 last:border-0 h-20">
                                    <div className="p-3 text-xs font-medium text-slate-400 flex items-center justify-center border-r border-slate-100 bg-slate-50/50">
                                        {slot.start}
                                    </div>
                                    {days.map(day => (
                                        <div
                                            key={`${day}-${slot.start}`}
                                            onClick={() => handleCellClick(day, slot)}
                                            className="p-1 border-r border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors relative min-h-[60px]"
                                        >
                                            {getCellContent(day, slot.start)}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Stream Manager Modal */}
            {isStreamModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-4 sm:p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Manage Streams</h3>
                            <button onClick={() => setIsStreamModalOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">New Stream Name</label>
                                <div className="flex gap-2">
                                    <input
                                        className="w-full p-2 border rounded-lg"
                                        placeholder="e.g. Stream A"
                                        value={newStreamName}
                                        onChange={e => setNewStreamName(e.target.value)}
                                    />
                                    <button onClick={handleAddStream} className="p-2 text-white bg-green-600 rounded-lg hover:bg-green-700">Add</button>
                                </div>
                            </div>

                            {streams.length > 0 && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Existing Streams</label>
                                    <ul className="space-y-2">
                                        {streams.map(s => (
                                            <li key={s.id} className="flex justify-between items-center p-2 border rounded-lg bg-slate-50">
                                                <span>{s.name}</span>
                                                <button onClick={() => handleDeleteStream(s.id)} className="text-red-500 hover:text-red-700">
                                                    <Trash2 size={16} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingCell && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-sm shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">
                                {isExtraSession ? "Add Extra Session" : "Edit Slot"}
                            </h3>
                            <button onClick={() => setEditingCell(null)}><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            {isExtraSession && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Select Day</label>
                                    <select
                                        className="w-full p-2 border rounded-lg bg-white"
                                        value={editingCell.day}
                                        onChange={e => setEditingCell({ ...editingCell, day: e.target.value })}
                                    >
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Custom Label (Optional)</label>
                                <input
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="e.g. Morning Prep, Evening Prep"
                                    value={editForm.label}
                                    onChange={e => setEditForm({ ...editForm, label: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1 text-center">Start Time</label>
                                    <input
                                        type="time"
                                        className="w-full p-2 border rounded-lg text-center"
                                        value={editForm.start_time}
                                        onChange={e => setEditForm({ ...editForm, start_time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1 text-center">End Time</label>
                                    <input
                                        type="time"
                                        className="w-full p-2 border rounded-lg text-center"
                                        value={editForm.end_time}
                                        onChange={e => setEditForm({ ...editForm, end_time: e.target.value })}
                                    />
                                </div>
                            </div>

                            {!editForm.label && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Subject</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <select
                                                className="w-full p-2 border rounded-lg"
                                                value={editForm.subject_id}
                                                onChange={e => setEditForm({ ...editForm, subject_id: e.target.value })}
                                            >
                                                <option value="">Select Subject...</option>
                                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                            <select
                                                className="w-full p-2 border rounded-lg"
                                                value={editForm.component_label}
                                                onChange={e => setEditForm({ ...editForm, component_label: e.target.value })}
                                            >
                                                <option value="">No Component</option>
                                                <option value="Paper 1">Paper 1</option>
                                                <option value="Paper 2">Paper 2</option>
                                                <option value="Paper 3">Paper 3</option>
                                                <option value="Practical">Practical</option>
                                                <option value="Theory">Theory</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Teacher</label>
                                        <select
                                            className="w-full p-2 border rounded-lg"
                                            value={editForm.teacher_id}
                                            onChange={e => setEditForm({ ...editForm, teacher_id: e.target.value })}
                                        >
                                            <option value="">Select Teacher...</option>
                                            {teachers
                                                .filter(t =>
                                                    !editForm.subject_id ||
                                                    (t.subject_ids && t.subject_ids.includes(editForm.subject_id)) ||
                                                    t.primary_subject_id === editForm.subject_id
                                                )
                                                .map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                        {editForm.subject_id && teachers.filter(t =>
                                            (t.subject_ids && t.subject_ids.includes(editForm.subject_id)) ||
                                            t.primary_subject_id === editForm.subject_id
                                        ).length === 0 && (
                                                <p className="text-[10px] text-red-500 mt-1 italic">No teachers found for this subject.</p>
                                            )}
                                    </div>
                                </>
                            )}

                            <div className="flex gap-2 pt-4">
                                <button onClick={deleteEntry} className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 flex-1 flex items-center justify-center gap-2 font-bold">
                                    <Trash2 size={16} /> Delete
                                </button>
                                <button onClick={saveEntry} className="p-3 text-white bg-green-600 rounded-xl hover:bg-green-700 flex-[2] flex items-center justify-center gap-2 font-bold">
                                    <Save size={16} /> Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
