"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import {
    Search,
    Plus,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Eye,
    Trash2,
    Edit,
    MapPin,
    Clock,
} from "lucide-react";

type Event = {
    id: string;
    title: string;
    event_date: string;
    location: string;
    description: string;
    category: string;
    image_url: string;
    is_featured: boolean;
    created_at: string;
};

export default function EventsManager() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from("events")
                .select("*")
                .order("event_date", { ascending: true });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteEvent = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const { error } = await supabase.from("events").delete().eq("id", id);
            if (error) throw error;
            fetchEvents();
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const filteredEvents = events.filter((event) => {
        const matchesSearch = event.title
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesFilter = !filterCategory || event.category === filterCategory;
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const paginatedEvents = filteredEvents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const categories = [...new Set(events.map((e) => e.category).filter(Boolean))];
    const upcomingCount = events.filter(
        (e) => new Date(e.event_date) >= new Date()
    ).length;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString("default", { month: "short" }).toUpperCase(),
            time: date.toLocaleString("default", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }),
        };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Events</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Manage school events and calendar
                    </p>
                </div>
                <Link
                    href="/admin/events/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Event
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                            <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{events.length}</p>
                            <p className="text-xs text-slate-500">Total Events</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{upcomingCount}</p>
                            <p className="text-xs text-slate-500">Upcoming</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-100">
                            <Calendar className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
                            <p className="text-xs text-slate-500">Categories</p>
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
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse"
                        >
                            <div className="flex gap-4">
                                <div className="w-16 h-20 bg-slate-200 rounded-xl" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 bg-slate-200 rounded w-1/2" />
                                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    paginatedEvents.map((event) => {
                        const { day, month, time } = formatDate(event.event_date);
                        const isPast = new Date(event.event_date) < new Date();

                        return (
                            <div
                                key={event.id}
                                className={`group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all ${isPast ? "opacity-75 grayscale-[0.5]" : ""
                                    }`}
                            >
                                {/* Event Header/Date Integration */}
                                <div className="relative h-32 bg-slate-100 overflow-hidden">
                                    {event.image_url ? (
                                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
                                            <div className="text-center">
                                                <span className="block text-xs font-bold uppercase tracking-widest opacity-80">{month}</span>
                                                <span className="block text-4xl font-black leading-none">{day}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {event.is_featured && (
                                            <div className="px-2 py-1 bg-yellow-400 text-slate-900 text-[10px] font-bold uppercase rounded-full shadow-sm">
                                                Featured
                                            </div>
                                        )}
                                        {event.category && (
                                            <div className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded-full">
                                                {event.category}
                                            </div>
                                        )}
                                    </div>
                                    {!event.image_url && (
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col h-full">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 text-lg line-clamp-2 mb-3 group-hover:text-green-600 transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 line-clamp-3 mb-4 min-h-[3rem]">
                                            {event.description || "No description provided."}
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Clock className="w-3.5 h-3.5 text-green-600" />
                                                {time}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <MapPin className="w-3.5 h-3.5 text-green-600" />
                                                {event.location || "TBD"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-5 mt-auto border-t border-slate-50">
                                        <Link
                                            href={`/admin/events/${event.id}`}
                                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                            title="Edit Event"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => deleteEvent(event.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Event"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
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
