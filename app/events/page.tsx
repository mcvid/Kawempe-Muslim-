'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getEvents, getUserProfile, generateGoogleCalendarLink, toggleLikeEvent, type KMSSEvent } from './actions';
import { Search, MapPin, Calendar, Heart, Share2, Ticket, ArrowLeft, BellPlus, LayoutGrid, X, Clock, Camera } from 'lucide-react';
import Link from 'next/link';

export default function EventsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [data, setData] = useState<{ featured: KMSSEvent[]; forYou: KMSSEvent[]; nearby: KMSSEvent[] }>({ featured: [], forYou: [], nearby: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<KMSSEvent | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const router = useRouter();

  const handleCalendarSync = async (e: React.MouseEvent, event: KMSSEvent) => {
    e.stopPropagation();
    const link = await generateGoogleCalendarLink(event);
    window.open(link, '_blank');
  };

  const handleToggleLike = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    const userId = localStorage.getItem('event_user_id');
    if (!userId) {
      router.push('/events/onboarding');
      return;
    }

    // Optimistic update
    setData(prev => ({
      ...prev,
      featured: prev.featured.map(e => e.id === eventId ? { ...e, is_liked: !e.is_liked } : e),
      forYou: prev.forYou.map(e => e.id === eventId ? { ...e, is_liked: !e.is_liked } : e),
      nearby: prev.nearby.map(e => e.id === eventId ? { ...e, is_liked: !e.is_liked } : e),
    }));

    await toggleLikeEvent(userId, eventId);

    // Refresh data to ensure lists are correct (items move categories)
    const eventsData = await getEvents(userId);
    setData(eventsData);
  };

  useEffect(() => {
    const userId = localStorage.getItem('event_user_id');

    if (!userId) {
      router.push('/events/onboarding');
      return;
    }

    const fetchData = async () => {
      // Small delay for Splash effect
      await new Promise(r => setTimeout(r, 1500));

      const [userProfile, eventsData] = await Promise.all([
        getUserProfile(userId),
        getEvents(userId)
      ]);

      if (!userProfile) {
        router.push('/events/onboarding');
        return;
      }

      setProfile(userProfile);
      setData(eventsData);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  // Auto-scroll featured carousel
  useEffect(() => {
    if (data.featured.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.featured.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [data.featured.length]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-green-600 relative">
        <Link href="/" className="absolute top-8 left-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-bold uppercase tracking-widest">Home</span>
        </Link>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative w-32 h-32 bg-white rounded-[2.5rem] p-6 flex items-center justify-center border border-white/10">
            <img src="/logo.png" alt="KMSS Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tight text-white mb-1">KMSS Events</h1>
            <p className="text-white/70 text-sm tracking-[0.3em] uppercase font-bold animate-pulse">Loading...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* MOBILE ONLY: Header */}
      <div className="md:hidden px-6 pt-12 pb-4 relative">
        {/* KMSS Logo & Branding - Top Right */}
        <div className="absolute top-4 right-6 flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] leading-none">KMSS</span>
            <span className="text-[14px] font-bold text-green-700 leading-none">Events</span>
          </div>
          <img src="/logo.png" alt="KMSS Logo" className="w-14 h-14 object-contain" />
        </div>

        <Link href="/" className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors group mb-6 w-fit">
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-bold uppercase tracking-widest">Home</span>
        </Link>
        <div className="flex justify-between items-end pr-14">
          <div>
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Welcome Back</p>
            <h1 className="text-2xl font-bold text-amber-400">
              {profile?.nickname || (profile?.full_name ? (profile.full_name.split(' ')[1] || profile.full_name) : 'Events Home')}
            </h1>
          </div>
          <Link href="/events/onboarding" className="relative cursor-pointer transition-transform active:scale-90">
            <div className="w-14 h-14 rounded-full bg-green-100 overflow-hidden border-2 border-green-500 shadow-sm">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name}`} alt="Avatar" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-600 text-white p-1 rounded-full border-2 border-white">
              <Camera size={10} />
            </div>
          </Link>
        </div>
      </div>

      {/* DESKTOP ONLY: Bento Header */}
      <div className="hidden md:flex flex-col gap-2 px-10 pt-16 pb-10 relative">
        {/* KMSS Logo & Branding - Top Right */}
        <div className="absolute top-8 right-10 flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-green-600 uppercase tracking-[0.3em] leading-none mb-1">Kawempe Muslim</span>
            <span className="text-2xl font-black text-green-800 leading-none uppercase tracking-tighter">Events Portal</span>
          </div>
          <img src="/logo.png" alt="KMSS Logo" className="w-20 h-20 object-contain shadow-sm" />
        </div>

        <Link href="/" className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors group mb-4 w-fit">
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to School Home</span>
        </Link>
        <div className="flex items-center justify-between pr-20">
          <h1 className="text-5xl font-black bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent tracking-tight">Discover Events</h1>
          <div className="flex items-center gap-4 bg-white p-2 pl-6 rounded-2xl border border-green-200">
            <Search size={20} className="text-green-400" />
            <input
              type="text"
              placeholder="Search events, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-600 w-64 font-medium"
            />
          </div>
        </div>
      </div>

      {/* MOBILE ONLY: Search */}
      <div className="md:hidden px-6 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white h-14 pl-12 pr-4 rounded-xl border border-slate-100 outline-none text-slate-600 placeholder:text-slate-300 focus:ring-2 focus:ring-slate-100 transition-all"
          />
        </div>
      </div>

      {/* MAIN CONTENT Area */}
      <div className="px-6 md:px-10 pb-32">
        {/* MOBILE LAYOUT: Sections with Carousels */}
        <div className="md:hidden space-y-10">
          {/* Featured Carousel with Auto-Scroll */}
          {data.featured.length > 0 && (
            <div className="relative">
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {data.featured.map((event, index) => (
                    <div
                      key={event.id}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <div
                        onClick={() => setSelectedEvent(event)}
                        className="relative w-full h-52 rounded-3xl overflow-hidden group cursor-pointer border border-green-200"
                      >
                        <img src={event.image_url} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <button onClick={(e) => handleCalendarSync(e, event)} className="bg-white/90 backdrop-blur-sm rounded-xl p-2 text-green-600 hover:text-green-700 transition-colors">
                            <BellPlus size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">{event.category}</span>
                            <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                              <Calendar size={10} />
                              <span>{new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-white leading-tight">{event.title}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Indicators with Animation */}
              {data.featured.length > 1 && (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <div className="flex gap-2">
                    {data.featured.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === currentSlide
                          ? 'w-8 bg-green-500'
                          : 'w-2 bg-gray-300'
                          }`}
                      />
                    ))}
                  </div>

                  <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{
                        duration: 5,
                        ease: 'linear',
                        repeat: Infinity
                      }}
                      key={currentSlide}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* For You Section */}
          <div>
            {data.forYou.length > 0 ? (
              <>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">For You</h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                  {data.forYou.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="w-72 bg-white rounded-3xl p-5 border border-slate-100 shrink-0 flex flex-col justify-between h-44 group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${event.event_interests?.color?.replace('bg-', 'text-') || 'text-yellow-500'} bg-opacity-10 bg-current`}>
                          <Ticket size={28} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-800 text-base leading-tight truncate mb-1">{event.title}</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1 text-slate-400 text-[10px] truncate max-w-[120px]">
                          <MapPin size={10} />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => handleToggleLike(e, event.id)}
                            className={`${event.is_liked ? 'text-red-500 bg-red-50' : 'text-slate-300 bg-slate-50'} p-2 rounded-full transition-all active:scale-90`}
                          >
                            <Heart size={14} fill={event.is_liked ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white rounded-[2rem] p-8 border border-slate-100 overflow-hidden text-center group"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-12 bg-slate-100 flex items-end justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-200 -mb-1" />
                </div>

                <div className="mt-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-100 group-hover:scale-110 transition-transform">
                    <LayoutGrid size={28} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">No Interests Yet?</h3>
                  <p className="text-sm text-slate-400 mb-6 px-4">Personalize your calendar and discover events that matter to you.</p>
                  <Link
                    href="/events/onboarding"
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-colors active:scale-95"
                  >
                    Choose Your Interests
                    <X size={16} className="rotate-180" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Nearby List */}
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Nearby Events</h2>
            <div className="space-y-4">
              {data.nearby.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white rounded-[2rem] p-4 border border-slate-100 flex gap-4 items-center group active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate mb-1">{event.title}</h3>
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <MapPin size={10} className="text-slate-300" />
                      <span className="truncate">{event.location}</span>
                      <span className="mx-1">•</span>
                      <Calendar size={10} className="text-slate-300" />
                      <span>{new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleToggleLike(e, event.id)}
                    className={`${event.is_liked ? 'text-red-500 bg-red-50 border-red-100' : 'text-slate-300 bg-slate-50 border-slate-100'} p-3 rounded-full border transition-all active:scale-90`}
                  >
                    <Heart size={16} fill={event.is_liked ? "currentColor" : "none"} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT: Bento Grid */}
        <div className="hidden md:grid grid-cols-4 gap-6 auto-rows-[240px]">
          {showAllEvents ? (
            <>
              {[...data.featured, ...data.forYou, ...data.nearby].map((event, idx) => {
                const spanClass = idx === 0 ? 'col-span-2 row-span-2' : idx % 5 === 0 ? 'col-span-2' : 'col-span-1';
                const isBig = idx === 0 || idx % 5 === 0;

                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`${spanClass} relative rounded-[40px] overflow-hidden group border border-slate-100 cursor-pointer hover:border-green-500 transition-all`}
                  >
                    {isBig ? (
                      <>
                        <img src={event.image_url} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-6 left-6 flex gap-2">
                          <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">{event.category}</span>
                          <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase">
                            <Calendar size={10} />
                            <span>{new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <h3 className="text-2xl font-black text-white leading-tight mb-3">{event.title}</h3>
                          <div className="flex items-center gap-2 text-white/90 text-sm">
                            <MapPin size={14} />
                            <span className="font-bold uppercase tracking-wide">{event.location}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-white p-6 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${event.event_interests?.color?.replace('bg-', 'text-') || 'text-green-500'} bg-opacity-10 bg-current`}>
                            <Ticket size={24} />
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleLike(e, event.id); }}
                            className={`${event.is_liked ? 'text-red-500' : 'text-slate-300'} p-2 hover:scale-110 transition-transform`}
                          >
                            <Heart size={16} fill={event.is_liked ? "currentColor" : "none"} />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 line-clamp-2">{event.title}</h3>
                          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-1">
                              <MapPin size={10} />
                              <span className="truncate max-w-[80px]">{event.location}</span>
                            </div>
                            <span>•</span>
                            <span>{new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Reset View Card */}
              <div
                onClick={() => setShowAllEvents(false)}
                className="bg-slate-900 rounded-[40px] p-8 flex flex-col justify-center items-center text-center transition-all cursor-pointer group active:scale-95 hover:bg-slate-800"
              >
                <div className="w-16 h-16 rounded-[2rem] bg-white/10 flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 group-hover:scale-110">
                  <LayoutGrid size={32} className="text-white" />
                </div>
                <h3 className="text-white font-black text-xl uppercase tracking-tighter">Show Categories</h3>
                <p className="text-white/40 text-xs font-bold mt-2 uppercase tracking-[0.2em]">Go Back</p>
              </div>
            </>
          ) : (
            <>
              {/* Category Sections - Original Categorized View */}
              {/* Hero / Big Featured Card */}
              {data.featured[0] && (
                <div
                  onClick={() => setSelectedEvent(data.featured[0])}
                  className="col-span-2 row-span-2 relative rounded-[40px] overflow-hidden group border border-slate-100 cursor-pointer"
                >
                  <img src={data.featured[0].image_url} alt={data.featured[0].title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute top-8 left-8 flex gap-3">
                    <span className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-black rounded-xl uppercase tracking-[0.2em]">Featured</span>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-xl uppercase tracking-wider">
                      <Calendar size={12} />
                      <span>{new Date(data.featured[0].event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <h3 className="text-4xl font-black text-white leading-tight mb-4">{data.featured[0].title}</h3>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-white/90">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                          <MapPin size={16} />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest">{data.featured[0].location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Medium Card - First 'For You' */}
              {data.forYou.length > 0 && (
                (() => {
                  const event = data.forYou[0];
                  return (
                    <div
                      onClick={() => setSelectedEvent(event)}
                      className="col-span-2 relative rounded-[40px] overflow-hidden group bg-white border border-slate-100 cursor-pointer"
                    >
                      <img src={event.image_url} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-[9px] font-bold rounded-lg uppercase tracking-wider mb-2 w-fit">
                          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                          {(event.like_count || 0) >= 5 ? 'Trending' : 'For You'}
                        </div>
                        <h3 className="text-2xl font-black text-white leading-tight">{event.title}</h3>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Regular Bento Cards */}
              {data.nearby.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="relative rounded-[40px] overflow-hidden group bg-white p-6 flex flex-col justify-between transition-all border border-slate-100 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${event.event_interests?.color?.replace('bg-', 'text-') || 'text-yellow-500'} bg-opacity-10 bg-current`}>
                      <Ticket size={24} />
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleLike(e, event.id); }}
                      className={`${event.is_liked ? 'text-red-500' : 'text-slate-300'} p-2 hover:scale-110 transition-transform`}
                    >
                      <Heart size={18} fill={event.is_liked ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 line-clamp-2">{event.title}</h3>
                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-1">
                        <MapPin size={10} />
                        <span className="truncate max-w-[80px]">{event.location}</span>
                      </div>
                      <span>•</span>
                      <span>{new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* View All / Stats placeholder */}
              <div
                onClick={() => setShowAllEvents(true)}
                className="bg-slate-900 rounded-[40px] p-8 flex flex-col justify-center items-center text-center transition-all cursor-pointer group active:scale-95 hover:bg-slate-800"
              >
                <div className="w-16 h-16 rounded-[2rem] bg-white/10 flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 group-hover:scale-110">
                  <LayoutGrid size={32} className="text-white" />
                </div>
                <h3 className="text-white font-black text-xl uppercase tracking-tighter">View All Events</h3>
                <p className="text-white/40 text-xs font-bold mt-2 uppercase tracking-[0.2em]">{data.nearby.length + data.forYou.length + data.featured.length} TOTAL</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* EVENT DETAIL MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Modal / Drawer */}
            <motion.div
              initial={typeof window !== 'undefined' && window.innerWidth < 768 ? { y: '-100%' } : { opacity: 0, scale: 0.9, y: 20 }}
              animate={typeof window !== 'undefined' && window.innerWidth < 768 ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={typeof window !== 'undefined' && window.innerWidth < 768 ? { y: '-100%' } : { opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`
                fixed z-[70] bg-white 
                ${typeof window !== 'undefined' && window.innerWidth < 768
                  ? 'top-0 left-0 right-0 h-screen overflow-y-auto'
                  : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl rounded-[3rem] overflow-hidden'
                }
              `}
            >
              {/* Image Header */}
              <div className="relative h-64 md:h-80">
                <img src={selectedEvent.image_url} alt={selectedEvent.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* MODERN MINIMAL CLOSE BUTTON */}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-8 right-8 w-12 h-12 bg-white flex items-center justify-center rounded-full text-slate-900 transition-all active:scale-95 group"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider mb-2 inline-block">
                    {selectedEvent.category}
                  </span>
                  <h2 className="text-3xl font-black leading-tight tracking-tight">{selectedEvent.title}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10 space-y-8">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-3 text-slate-600 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 font-bold text-xs uppercase tracking-wider">
                    <Calendar size={18} className="text-red-500" />
                    <span>{new Date(selectedEvent.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 font-bold text-xs uppercase tracking-wider">
                    <MapPin size={18} className="text-red-500" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 font-bold text-xs uppercase tracking-wider">
                    <Clock size={18} className="text-red-500" />
                    <span>9:00 AM - 4:00 PM</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">About this event</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{selectedEvent.description}</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={(e) => handleCalendarSync(e, selectedEvent)}
                    className="flex-1 bg-slate-900 text-white p-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95"
                  >
                    <BellPlus size={20} />
                    Sync to Calendar
                  </button>
                  <button
                    onClick={(e) => handleToggleLike(e, selectedEvent.id)}
                    className={`p-5 rounded-[2rem] border transition-all ${selectedEvent.is_liked ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                  >
                    <Heart size={24} fill={selectedEvent.is_liked ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div >
  );
}
