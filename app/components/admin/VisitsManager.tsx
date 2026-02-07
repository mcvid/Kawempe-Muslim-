"use client";

import React, { useEffect, useState } from "react";
import { 
    Calendar, 
    Clock, 
    User, 
    Mail, 
    Phone, 
    Eye, 
    CheckCircle, 
    XCircle, 
    Trash2, 
    Search,
    Filter,
    MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VisitRequest {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    preferred_date: string;
    time_slot: string;
    visit_type: string;
    status: string;
    notes: string | null;
    created_at: string;
}

export default function VisitsManager() {
    const [visits, setVisits] = useState<VisitRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedVisit, setSelectedVisit] = useState<VisitRequest | null>(null);

    const fetchVisits = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/visits");
            const data = await res.json();
            if (data.visits) {
                setVisits(data.visits);
            }
        } catch (error) {
            console.error("Error fetching visits:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    const filteredVisits = visits.filter(visit => {
        const matchesSearch = visit.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             visit.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || visit.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
            case "confirmed": return "bg-green-100 text-green-700 border-green-200";
            case "cancelled": return "bg-red-100 text-red-700 border-red-200";
            case "completed": return "bg-blue-100 text-blue-700 border-blue-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Visit Requests</h2>
                    <p className="text-sm text-slate-500">Manage and track campus visit bookings</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-64"
                        />
                    </div>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                            <th className="px-6 py-4">Visitor</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                    Loading visit requests...
                                </td>
                            </tr>
                        ) : filteredVisits.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                    No visit requests found.
                                </td>
                            </tr>
                        ) : (
                            filteredVisits.map((visit) => (
                                <tr key={visit.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900">{visit.full_name}</span>
                                            <span className="text-xs text-slate-500">{visit.email}</span>
                                            <span className="text-xs text-slate-500">{visit.phone || "No phone"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-sm text-slate-700">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(visit.preferred_date).toLocaleDateString('en-US', { 
                                                    month: 'short', day: 'numeric', year: 'numeric' 
                                                })}
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <Clock size={14} className="text-slate-400" />
                                                {visit.time_slot}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 italic text-sm text-slate-600 capitalize">
                                        {visit.visit_type.replace(/_/g, " ")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(visit.status)}`}>
                                            {visit.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => setSelectedVisit(visit)}
                                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <div className="relative group/actions">
                                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                                                    <MoreVertical size={18} />
                                                </button>
                                                {/* Hidden quick actions dropdown could go here */}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Visit Details Modal (Simple Overlay) */}
            <AnimatePresence>
                {selectedVisit && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedVisit(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-bold text-lg text-slate-900">Visit Details</h3>
                                <button onClick={() => setSelectedVisit(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <XCircle size={24} />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Visitor Name</p>
                                        <p className="font-semibold text-slate-900">{selectedVisit.full_name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Visit Type</p>
                                        <p className="font-semibold text-slate-900 capitalize">{selectedVisit.visit_type.replace(/_/g, " ")}</p>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Email Address</p>
                                        <p className="text-slate-700">{selectedVisit.email}</p>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Phone</p>
                                        <p className="text-slate-700">{selectedVisit.phone || "Not provided"}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-green-600 shadow-sm">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-green-900">
                                                {new Date(selectedVisit.preferred_date).toLocaleDateString('en-US', { 
                                                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
                                                })}
                                            </p>
                                            <p className="text-xs text-green-700">{selectedVisit.time_slot}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(selectedVisit.status)}`}>
                                        {selectedVisit.status}
                                    </span>
                                </div>

                                {selectedVisit.notes && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Additional Notes</p>
                                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600 italic">
                                            "{selectedVisit.notes}"
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5">
                                    <XCircle size={16} /> Cancel Visit
                                </button>
                                <button className="px-4 py-2 text-sm font-bold bg-green-600 text-white hover:bg-green-700 rounded-lg shadow-sm shadow-green-200 transition-all flex items-center gap-1.5">
                                    <CheckCircle size={16} /> Confirm Visit
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
