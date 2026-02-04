"use client";

import { useState, useEffect } from "react";
import { useSiteConfig } from "@/app/lib/SiteConfigContext";
import {
    Bell,
    Save,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Trophy,
    Star,
    AlertTriangle,
    Info as InfoIcon,
    Clock,
    Eye,
    EyeOff
} from "lucide-react";

export default function AnnouncementsAdmin() {
    const { announcement, updateAnnouncement, loading, refreshConfig } = useSiteConfig();
    const [formData, setFormData] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (announcement) {
            setFormData({ ...announcement });
        }
    }, [announcement]);

    if (loading || !formData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData((prev: any) => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateAnnouncement(formData);
            setMessage({ type: 'success', text: 'Announcement updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update announcement.' });
        } finally {
            setSaving(false);
        }
    };

    const types = [
        { id: 'celebration', label: 'Celebration', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { id: 'matchday', label: 'Match Day', icon: Star, color: 'text-green-600', bg: 'bg-green-50' },
        { id: 'alert', label: 'Alert / Warning', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
        { id: 'info', label: 'Information', icon: InfoIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight">Notification Center</h2>
                    <p className="text-slate-500 text-sm">Manage the "Rope Drop" announcement on the homepage.</p>
                </div>
                <button
                    onClick={() => refreshConfig()}
                    className="p-2 text-slate-400 hover:text-[#006400] transition-colors"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Edit Form */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <Bell className="text-green-600" size={20} />
                                <span className="font-bold text-slate-800 uppercase tracking-wider text-sm">Announcement Details</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="enabled"
                                    checked={formData.enabled}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                <span className="ml-3 text-xs font-bold text-slate-700 uppercase tracking-widest">
                                    {formData.enabled ? 'Active' : 'Disabled'}
                                </span>
                            </label>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Welcome Back!"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all bg-white"
                                    >
                                        {types.map(t => (
                                            <option key={t.id} value={t.id}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Enter the announcement message..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all resize-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                                        <Clock size={14} /> Start Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="startAt"
                                        value={formData.startAt?.slice(0, 16)}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                                        <Clock size={14} /> End Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="endAt"
                                        value={formData.endAt?.slice(0, 16)}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="dismissible"
                                        checked={formData.dismissible}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FFD700]"></div>
                                </label>
                                <span className="text-sm text-slate-600">Users can dismiss this notification</span>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-green-900/10 disabled:opacity-50"
                            >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview Card */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Visual Preview</h3>
                    <div className="bg-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden border-2 border-dashed border-slate-300">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[60px] bg-[#8B5E3C] border-l border-dashed border-gray-400"></div>

                        <div className={`w-full bg-white rounded-xl shadow-xl overflow-hidden border-t-4 transition-all duration-500 ${!formData.enabled ? 'opacity-30' : 'opacity-100'}`}
                            style={{ borderTopColor: formData.type === 'celebration' ? '#fbbf24' : formData.type === 'alert' ? '#ef4444' : '#16a34a' }}>
                            <div className="p-4 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${formData.type === 'celebration' ? 'bg-yellow-50 text-yellow-500' :
                                    formData.type === 'alert' ? 'bg-red-50 text-red-500' :
                                        'bg-green-50 text-green-600'
                                    }`}>
                                    {formData.type === 'celebration' && <Trophy size={18} />}
                                    {formData.type === 'matchday' && <Star size={18} />}
                                    {formData.type === 'alert' && <AlertTriangle size={18} />}
                                    {formData.type === 'info' && <InfoIcon size={18} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 text-sm truncate uppercase tracking-tight">{formData.title || 'No Title'}</h4>
                                    <p className="text-slate-500 text-xs line-clamp-2">{formData.message || 'No message set.'}</p>
                                </div>
                            </div>
                        </div>

                        {!formData.enabled && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
                                <EyeOff className="text-slate-400 mb-2" size={32} />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Invisible</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                        <p className="text-[11px] text-green-700 font-medium leading-relaxed">
                            <span className="font-bold uppercase block mb-1">How it works:</span>
                            The notification will only appear on the website if it is <span className="font-bold uppercase">Active</span> AND the current time falls between the start and end dates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
