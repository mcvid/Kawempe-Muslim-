"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, List, Info, X, ChevronRight, Maximize2, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Orbitron } from "next/font/google";
import VirtualTourViewer from "../VirtualTourViewer";
import { supabase } from "../../lib/supabase";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });

interface Stop {
    id: string;
    title: string;
    description?: string;
    image_url: string;
    thumbnail_url?: string;
    initial_yaw?: number;
    initial_pitch?: number;
}

interface Hotspot {
    id: string;
    yaw: number;
    pitch: number;
    title: string;
    target_stop_id?: string;
    description?: string;
}

const VirtualTour = () => {
    const [stops, setStops] = useState<Stop[]>([]);
    const [currentStop, setCurrentStop] = useState<Stop | null>(null);
    const [hotspots, setHotspots] = useState<Hotspot[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    const fetchStops = React.useCallback(async () => {
        setLoading(true);

        const testStop: Stop = {
            id: "test-hm-office",
            title: "HMs office",
            description: "A 360° view of the Headmaster's Office.",
            image_url: "/bg2.jpg",
            thumbnail_url: "/bg2.jpg",
            initial_yaw: 0,
            initial_pitch: 0
        };

        try {
            const { data, error } = await supabase
                .from("tour_stops")
                .select("*")
                .order("created_at");

            if (error) throw error;

            const allStops = data && data.length > 0 ? [testStop, ...data] : [testStop];
            setStops(allStops);
            setCurrentStop(prev => prev || allStops[0]);
        } catch (err) {
            console.error("Error fetching stops:", err);
            // Fallback to test stop on error
            setStops([testStop]);
            setCurrentStop(prev => prev || testStop);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchHotspots = React.useCallback(async (stopId: string) => {
        // Sample hotspots for the test stop "HMs office"
        if (stopId === "test-hm-office") {
            setHotspots([
                {
                    id: "h1",
                    yaw: 10,
                    pitch: 0,
                    title: "Main Entrance",
                    description: "Exit towards the main corridor"
                },
                {
                    id: "h2",
                    yaw: 180,
                    pitch: -15,
                    title: "Office Desk",
                    description: "The primary workspace"
                }
            ]);
            return;
        }

        const { data } = await supabase
            .from("tour_hotspots")
            .select("*")
            .eq("stop_id", stopId);

        if (data) setHotspots(data);
    }, []);

    useEffect(() => {
        fetchStops();
    }, [fetchStops]);

    useEffect(() => {
        if (currentStop) {
            fetchHotspots(currentStop.id);
        }
    }, [currentStop, fetchHotspots]);

    const handleStopChange = (stop: Stop) => {
        setCurrentStop(stop);
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const handleHotspotClick = (hotspot: Hotspot) => {
        if (hotspot.target_stop_id) {
            const target = stops.find((s) => s.id === hotspot.target_stop_id);
            if (target) handleStopChange(target);
        }
    };

    return (
        <div className="flex h-[calc(100vh-80px)] mt-4 relative overflow-hidden font-sans bg-white border-t border-slate-100">

            {/* Sidebar - Matches your .tour-sidebar exactly */}
            <div
                className={`fixed md:relative top-0 left-0 h-full bg-white border-r border-slate-200 flex flex-col z-[60] transition-all duration-300 ease-in-out ${sidebarOpen ? "translate-x-0 w-[300px] opacity-100" : "-translate-x-full w-0 md:w-0 opacity-0 pointer-events-none"
                    }`}
                style={{ width: sidebarOpen ? "300px" : "0px" }}
            >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white min-w-[300px]">
                    <h5 className={`${orbitron.className} text-base md:text-[27px] font-bold text-slate-900 tracking-tight whitespace-nowrap`}>Campus Tour</h5>
                    <button
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
                        onClick={(e) => {
                            e.preventDefault();
                            setSidebarOpen(false);
                        }}
                    >
                        <X size={22} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto min-w-[300px] bg-white">
                    {loading ? (
                        <p className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading...</p>
                    ) : stops.length === 0 ? (
                        <div className="p-10 text-center text-slate-300">
                            <MapPin size={24} className="mx-auto mb-2 opacity-20" />
                            <p className="text-[9px] font-bold uppercase tracking-widest leading-loose">No scenes available yet.</p>
                        </div>
                    ) : (
                        stops.map((stop) => (
                            <div
                                key={stop.id}
                                className={`flex items-center gap-4 px-4 py-3 cursor-pointer border-b border-slate-50 transition-all ${currentStop?.id === stop.id ? "bg-slate-50 border-l-4 border-green-600" : "bg-white hover:bg-slate-50"
                                    }`}
                                onClick={() => handleStopChange(stop)}
                            >
                                <img
                                    src={stop.thumbnail_url || stop.image_url}
                                    alt={stop.title}
                                    className="w-[60px] h-[40px] object-cover rounded shadow-sm flex-shrink-0"
                                />
                                <div className="overflow-hidden">
                                    <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight truncate">{stop.title}</h4>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Viewer - Matches your .tour-main */}
            <div className="flex-1 relative bg-black flex flex-col">
                {/* Restoration/Toggle Button - Visible when sidebar is closed */}
                <AnimatePresence>
                    {!sidebarOpen && (
                        <motion.button
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="absolute top-6 left-6 z-50 bg-white p-3 rounded-full shadow-2xl border border-slate-100 flex items-center gap-2 group transition-all hover:bg-green-600 hover:text-white"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Compass size={24} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-widest pr-2 border-l border-slate-100 pl-2 group-hover:border-white/20">Restore Tour</span>
                        </motion.button>
                    )}
                </AnimatePresence>

                {currentStop ? (
                    <div className="w-full h-full relative">
                        <VirtualTourViewer
                            key={currentStop.id}
                            imageUrl={currentStop.image_url}
                            initialYaw={currentStop.initial_yaw}
                            initialPitch={currentStop.initial_pitch}
                            hotspots={hotspots}
                            onHotspotClick={handleHotspotClick}
                        />

                        {/* Current Stop Overlay - bottom: 2rem, 50% left */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white px-8 py-3 rounded-full text-center z-40 max-w-[85%] border border-white/10">
                            <h3 className={`${orbitron.className} text-[9px] font-bold uppercase tracking-[0.2em] mb-0.5`}>{currentStop.title}</h3>
                            {currentStop.description && (
                                <p className="text-[10px] opacity-75 font-medium tracking-wide truncate max-w-[220px] sm:max-w-none">{currentStop.description}</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-black">
                        <Maximize2 size={24} className="opacity-10 mb-4" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.4em] opacity-40">Awaiting Scene Sync</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VirtualTour;
