"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, FileText, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Orbitron } from "next/font/google";

const schoolFont = Orbitron({
    subsets: ["latin"],
    weight: ["400", "700"],
});

interface Event {
    id: string;
    title: string;
    description: string;
    event_date: string;
    location: string;
    category: string;
}

interface Timetable {
    id: string;
    title: string;
    file_url: string;
    level: string;
    year: string;
    paper_type: string;
}

const AcademicCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('events')
            .select('*')
            .order('event_date', { ascending: true });

        if (data) setEvents(data);
        setLoading(false);
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const getMonthName = (date: Date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    const getCategoryColor = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('exam') || cat.includes('important')) return 'bg-red-500';
        if (cat.includes('holiday') || cat.includes('break')) return 'bg-amber-400';
        return 'bg-green-600';
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for padding
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-16 sm:h-24 bg-slate-50/30 border border-slate-100/50"></div>);
        }

        // Day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            const dayEvents = events.filter(e => new Date(e.event_date).toDateString() === dateStr);
            const isToday = new Date().toDateString() === dateStr;
            const isSelected = selectedDate === dateStr;

            days.push(
                <motion.div
                    key={day}
                    whileHover={{ scale: 1.01, zIndex: 10 }}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`
                        min-h-[64px] sm:min-h-[96px] p-1 sm:p-2 border border-slate-100 flex flex-col gap-1 cursor-pointer transition-all
                        ${isToday ? 'bg-green-50 ring-1 ring-inset ring-green-200' : 'bg-white hover:bg-slate-50'}
                        ${isSelected ? 'bg-blue-50/30 border-green-500 shadow-md ring-1 ring-green-500 z-10' : ''}
                    `}
                >
                    <div className="flex justify-between items-start">
                        <span className={`text-xs sm:text-sm font-bold ${isToday ? 'text-green-700' : 'text-slate-600'}`}>
                            {day}
                        </span>
                        {isToday && (
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse hidden sm:block"></span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-0.5 sm:gap-1 mt-auto overflow-hidden">
                        {dayEvents.map(event => (
                            <motion.span
                                key={event.id}
                                layoutId={event.id}
                                className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full shadow-sm ${getCategoryColor(event.category)}`}
                                title={event.title}
                            />
                        ))}
                    </div>
                </motion.div>
            );
        }

        return days;
    };

    const selectedDayEvents = selectedDate
        ? events.filter(e => new Date(e.event_date).toDateString() === selectedDate)
        : events.filter(e => {
            const eDate = new Date(e.event_date);
            const now = new Date();
            return eDate >= new Date(now.getFullYear(), now.getMonth(), 1) && eDate.getMonth() === currentDate.getMonth();
        }).slice(0, 8);

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-16 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">

                {/* Header Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center space-y-6 pb-10 border-b border-slate-200"
                >
                    <div className="space-y-4 max-w-3xl mx-auto">
                        <h1 className={`${schoolFont.className} text-4xl sm:text-7xl font-black text-slate-900 tracking-tighter uppercase`}>
                            School <span className="text-green-600">Calendar</span>
                        </h1>
                        <p className="text-slate-500 text-base sm:text-xl font-light leading-relaxed">
                            A live portal for KMSS academic milestones, holidays, and extracurricular events.
                            <span className="hidden sm:inline"> Stay ahead with real-time updates from our administration.</span>
                        </p>
                    </div>

                    {/* Legend - Centered */}
                    <div className="flex flex-wrap justify-center gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 p-4 bg-slate-50 rounded-2xl w-fit mx-auto">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-600" /> Academics
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-400" /> Holidays
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500" /> Exams
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">

                    {/* LEFT: CALENDAR GRID (8 Cols) */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-8 bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
                    >
                        {/* Custom Control Bar */}
                        <div className="p-6 sm:p-10 bg-white flex items-center justify-between">
                            <button
                                onClick={prevMonth}
                                className="p-3 sm:p-4 rounded-2xl bg-slate-50 hover:bg-green-600 hover:text-white text-slate-400 transition-all active:scale-90"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="text-center">
                                <h2 className={`${schoolFont.className} text-lg sm:text-2xl font-bold text-slate-900 uppercase tracking-[0.2em]`}>
                                    {getMonthName(currentDate)}
                                </h2>
                                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase mt-1 tracking-widest">Select a date to view events</p>
                            </div>
                            <button
                                onClick={nextMonth}
                                className="p-3 sm:p-4 rounded-2xl bg-slate-50 hover:bg-green-600 hover:text-white text-slate-400 transition-all active:scale-90"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Calendar Grid Header */}
                        <div className="grid grid-cols-7 bg-slate-50/80 border-y border-slate-100">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-4 text-center text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* The Grid */}
                        <div className="grid grid-cols-7 shadow-inner">
                            {renderCalendar()}
                        </div>
                    </motion.div>

                    {/* RIGHT: AGENDA & TIMETABLES (4 Cols) */}
                    <div className="lg:col-span-4 space-y-8 sm:space-y-12">

                        {/* Timeline / Agenda */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-6 sm:space-y-8"
                        >
                            <div className="flex items-center justify-between px-2">
                                <h3 className={`${schoolFont.className} text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tighter`}>
                                    Live <span className="text-green-600">Agenda</span>
                                </h3>
                                {selectedDate && (
                                    <button
                                        onClick={() => setSelectedDate(null)}
                                        className="text-[10px] font-bold text-green-600 uppercase hover:underline"
                                    >
                                        Show All
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4 sm:space-y-5">
                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-24 bg-slate-100 rounded-[2rem] animate-pulse" />
                                        ))}
                                    </div>
                                ) : selectedDayEvents.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                                        <AlertCircle className="mx-auto text-slate-200 mb-3" size={32} />
                                        <p className="text-slate-400 text-sm font-light italic px-4">Nothing scheduled for this window.</p>
                                    </div>
                                ) : (
                                    <div className="relative border-l-2 border-slate-100 ml-4 sm:ml-6 space-y-6 sm:space-y-8 pb-4">
                                        <AnimatePresence mode="popLayout">
                                            {selectedDayEvents.map((event, idx) => (
                                                <motion.div
                                                    key={event.id}
                                                    initial={{ x: 20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    exit={{ scale: 0.9, opacity: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="relative pl-8 sm:pl-10"
                                                >
                                                    {/* Node Point */}
                                                    <div className={`absolute left-[-9px] top-4 w-4 h-4 rounded-full border-4 border-white shadow-sm ${getCategoryColor(event.category)}`} />

                                                    <div className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 hover:border-green-200 transition-all group">
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] bg-green-50 px-3 py-1 rounded-full">
                                                                    {new Date(event.event_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-slate-300 uppercase">{event.category}</span>
                                                            </div>
                                                            <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-tight group-hover:text-green-600 transition-colors">
                                                                {event.title}
                                                            </h4>
                                                            <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 font-medium">
                                                                <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                {event.location && <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <TimetablesSection />
                    </div>
                </div>
            </div>
        </div>
    );
};

const TimetablesSection = () => {
    const [timetables, setTimetables] = useState<Timetable[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimetables = async () => {
            const { data } = await supabase
                .from('past_papers')
                .select('*')
                .eq('paper_type', 'Timetable')
                .order('created_at', { ascending: false })
                .limit(3);
            if (data) setTimetables(data);
            setLoading(false);
        };
        fetchTimetables();
    }, []);

    if (loading || timetables.length === 0) return null;

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-[#1e293b] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 text-white shadow-2xl space-y-8 border border-white/5 relative overflow-hidden"
        >
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-green-600/10 rounded-full blur-[80px]" />

            <div className="flex items-center justify-between relative z-10">
                <h3 className={`${schoolFont.className} text-xl sm:text-2xl font-black uppercase tracking-tighter`}>
                    Latest <span className="text-green-500">Exam Tables</span>
                </h3>
            </div>

            <div className="space-y-4 relative z-10">
                {timetables.map(t => (
                    <motion.a
                        key={t.id}
                        href={t.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.05)' }}
                        className="flex items-center justify-between p-5 bg-white/5 rounded-[1.5rem] transition-all border border-white/5 group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500">
                                <FileText size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm sm:text-base tracking-tight leading-tight">{t.title}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t.level} • {t.year}</span>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                    </motion.a>
                ))}
            </div>

            <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] relative z-10 pt-2 opacity-50">Updated regularly by Academic Registry</p>
        </motion.div>
    );
};

export default AcademicCalendar;
