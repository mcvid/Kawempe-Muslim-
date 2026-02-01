"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import {
    Map, Navigation, Plus, Edit, Trash2,
    Save, X, Upload, Image as ImageIcon, MapPin, Target, Check,
    Search, Eye, ChevronRight
} from 'lucide-react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/markers-plugin/index.css';

const TourManager = () => {
    const [activeTab, setActiveTab] = useState('stops');

    const tabs = [
        { id: 'stops', label: 'Tour Stops', icon: Map },
        { id: 'hotspots', label: 'Hotspots Editor', icon: MapPin }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-[var(--font-barlow)] uppercase tracking-tight">Virtual Tour <span className="text-[#006400]">Manager</span></h1>
                    <p className="text-slate-500 text-sm mt-1">Manage campus tour locations, panoramic images, and interactive hotspots.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                            ? 'bg-[#006400] text-white shadow-sm'
                            : 'text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="min-h-[600px]">
                {activeTab === 'stops' && <TourStopsTab />}
                {activeTab === 'hotspots' && <HotspotsTab />}
            </div>
        </div>
    );
};

const TourStopsTab = () => {
    const [stops, setStops] = useState<any[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStop, setEditingStop] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        thumbnail_url: '',
        initial_yaw: 0,
        initial_pitch: 0
    });

    useEffect(() => {
        fetchStops();
    }, []);

    const fetchStops = async () => {
        setLoading(true);
        const { data } = await supabase.from('tour_stops').select('*').order('created_at', { ascending: false });
        if (data) setStops(data);
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `stops/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('campus_tours')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('campus_tours').getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                image_url: data.publicUrl,
                thumbnail_url: data.publicUrl
            }));

        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingStop) {
                const { error } = await supabase.from('tour_stops').update(formData).eq('id', editingStop.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('tour_stops').insert([formData]);
                if (error) throw error;
            }
            setIsFormOpen(false);
            setEditingStop(null);
            setFormData({ title: '', description: '', image_url: '', thumbnail_url: '', initial_yaw: 0, initial_pitch: 0 });
            fetchStops();
        } catch (error: any) {
            console.error('Error saving stop:', error);
            alert('Failed to save stop: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this tour stop? All linked hotspots will also be removed.')) return;
        const { error } = await supabase.from('tour_stops').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchStops();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Available Locations ({stops.length})</h3>
                <button
                    onClick={() => {
                        setEditingStop(null);
                        setFormData({ title: '', description: '', image_url: '', thumbnail_url: '', initial_yaw: 0, initial_pitch: 0 });
                        setIsFormOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#006400] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-[#005000] transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Stop
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{editingStop ? 'Edit Stop' : 'New Tour Stop'}</h4>
                        <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006400] text-sm font-medium"
                                    placeholder="e.g. Main Gate"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006400] text-sm font-medium"
                                    rows={3}
                                    placeholder="Tell visitors about this location..."
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Panorama (360° Image)</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-white relative">
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-2 py-4">
                                            <div className="w-5 h-5 border-2 border-slate-200 border-t-[#006400] rounded-full animate-spin" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Uploading...</span>
                                        </div>
                                    ) : formData.image_url ? (
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                                            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                <Upload className="text-white w-6 h-6" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative py-4 w-full h-full flex flex-col items-center cursor-pointer">
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            <Upload className="text-slate-300 w-8 h-8 mb-2" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Click to upload panorama</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-6 py-2 bg-[#006400] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-[#005000] transition-colors disabled:opacity-50"
                                >
                                    {editingStop ? 'Update Stop' : 'Save Stop'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stops.map(stop => (
                    <div key={stop.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
                        <div className="aspect-video relative overflow-hidden bg-slate-100">
                            <img src={stop.thumbnail_url || stop.image_url} alt={stop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-slate-900 uppercase tracking-tight text-sm mb-1">{stop.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">{stop.description || 'No description provided'}</p>
                            <div className="flex justify-end items-center gap-1 mt-4 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => {
                                        setEditingStop(stop);
                                        setFormData(stop);
                                        setIsFormOpen(true);
                                    }}
                                    className="p-2 text-slate-400 hover:text-[#006400] transition-colors"
                                >
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(stop.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {stops.length === 0 && !loading && (
                <div className="py-20 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <Map className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-sm text-slate-400 font-medium">No tour stops yet. Start by adding your first location.</p>
                </div>
            )}
        </div>
    );
};

const HotspotsTab = () => {
    const [stops, setStops] = useState<any[]>([]);
    const [selectedStopId, setSelectedStopId] = useState('');
    const [hotspots, setHotspots] = useState<any[]>([]);
    const [viewerInstance, setViewerInstance] = useState<any>(null);
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [tempCoords, setTempCoords] = useState<{ yaw: number; pitch: number } | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        label: '',
        target_stop_id: '',
        type: 'scene'
    });

    useEffect(() => {
        fetchStops();
    }, []);

    useEffect(() => {
        if (selectedStopId) {
            fetchHotspots(selectedStopId);
        } else {
            setHotspots([]);
        }
    }, [selectedStopId]);

    useEffect(() => {
        if (viewerInstance && hotspots) {
            const markersPlugin = viewerInstance.getPlugin(MarkersPlugin);
            if (markersPlugin) {
                markersPlugin.clearMarkers();
                hotspots.forEach(h => {
                    markersPlugin.addMarker({
                        id: h.id,
                        position: { yaw: h.yaw, pitch: h.pitch },
                        image: 'https://photo-sphere-viewer.js.org/assets/pin-red.png',
                        size: { width: 32, height: 32 },
                        tooltip: h.label,
                        anchor: 'bottom center'
                    });
                });
            }
        }
    }, [viewerInstance, hotspots]);

    const fetchStops = async () => {
        const { data } = await supabase.from('tour_stops').select('*').order('title');
        if (data) setStops(data);
    };

    const fetchHotspots = async (stopId: string) => {
        const { data } = await supabase.from('tour_hotspots').select('*').eq('stop_id', stopId);
        if (data) setHotspots(data);
    };

    const handleViewerReady = (instance: any) => {
        setViewerInstance(instance);
    };

    const handleViewerClick = (data: any) => {
        if (isAddingMode) {
            setTempCoords({ yaw: data.yaw, pitch: data.pitch });
            setShowForm(true);
            setIsAddingMode(false);
        }
    };

    const handleSaveHotspot = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tempCoords || !selectedStopId) return;

        try {
            setSaving(true);
            const newHotspot = {
                stop_id: selectedStopId,
                ...formData,
                pitch: tempCoords.pitch,
                yaw: tempCoords.yaw
            };

            const { error } = await supabase.from('tour_hotspots').insert([newHotspot]);
            if (error) throw error;

            fetchHotspots(selectedStopId);
            setShowForm(false);
            setFormData({ label: '', target_stop_id: '', type: 'scene' });
            setTempCoords(null);
        } catch (error: any) {
            console.error('Error saving hotspot:', error);
            alert('Failed to save hotspot: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteHotspot = async (id: string) => {
        if (!window.confirm('Delete this hotspot?')) return;
        const { error } = await supabase.from('tour_hotspots').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchHotspots(selectedStopId);
    };

    const selectedStop = stops.find(s => s.id === selectedStopId);

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-280px)] min-h-[500px] lg:min-h-[600px]">
            {/* Sidebar */}
            <div className="w-full lg:w-80 flex flex-col gap-6 overflow-hidden">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shrink-0">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">1. Select Scene</label>
                    <select
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006400] text-sm font-medium"
                        value={selectedStopId}
                        onChange={(e) => setSelectedStopId(e.target.value)}
                    >
                        <option value="">-- Choose a location --</option>
                        {stops.map(stop => (
                            <option key={stop.id} value={stop.id}>{stop.title}</option>
                        ))}
                    </select>
                </div>

                {selectedStop && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col min-h-0 overflow-hidden">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">2. Manage Hotspots</label>

                        <button
                            disabled={isAddingMode}
                            onClick={() => setIsAddingMode(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#006400] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-[#005000] transition-colors mb-6 disabled:opacity-50"
                        >
                            {isAddingMode ? 'Click on map...' : <><Plus className="w-4 h-4" /> Add Hotspot</>}
                        </button>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Existing Hotspots ({hotspots.length})</h5>
                            {hotspots.length === 0 ? (
                                <p className="text-xs text-slate-300 italic py-4">No hotspots yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {hotspots.map(h => {
                                        const target = stops.find(s => s.id === h.target_stop_id);
                                        return (
                                            <div key={h.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center group">
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-700 truncate">{h.label}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-tight">→ {target?.title || 'External link'}</p>
                                                </div>
                                                <button onClick={() => handleDeleteHotspot(h.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Viewer Area */}
            <div className="flex-1 bg-black rounded-xl overflow-hidden relative border border-slate-200 min-h-[400px] lg:min-h-0">
                {selectedStop ? (
                    <>
                        <ReactPhotoSphereViewer
                            src={selectedStop.image_url}
                            height={'100%'}
                            width={"100%"}
                            container={"tour-viewer-admin"}
                            onReady={handleViewerReady}
                            onClick={handleViewerClick}
                            plugins={[
                                [MarkersPlugin, {}]
                            ]}
                        />

                        {isAddingMode && (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#006400] text-white rounded-full flex items-center gap-3 shadow-lg z-10 animate-fade-in">
                                <Target className="w-4 h-4 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-[2px]">Click panorama to place hotspot</span>
                                <button onClick={() => setIsAddingMode(false)} className="bg-white/20 p-1 rounded-full hover:bg-white/30"><X size={12} /></button>
                            </div>
                        )}

                        {showForm && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center p-4">
                                <div className="bg-white w-full max-w-sm p-8 rounded-xl border border-slate-200 shadow-xl scale-in">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-6">Hotspot Destination</h4>
                                    <form onSubmit={handleSaveHotspot} className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Display Label</label>
                                            <input
                                                value={formData.label}
                                                onChange={e => setFormData({ ...formData, label: e.target.value })}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006400] text-sm font-medium"
                                                placeholder="e.g. Enter Science Lab"
                                                required
                                                autoFocus
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Scene</label>
                                            <select
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006400] text-sm font-medium"
                                                value={formData.target_stop_id}
                                                onChange={e => setFormData({ ...formData, target_stop_id: e.target.value })}
                                                required
                                            >
                                                <option value="">-- Select Destination --</option>
                                                {stops.filter(s => s.id !== selectedStopId).map(s => (
                                                    <option key={s.id} value={s.id}>{s.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => { setShowForm(false); setTempCoords(null); }}
                                                className="flex-1 py-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="flex-1 py-2 bg-[#006400] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-[#005000] transition-colors flex items-center justify-center gap-2"
                                            >
                                                {saving ? 'Saving...' : <><Check size={14} /> Save</>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                        <Navigation className="w-12 h-12 text-slate-100" />
                        <p className="text-sm font-medium">Select a scene from the sidebar to start editing.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TourManager;
