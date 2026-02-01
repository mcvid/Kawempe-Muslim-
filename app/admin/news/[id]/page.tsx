"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Eye,
    Trash2,
    Upload,
    Globe,
} from "lucide-react";

type NewsArticle = {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_url: string;
    is_published: boolean;
    published_at: string;
};

export default function NewsEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const isNew = id === "new";

    const [article, setArticle] = useState<NewsArticle>({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        image_url: "",
        is_published: false,
        published_at: new Date().toISOString(),
    });

    // Helper to convert UTC ISO string to local datetime-local format
    const toLocalISOString = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    };
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!isNew) {
            fetchArticle();
        }
    }, [id, isNew]);

    const fetchArticle = async () => {
        try {
            const { data, error } = await supabase
                .from("news")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            if (data) setArticle(data);
        } catch (error) {
            console.error("Error fetching article:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };

    const handleTitleChange = (title: string) => {
        setArticle((prev) => ({
            ...prev,
            title,
            slug: generateSlug(title),
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `news/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("images").getPublicUrl(filePath);
            setArticle((prev) => ({ ...prev, image_url: data.publicUrl }));
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!article.title || !article.slug) {
            alert("Please fill in the title");
            return;
        }

        setSaving(true);
        try {
            if (isNew) {
                const { error } = await supabase.from("news").insert([article]);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("news")
                    .update(article)
                    .eq("id", id);
                if (error) throw error;
            }

            // Invalidate cache
            await fetch("/api/revalidate?tag=news", { method: "POST" }).catch(() => { });

            router.push("/admin/news");
        } catch (error) {
            console.error("Error saving article:", error);
            alert("Failed to save article");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
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
                            {isNew ? "New Article" : "Edit Article"}
                        </h1>
                        <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-wide">
                            {isNew ? "Create a new news article" : "Update article details"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setArticle((prev) => ({ ...prev, is_published: !prev.is_published }))}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${article.is_published
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-50 text-slate-500"
                            }`}
                    >
                        <Globe className="w-3.5 h-3.5" />
                        {article.is_published ? "Published" : "Draft"}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase transition-all disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
                {/* Featured Image */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Featured Image
                    </label>
                    <div className="relative">
                        {article.image_url ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                                <img
                                    src={article.image_url}
                                    alt="Featured"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => setArticle((prev) => ({ ...prev, image_url: "" }))}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                                {uploading ? (
                                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                        <span className="text-sm text-slate-500">Click to upload image</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={article.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter article title..."
                        className="w-full px-4 py-2 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base font-semibold"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        URL Slug
                    </label>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">/news/</span>
                        <input
                            type="text"
                            value={article.slug}
                            onChange={(e) =>
                                setArticle((prev) => ({ ...prev, slug: e.target.value }))
                            }
                            placeholder="article-url-slug"
                            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>

                {/* Excerpt */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Excerpt
                    </label>
                    <textarea
                        value={article.excerpt}
                        onChange={(e) =>
                            setArticle((prev) => ({ ...prev, excerpt: e.target.value }))
                        }
                        placeholder="Brief summary of the article..."
                        rows={2}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Content
                    </label>
                    <textarea
                        value={article.content}
                        onChange={(e) =>
                            setArticle((prev) => ({ ...prev, content: e.target.value }))
                        }
                        placeholder="Write your article content here..."
                        rows={12}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    />
                </div>

                {/* Publish Date */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Publish Date
                    </label>
                    <input
                        type="datetime-local"
                        value={toLocalISOString(article.published_at)}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                                const date = new Date(val);
                                if (!isNaN(date.getTime())) {
                                    setArticle((prev) => ({
                                        ...prev,
                                        published_at: date.toISOString(),
                                    }));
                                }
                            }
                        }}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>
        </div>
    );
}
