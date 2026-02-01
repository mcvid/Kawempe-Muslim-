"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import {
    Search,
    Plus,
    Newspaper,
    ChevronLeft,
    ChevronRight,
    Eye,
    Trash2,
    Edit,
    ExternalLink,
    Globe,
    Calendar,
} from "lucide-react";

type NewsArticle = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image_url: string;
    is_published: boolean;
    published_at: string;
    created_at: string;
};

export default function NewsManager() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPublished, setFilterPublished] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const { data, error } = await supabase
                .from("news")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteArticle = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) return;
        try {
            const { error } = await supabase.from("news").delete().eq("id", id);
            if (error) throw error;
            fetchArticles();
        } catch (error) {
            console.error("Error deleting article:", error);
        }
    };

    const togglePublished = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from("news")
                .update({ is_published: !currentStatus })
                .eq("id", id);
            if (error) throw error;
            fetchArticles();
        } catch (error) {
            console.error("Error updating article:", error);
        }
    };

    const filteredArticles = articles.filter((article) => {
        const matchesSearch = article.title
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesFilter =
            filterPublished === "" ||
            (filterPublished === "published" && article.is_published) ||
            (filterPublished === "draft" && !article.is_published);
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const stats = {
        total: articles.length,
        published: articles.filter((a) => a.is_published).length,
        drafts: articles.filter((a) => !a.is_published).length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">News</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Create and manage news articles
                    </p>
                </div>
                <Link
                    href="/admin/news/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Article
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <Newspaper className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                            <p className="text-xs text-slate-500">Total</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                            <Globe className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.published}</p>
                            <p className="text-xs text-slate-500">Published</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-100">
                            <Edit className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.drafts}</p>
                            <p className="text-xs text-slate-500">Drafts</p>
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
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <select
                    value={filterPublished}
                    onChange={(e) => setFilterPublished(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                    <option value="">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                </select>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
                            <div className="h-40 bg-slate-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-slate-200 rounded w-3/4" />
                                <div className="h-3 bg-slate-200 rounded w-full" />
                                <div className="h-3 bg-slate-200 rounded w-2/3" />
                            </div>
                        </div>
                    ))
                ) : paginatedArticles.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        No articles found
                    </div>
                ) : (
                    paginatedArticles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group"
                        >
                            {/* Image */}
                            <div className="relative h-40 bg-slate-100 overflow-hidden">
                                {article.image_url ? (
                                    <img
                                        src={article.image_url}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <Newspaper className="w-12 h-12" />
                                    </div>
                                )}
                                <div
                                    className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${article.is_published
                                            ? "bg-green-500 text-white"
                                            : "bg-yellow-500 text-white"
                                        }`}
                                >
                                    {article.is_published ? "Published" : "Draft"}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                    {article.excerpt || "No excerpt"}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/news/${article.slug}`}
                                            target="_blank"
                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/admin/news/${article.id}`}
                                            className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => deleteArticle(article.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-slate-600">
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
            )}
        </div>
    );
}
