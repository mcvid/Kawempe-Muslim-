"use client";
import React, { useRef, useEffect, useState } from "react"; // Added React imports
import { Clock, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"; // Added ChevronLeft, ChevronRight
import Link from "next/link";
import { motion } from "framer-motion";
import { Crimson_Pro } from "next/font/google";
import { supabase } from "@/app/lib/supabase";

const crimson = Crimson_Pro({ subsets: ["latin"], weight: ["400", "700"] });

type Event = {
  id: string;
  title: string;
  event_date: string;
  location: string;
  description?: string;
};

const EventsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const today = new Date().toISOString();
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", today) // Only future events
        .order("event_date", { ascending: true })
        .limit(10);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date parts
  const getDateParts = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString("default", { month: "short" }).toUpperCase(),
      day: date.getDate(),
      time: date.toLocaleString("default", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
  };

  // Slow Auto-Scroll Effect (Analog Clock Style)
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let frameId: number;
    const scrollSpeed = 0.3; // Very slow speed (pixels per frame)

    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;

        // Reset for seamless loop if we reach the end of the first set
        const maxScroll = scrollContainer.scrollWidth / 2;
        // Only loop if we have duplicates (meaning at least one event exists)
        if (events.length > 0 && scrollContainer.scrollLeft >= maxScroll) {
          scrollContainer.scrollLeft = 0;
        }
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isPaused, events]); // Added events dependency

  // Duplicate events for seamless infinite loop if not empty
  const displayEvents = events.length > 0 ? [...events, ...events] : [];


  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      // Pause auto-scroll briefly on interaction
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 2000);

      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.4;
      const scrollTo = direction === "left"
        ? scrollLeft - scrollAmount
        : scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="bg-[#ECF7F8] py-20 overflow-hidden relative">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col lg:flex-row items-center gap-10 relative px-0"
      >

        {/* Left Header - Refined Mirror Base Style */}
        <div className="w-full lg:w-[480px] shrink-0 z-20">
          <motion.div
            variants={itemVariants}
            className={`
              relative bg-white rounded-r-[80px] rounded-l-none 
              p-12 lg:p-15 
              shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] 
              text-center lg:text-left overflow-visible 
              border-b-4 border-[#cfd8dc]
            `}
          >
            <div className="relative z-10">
              <h2 className={`${crimson.className} text-4xl lg:text-6xl text-slate-900 leading-[1.05] mb-8 tracking-tight`}>
                See <span className="italic font-light">What</span> <br />
                Goes On
              </h2>
              <p className="text-slate-400 text-l font-light leading-relaxed mb-10 max-w-sm mx-auto lg:mx-0">
                Stay up to date and make sure you never miss out on exciting events and performances.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6">
                <Link
                  href="/academics/calendar"
                  className="inline-flex items-center justify-center bg-[#e0eaf3] text-slate-800 font-medium px-10 py-4 rounded-full hover:bg-green-600 hover:text-white transition-all duration-500 shadow-sm uppercase tracking-wider text-xs whitespace-nowrap"
                >
                  VIEW FULL CALENDAR
                </Link>

                {/* Stylish Navigation Arrows */}
                <div
                  className="flex gap-4"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <button
                    onClick={() => scroll("left")}
                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer shadow-sm group"
                  >
                    <ChevronLeft size={24} className="group-active:scale-90 transition-transform" />
                  </button>
                  <button
                    onClick={() => scroll("right")}
                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer shadow-sm group"
                  >
                    <ChevronRight size={24} className="group-active:scale-90 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Scrollable Cards - Hidden Scrollbar & Auto-Scroll */}
        <div
          className="flex-1 w-full overflow-hidden relative group/scroll"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            ref={scrollRef}
            variants={containerVariants}
            className="flex gap-8 overflow-x-auto no-scrollbar pb-10 pt-6 px-4"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {loading ? (
              <div className="flex gap-8 px-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-[320px] lg:w-[380px] h-[400px] shrink-0 bg-slate-200 rounded-[50px] animate-pulse" />
                ))}
              </div>
            ) : displayEvents.length === 0 ? (
              <div className="w-full text-center py-20 text-slate-500 italic">No upcoming events scheduled.</div>
            ) : (
              displayEvents.map((event, idx) => {
                const { month, day, time } = getDateParts(event.event_date);
                return (
                  <motion.div
                    key={`${event.id}-${idx}`}
                    variants={itemVariants}
                    className={`
                  w-[320px] lg:w-[380px] h-[400px] shrink-0 bg-[#729cd2] rounded-[50px] p-7 lg:p-8
                  text-white relative shadow-xl flex flex-col justify-between overflow-hidden
                `}
                  >
                    {/* Date Badge */}
                    <div className="absolute top-0 left-0 bg-[#ff9f00] text-slate-900 w-24 h-24 rounded-br-[45px] rounded-tl-[50px] flex flex-col items-center justify-center shadow-lg">
                      <span className="text-sm font-bold uppercase tracking-widest opacity-80">{month}</span>
                      <span className="text-4xl font-black leading-none">{day}</span>
                    </div>

                    {/* Content */}
                    <div className="mt-16">
                      <h3 className={`${crimson.className} text-xl lg:text-2xl font-bold mb-4 leading-tight tracking-wide uppercase group-hover:text-green-300 transition-colors line-clamp-2`}>
                        {event.title}
                      </h3>

                      <div className="space-y-4 mb-4">
                        <div className="flex items-center gap-3 text-white/90">
                          <Clock className="w-5 h-5 opacity-80" />
                          <span className="text-lg font-light">{time}</span>
                        </div>

                        <div className="flex items-center gap-3 text-white/90">
                          <MapPin className="w-5 h-5 opacity-80" />
                          <span className="text-lg font-light">{event.location}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/academics/calendar"
                      className="inline-flex items-center gap-2 text-white font-bold text-lg group/link self-start"
                    >
                      <span className="relative">
                        Read more
                        <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-white transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500 origin-left" />
                      </span>
                      <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
                    </Link>
                  </motion.div>
                )
              })
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Philosophy Quote at Bottom - Precisely Matched to Image */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="max-w-6xl mx-auto px-6 mt-16 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 relative"
      >
        <div className="max-w-md text-center lg:text-left">
          <p className="text-lg lg:text-xl font-bold text-slate-900 leading-tight">
            "&quot;...Are those who know equal to those who do not know?.."39:9
          </p>
        </div>

        <div className="relative pr-12 pb-8">
          <p className={`${crimson.className} text-3xl lg:text-4xl italic text-slate-700 tracking-tight`}>
            our difference is quite evidential
          </p>
          {/* L-Shape Bracket on the bottom-right */}
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-[8px] border-r-[8px] border-slate-400 rounded-br-[4px]" />
        </div>
      </motion.div>
    </section>
  );
};

export default EventsSection;
