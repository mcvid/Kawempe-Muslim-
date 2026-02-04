"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { ChevronRight, Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Poppins, Barlow_Condensed } from "next/font/google";
import Footer from "@/app/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-barlow",
});

type ClassItem = { id: string; name: string; short_name: string };
type StreamItem = { id: string; name: string; class_id: string };
type TimetableEntry = {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject: { name: string } | null;
  teacher: { name: string } | null;
  custom_label?: string;
  component_label?: string;
  room?: string;
};

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetablesPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [streams, setStreams] = useState<StreamItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [selectedStream, setSelectedStream] = useState<StreamItem | null>(null);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Initial Load: Fetch Classes + Check LocalStorage
  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase.from("academic_classes").select("*").order("sort_order");
      setClasses(data || []);
    };
    fetchClasses();

    // Check for saved preference
    const savedClass = localStorage.getItem("kmss_last_class");
    const savedStream = localStorage.getItem("kmss_last_stream");

    if (savedClass && savedStream) {
      try {
        const parsedClass = JSON.parse(savedClass);
        const parsedStream = JSON.parse(savedStream);

        setSelectedClass(parsedClass);
        setSelectedStream(parsedStream);

        // Fetch streams to keep state consistent for "Back" button
        supabase
          .from("class_streams")
          .select("*")
          .eq("class_id", parsedClass.id)
          .order("name")
          .then(({ data }) => setStreams(data || []));

        // Fetch Restored Timetable
        setLoading(true);
        supabase
          .from("timetables")
          .select("id")
          .eq("stream_id", parsedStream.id)
          .eq("is_active", true)
          .single()
          .then(({ data: timetableData }) => {
            if (timetableData) {
              return supabase
                .from("timetable_entries")
                .select(`
                                    id, day_of_week, start_time, end_time, custom_label, component_label, room,
                                    subject(name), teacher(name)
                                `)
                .eq("timetable_id", timetableData.id)
                .order("start_time");
            }
            return { data: [] };
          })
          .then(({ data }) => {
            // @ts-ignore
            setTimetable(data || []);
            setStep(3);
            setLoading(false);
          });

      } catch (err) {
        console.error("Failed to restore timetable preference", err);
        localStorage.removeItem("kmss_last_class");
        localStorage.removeItem("kmss_last_stream");
      }
    }
  }, []);

  // Fetch Streams when Class selected
  const handleClassSelect = async (cls: ClassItem) => {
    setLoading(true);
    setSelectedClass(cls);
    const { data } = await supabase
      .from("class_streams")
      .select("*")
      .eq("class_id", cls.id)
      .order("name");

    if (data && data.length > 0) {
      setStreams(data);
      setStep(2);
    } else {
      alert("No streams found for this class yet.");
    }
    setLoading(false);
  };

  // Fetch Timetable when Stream selected
  const handleStreamSelect = async (stream: StreamItem) => {
    setLoading(true);
    setSelectedStream(stream);

    // Save to LocalStorage
    if (selectedClass) {
      localStorage.setItem("kmss_last_class", JSON.stringify(selectedClass));
      localStorage.setItem("kmss_last_stream", JSON.stringify(stream));
    }

    // Fetch active timetable for this stream
    // First get the timetable container
    const { data: timetableData } = await supabase
      .from("timetables")
      .select("id")
      .eq("stream_id", stream.id)
      .eq("is_active", true)
      .single();

    if (timetableData) {
      const { data: entries } = await supabase
        .from("timetable_entries")
        .select(`
                    id, day_of_week, start_time, end_time, custom_label, component_label, room,
                    subject(name), teacher(name)
                `)
        .eq("timetable_id", timetableData.id)
        .order("start_time");

      setTimetable(entries || []);
      setStep(3);
    } else {
      setTimetable([]);
      setStep(3); // Go to view anyway to show "Empty" state
    }
    setLoading(false);
  };

  const handleBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  // Helper to organize by day
  const getEntriesForDay = (day: string) => {
    return timetable.filter(t => t.day_of_week === day);
  };

  return (
    <main className={`min-h-screen bg-slate-50 ${poppins.variable} ${barlow.variable} font-[var(--font-poppins)] pt-24 pb-20`}>

      {/* Header */}
      <div className="bg-[#1C1C1C] text-white py-16 px-6 mb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className={`${barlow.className} text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-[#FFD700]`}>
            Timetables
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl font-light">
            {step === 1 && "Select your class level to view the schedule."}
            {step === 2 && `Select your stream for ${selectedClass?.name}.`}
            {step === 3 && `Viewing schedule for ${selectedClass?.short_name} - ${selectedStream?.name}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Back Button */}
        {step > 1 && (
          <button
            onClick={handleBack}
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-[#1C1C1C] transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back to {step === 3 ? "Streams" : "Classes"}
          </button>
        )}

        <AnimatePresence mode="wait">

          {/* STEP 1: CLASS SELECTION */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {classes.map(cls => (
                <button
                  key={cls.id}
                  onClick={() => handleClassSelect(cls)}
                  className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all border border-slate-100 group text-left"
                >
                  <h3 className={`${barlow.className} text-4xl font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-green-600 transition-colors`}>
                    {cls.name}
                  </h3>
                  <div className="w-12 h-1 bg-slate-200 group-hover:bg-green-500 transition-colors rounded-full" />
                </button>
              ))}
            </motion.div>
          )}

          {/* STEP 2: STREAM SELECTION */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {streams.map(stream => (
                <button
                  key={stream.id}
                  onClick={() => handleStreamSelect(stream)}
                  className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all border border-slate-100 group text-left"
                >
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{selectedClass?.name}</span>
                  <h3 className={`${barlow.className} text-4xl font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-green-600 transition-colors`}>
                    {stream.name}
                  </h3>
                  <div className="w-12 h-1 bg-slate-200 group-hover:bg-green-500 transition-colors rounded-full" />
                </button>
              ))}
            </motion.div>
          )}

          {/* STEP 3: TIMETABLE DISPLAY */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {timetable.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                  <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-bold text-slate-600">No timetable found</h3>
                  <p className="text-slate-400">Please check back later.</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {daysOfWeek.map(day => {
                    const lessons = getEntriesForDay(day);
                    if (lessons.length === 0) return null;

                    return (
                      <div key={day} className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-200 shadow-sm">
                        <h2 className={`${barlow.className} text-3xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3`}>
                          <span className="w-2 h-8 bg-green-500 rounded-full" />
                          {day}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {lessons.map(lesson => (
                            <div key={lesson.id} className="relative group">
                              <div className="absolute inset-0 bg-slate-50 rounded-2xl transform transition-transform group-hover:scale-[1.02] -z-10" />
                              <div className={`
                                                                relative h-full p-5 rounded-2xl border 
                                                                ${lesson.custom_label ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100'}
                                                            `}>
                                {/* Time */}
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                  <Clock size={12} />
                                  {lesson.start_time.slice(0, 5)} - {lesson.end_time.slice(0, 5)}
                                </div>

                                {/* Content */}
                                {lesson.custom_label ? (
                                  <h3 className="text-lg font-black text-blue-900 uppercase tracking-wide">
                                    {lesson.custom_label}
                                  </h3>
                                ) : (
                                  <>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                                      {lesson.subject?.name || "Untitled"}
                                      {lesson.component_label && (
                                        <span className="ml-2 px-1.5 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded uppercase">
                                          {lesson.component_label}
                                        </span>
                                      )}
                                    </h3>
                                    {lesson.teacher && (
                                      <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
                                        <Users size={14} />
                                        <span>{lesson.teacher.name}</span>
                                      </div>
                                    )}
                                    {lesson.room && (
                                      <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                                        <MapPin size={12} />
                                        <span>{lesson.room}</span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      <Footer />
    </main>
  );
}
