"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import {
    ArrowLeft,
    Save,
    Calendar,
    MapPin,
    Clock,
} from "lucide-react";

type Event = {
    id?: string;
    title: string;
    description: string;
    event_date: string;
    location: string;
    category: string;
    image_url: string;
    interest_id: string;
    is_featured: boolean;
};

const categories = [
    "Academic",
    "Sports",
    "Cultural",
    "Religious",
    "Community",
    "Other",
];

export default function EventEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const isNew = id === "new";

    const [event, setEvent] = useState<Event>({
        title: "",
        description: "",
        event_date: new Date().toISOString(),
        location: "",
        category: "",
        image_url: "",
        interest_id: "",
        is_featured: false,
    });
    const [interests, setInterests] = useState<any[]>([]);

    // Helper to convert UTC ISO string to local datetime-local format
    const toLocalISOString = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    };
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch interests
                const { data: interestData } = await supabase.from('event_interests').select('*').order('name');
                setInterests(interestData || []);

                if (!isNew) {
                    const { data, error } = await supabase
                        .from("events")
                        .select("*")
                        .eq("id", id)
                        .single();

                    if (error) throw error;
                    if (data) setEvent(data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, isNew]);

    const handleSave = async () => {
        if (!event.title) {
            alert("Please fill in the title");
            return;
        }

        setSaving(true);
        try {
            let finalImageUrl = event.image_url;

            // 1. Upload new image if selected
            if (imageFile) {
                setUploadingImage(true);
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `events/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);

                finalImageUrl = publicUrl;
                setUploadingImage(false);
            }

            const eventToSave = { ...event, image_url: finalImageUrl };

            if (isNew) {
                const { error } = await supabase.from("events").insert([eventToSave]);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("events")
                    .update(eventToSave)
                    .eq("id", id);
                if (error) throw error;
            }

            router.push("/admin/events");
        } catch (error) {
            console.error("Error saving event:", error);
            alert("Failed to save event");
        } finally {
            setSaving(false);
            setUploadingImage(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Header omitted for brevity in replace call, but keeping logic */}
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            {isNew ? "New Event" : "Edit Event"}
                        </h1>
                        <p className="text-slate-400 text-[10px] uppercase tracking-wide mt-1">
                            {isNew ? "Create a new event" : "Update event details"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold uppercase transition-all disabled:opacity-50"
                >
                    {saving ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Save className="w-3.5 h-3.5" />
                    )}
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Event Title *
                    </label>
                    <input
                        type="text"
                        value={event.title}
                        onChange={(e) => setEvent((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter event title..."
                        className="w-full px-4 py-2 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/20 focus:border-green-500 transition-all text-base font-semibold"
                    />
                </div>

                {/* Date & Time */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-green-600" />
                            Date & Time
                        </div>
                    </label>
                    <input
                        type="datetime-local"
                        value={toLocalISOString(event.event_date)}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                                const date = new Date(val);
                                if (!isNaN(date.getTime())) {
                                    setEvent((prev) => ({
                                        ...prev,
                                        event_date: date.toISOString(),
                                    }));
                                }
                            }
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            Location
                        </div>
                    </label>
                    <input
                        type="text"
                        value={event.location}
                        onChange={(e) => setEvent((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., Main Hall, Sports Field..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Event Image
                    </label>
                    <div className="space-y-4">
                        {/* File Input */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all overflow-hidden group">
                                    {imageFile || event.image_url ? (
                                        <img
                                            src={imageFile ? URL.createObjectURL(imageFile) : event.image_url}
                                            alt="Preview"
                                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                                        />
                                    ) : null}
                                    <div className="relative flex flex-col items-center justify-center pt-5 pb-6">
                                        <p className="mb-2 text-sm text-slate-500 font-bold uppercase tracking-wider">
                                            {imageFile ? 'Changing Image' : 'Upload Local Image'}
                                        </p>
                                        <p className="text-xs text-slate-400 font-medium">PNG, JPG or WebP</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                    />
                                </label>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</p>
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={event.image_url}
                                    onChange={(e) => setEvent((prev) => ({ ...prev, image_url: e.target.value }))}
                                    placeholder="Enter image URL..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-xs"
                                />
                            </div>
                        </div>
                        {uploadingImage && (
                            <div className="flex items-center gap-2 text-xs text-green-600 font-bold uppercase tracking-wider bg-green-50 p-2 rounded-lg">
                                <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                Processing Image...
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Legacy Category
                        </label>
                        <select
                            value={event.category}
                            onChange={(e) => setEvent((prev) => ({ ...prev, category: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        >
                            <option value="">Select category...</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Interest Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Link to Interest *
                        </label>
                        <select
                            value={event.interest_id}
                            onChange={(e) => setEvent((prev) => ({ ...prev, interest_id: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-bold text-green-600"
                        >
                            <option value="">Select Interest...</option>
                            {interests.map((interest) => (
                                <option key={interest.id} value={interest.id}>
                                    {interest.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Featured Toggle */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-900">Featured Event</p>
                        <p className="text-xs text-slate-500">Show in the top carousel banner</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={event.is_featured}
                            onChange={(e) => setEvent(prev => ({ ...prev, is_featured: e.target.checked }))}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={event.description}
                        onChange={(e) =>
                            setEvent((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Describe the event..."
                        rows={6}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
                    />
                </div>
            </div>
        </div>
    );
}
