"use client";

import {
    Video, Calendar, Plus, Link as LinkIcon, ArrowRight, Share2, Copy, Check,
    Settings, HelpCircle, MessageSquare, Grid, User, Info, AlertCircle,
    FileText, PlayCircle, X, Flag, Lightbulb, UserPlus, Loader2, Layout, LogOut
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCurrentProfile } from "@/utils/auth/schoolAuth";

// Simple Tooltip Component
const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div className="relative flex items-center" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#3c4043] text-white text-[11px] rounded whitespace-nowrap z-[100] pointer-events-none"
                    >
                        {text}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Profile Dropdown Component
const ProfileDropdown = ({ profile }: { profile: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        const { logout } = await import("@/utils/auth/schoolAuth");
        await logout();
        window.location.reload();
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile) return;

        try {
            const { supabase } = await import("@/app/lib/supabase");
            const fileExt = file.name.split('.').pop();
            const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload image to 'applications' bucket (reusing existing bucket for simplicity)
            const { error: uploadError } = await supabase.storage
                .from('applications')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('applications')
                .getPublicUrl(filePath);

            // Update profile
            const { error: updateError } = await supabase
                .from('school_profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', profile.id);

            if (updateError) throw updateError;

            window.location.reload(); // Refresh to see changes
        } catch (err: any) {
            console.error('Avatar upload failed:', err);
            alert('Failed to upload avatar: ' + err.message);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Tooltip text={profile ? "Account" : "Guest Mode"}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white shadow-sm overflow-hidden border border-gray-200 cursor-pointer hover:ring-blue-100 transition-all"
                >
                    {profile?.avatar_url ? (
                        <Image src={profile.avatar_url} alt="Profile" width={40} height={40} className="object-cover w-full h-full" />
                    ) : profile ? (
                        profile?.full_name?.charAt(0)
                    ) : (
                        <User size={20} />
                    )}
                </button>
            </Tooltip>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl py-4 z-[100]"
                    >
                        {profile ? (
                            <>
                                <div className="px-6 py-4 border-b border-gray-50 text-center relative group/avatar">
                                    <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-inner overflow-hidden border-2 border-white relative">
                                        {profile.avatar_url ? (
                                            <Image src={profile.avatar_url} alt="Profile" width={80} height={80} className="object-cover w-full h-full" />
                                        ) : (
                                            profile.full_name?.charAt(0)
                                        )}
                                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <Plus size={24} className="text-white" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                        </label>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">{profile.full_name}</h3>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mt-1">{profile.role}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">{profile.school_id}</p>
                                </div>
                                <div className="py-2">
                                    <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-sm text-gray-700 font-medium transition-colors">
                                        <Settings size={18} className="text-gray-400" />
                                        Manage Account
                                    </button>
                                    {profile.role === 'admin' && (
                                        <Link href="/admin/dashboard" className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-sm text-gray-700 font-medium transition-colors">
                                            <Layout size={18} className="text-gray-400" />
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-sm text-red-600 font-semibold transition-colors mt-2"
                                    >
                                        <LogOut size={18} />
                                        Sign out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="px-6 py-6 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
                                    <User size={32} />
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">Guest Mode</h3>
                                <p className="text-gray-500 text-sm mt-2 mb-6">Sign in to save your meeting history and customize your profile.</p>
                                <button
                                    onClick={() => router.push("/student/login")}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-bold transition-all"
                                >
                                    Sign in
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function OnboardingPage() {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [meetingUrl, setMeetingUrl] = useState("");
    const [meetingId, setMeetingId] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showMeetingReadyModal, setShowMeetingReadyModal] = useState(false);

    // Dropdown/Modal States
    const [showNewMeetingDropdown, setShowNewMeetingDropdown] = useState(false);
    const [showSupportDropdown, setShowSupportDropdown] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<{ full_name?: string } | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const supportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsClient(true);
        const timer = setInterval(() => setTime(new Date()), 1000);

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNewMeetingDropdown(false);
            }
            if (supportRef.current && !supportRef.current.contains(event.target as Node)) {
                setShowSupportDropdown(false);
            }
        };

        const loadProfile = async () => {
            const p = await getCurrentProfile();
            setProfile(p);
        };
        loadProfile();

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            clearInterval(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Create a meeting for later - shows meeting link modal
    const createMeetingForLater = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/daily/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            });
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/academics/e-learning/join/${data.name}`;
            setMeetingId(data.name);
            setMeetingUrl(url);
            setShowNewMeetingDropdown(false);
            setShowMeetingReadyModal(true);
        } catch (error) {
            const err = error as Error;
            console.error('Failed to create meeting:', err);

            // Try to extract more details if it's a JSON response error
            let detailedMessage = err.message;
            alert(`Error: ${detailedMessage}\n\nPlease ensure you have applied the latest SQL migration for RLS policies.`);
        } finally {
            setIsLoading(false);
        }
    };

    // Start instant meeting - goes directly to lobby
    const startInstantMeeting = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/daily/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            });
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setShowNewMeetingDropdown(false);
            router.push(`/academics/e-learning/join/${data.name}`);
        } catch (error) {
            const err = error as Error;
            console.error('Failed to start meeting:', err);
            alert(`Error: ${err.message}\n\nPlease check the console for details.`);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(meetingUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const joinMeetingWithCode = () => {
        if (joinCode.trim()) {
            router.push(`/academics/e-learning/join/${joinCode.trim()}`);
        }
    };

    const scheduleInGoogleCalendar = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/daily/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    meeting_type: 'scheduled',
                    title: 'Scheduled Class'
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            const meetUrl = `${window.location.origin}/academics/e-learning/join/${data.name}`;
            const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
            const text = encodeURIComponent("Kawempe Live Class");
            const details = encodeURIComponent(`Join the virtual classroom:\n${meetUrl}`);
            window.open(`${baseUrl}&text=${text}&details=${details}`, "_blank");
            setShowNewMeetingDropdown(false);
        } catch (error) {
            const err = error as Error;
            console.error('Failed to schedule meeting:', err);
            alert('Failed to create a valid meeting link for scheduling.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-white text-[#3c4043] font-sans selection:bg-blue-100">
            {/* Top Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <Video className="text-blue-500" size={24} />
                        </div>
                        <span className="text-xl font-medium tracking-tight text-[#5f6368]">Kawempe <span className="font-bold text-[#3c4043]">Meet</span></span>
                    </Link>
                </div>

                <div className="flex items-center gap-1">
                    <div className="hidden md:flex items-center gap-2 text-[#5f6368] font-normal mr-4 text-base">
                        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <span>{time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>

                    <div className="relative" ref={supportRef}>
                        <Tooltip text="Support">
                            <button
                                onClick={() => setShowSupportDropdown(!showSupportDropdown)}
                                className={`p-2.5 rounded-full hover:bg-gray-100 text-[#5f6368] transition-colors ${showSupportDropdown ? 'bg-gray-100' : ''}`}
                            >
                                <HelpCircle size={22} />
                            </button>
                        </Tooltip>

                        <AnimatePresence>
                            {showSupportDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[60]"
                                >
                                    {[
                                        { icon: <HelpCircle size={18} />, text: "Help" },
                                        { icon: <PlayCircle size={18} />, text: "Training" },
                                        { icon: <FileText size={18} />, text: "Terms of Service" },
                                        { icon: <Info size={18} />, text: "Privacy Policy" },
                                        { icon: <AlertCircle size={18} />, text: "Terms summary" },
                                    ].map((item, idx) => (
                                        <button key={idx} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-[#3c4043] transition-colors text-left">
                                            <span className="text-[#5f6368]">{item.icon}</span>
                                            {item.text}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Tooltip text="Report a problem">
                        <button
                            onClick={() => setShowFeedbackModal(true)}
                            className={`p-2.5 rounded-full hover:bg-gray-100 text-[#5f6368] transition-colors ${showFeedbackModal ? 'bg-gray-100' : ''}`}
                        >
                            <MessageSquare size={22} />
                        </button>
                    </Tooltip>

                    <Tooltip text="Settings">
                        <button className="p-2.5 rounded-full hover:bg-gray-100 text-[#5f6368] transition-colors">
                            <Settings size={22} />
                        </button>
                    </Tooltip>

                    <div className="ml-2 flex items-center gap-1">
                        <ProfileDropdown profile={profile} />
                    </div>
                </div>
            </header>

            {/* Sidebar Navigation */}
            <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-100 hidden lg:block p-4">
                <nav className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium transition-colors group">
                        <Calendar size={20} className="text-blue-600" />
                        <span>Classes</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[#5f6368] hover:bg-gray-50 rounded-lg font-medium transition-colors group">
                        <Video size={20} />
                        <span>Calls</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="lg:pl-64 pt-16 min-h-screen flex flex-col">
                <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side: Interaction */}
                    <div className="max-w-xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-[44px] leading-[52px] font-normal text-[#1f1f1f] mb-4"
                        >
                            Video calls and meetings for everyone
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-lg text-[#5f6368] mb-10 leading-relaxed max-w-lg font-light"
                        >
                            Connect, collaborate, and celebrate from anywhere with Google Meet
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center gap-4 mb-8"
                        >
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowNewMeetingDropdown(!showNewMeetingDropdown)}
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1a73e8] hover:bg-blue-700 text-white rounded-[4px] font-medium transition-all shadow-sm w-full sm:w-auto disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Video size={20} />
                                    )}
                                    {isLoading ? 'Creating...' : 'New meeting'}
                                </button>

                                <AnimatePresence>
                                    {showNewMeetingDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[60]"
                                        >
                                            <button
                                                onClick={createMeetingForLater}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-[#3c4043] transition-colors text-left"
                                            >
                                                <LinkIcon size={18} className="text-[#5f6368]" />
                                                Create a meeting for later
                                            </button>
                                            <button
                                                onClick={startInstantMeeting}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-[#3c4043] transition-colors text-left"
                                            >
                                                <Plus size={18} className="text-[#5f6368]" />
                                                Start an instant meeting
                                            </button>
                                            <button
                                                onClick={scheduleInGoogleCalendar}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-[#3c4043] transition-colors text-left"
                                            >
                                                <Calendar size={18} className="text-[#5f6368]" />
                                                Schedule in Google Calendar
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="relative flex-1 w-full sm:w-[280px] group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5f6368] group-focus-within:text-blue-600 transition-colors">
                                    <Grid size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter a code or link"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && joinMeetingWithCode()}
                                    className="w-full pl-10 pr-16 py-3.5 bg-white border border-gray-300 rounded-[4px] text-[#3c4043] placeholder:text-[#5f6368] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-light"
                                />
                                <button
                                    onClick={joinMeetingWithCode}
                                    disabled={!joinCode}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 font-medium text-sm px-4 py-1.5 rounded transition-colors ${joinCode ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 cursor-not-allowed'}`}
                                >
                                    Join
                                </button>
                            </div>
                        </motion.div>

                        <div className="h-px bg-gray-200 w-full mb-12" />

                        <div className="flex items-center gap-3">
                            <Link href="/academics/e-learning" className="text-blue-600 hover:underline font-medium">Learn more</Link>
                            <span className="text-gray-400">about Kawempe Live</span>
                        </div>
                    </div>

                    {/* Right Side: Visuals */}
                    <div className="relative flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            {meetingUrl ? (
                                <motion.div
                                    key="link-panel"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
                                >
                                    <div className="p-8 text-center bg-blue-50">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4 shadow-sm">
                                            <Check size={32} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-[#1f1f1f] mb-2">Classroom ready</h2>
                                        <p className="text-[#5f6368]">Your session link is ready to share</p>
                                    </div>
                                    <div className="p-8">
                                        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between gap-4 mb-6 border border-gray-100">
                                            <span className="text-sm font-medium text-[#3c4043] truncate">{meetingUrl}</span>
                                            <button
                                                onClick={copyToClipboard}
                                                className="p-2 hover:bg-gray-200 rounded-full transition-colors relative"
                                            >
                                                {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-[#5f6368]" />}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Link
                                                href={meetingUrl}
                                                className="flex items-center justify-center gap-2 py-3 bg-[#1a73e8] hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                            >
                                                Enter Class
                                            </Link>
                                            <button className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-[#3c4043] rounded-lg font-medium transition-colors">
                                                <Share2 size={18} />
                                                Invite
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setMeetingUrl("")}
                                            className="w-full mt-4 text-sm text-[#5f6368] hover:text-[#3c4043] py-2 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="illustration"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center text-center space-y-8"
                                >
                                    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                                        <div className="absolute inset-0 bg-blue-50 rounded-full scale-90 blur-3xl opacity-50" />
                                        {/* Mock Illustration with Framer Motion */}
                                        <svg viewBox="0 0 400 400" className="w-full h-full relative z-10">
                                            <circle cx="200" cy="200" r="160" fill="#e8f0fe" />
                                            <motion.rect
                                                initial={{ y: 20 }}
                                                animate={{ y: 0 }}
                                                transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }}
                                                x="120" y="150" width="160" height="100" rx="8" fill="#fff"
                                                style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
                                            />
                                            <rect x="140" y="170" width="120" height="10" rx="4" fill="#d2e3fc" />
                                            <rect x="140" y="190" width="80" height="10" rx="4" fill="#d2e3fc" />
                                            <circle cx="300" cy="150" r="30" fill="#1a73e8" />
                                            <path d="M290 150l10 10 20-20" stroke="#fff" strokeWidth="4" fill="none" />
                                            <motion.circle
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ repeat: Infinity, duration: 4 }}
                                                cx="100" cy="280" r="40" fill="#fbbc04" opacity="0.8"
                                            />
                                            <motion.circle
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 5 }}
                                                cx="320" cy="300" r="50" fill="#34a853" opacity="0.6"
                                            />
                                        </svg>
                                    </div>
                                    <div className="max-w-sm">
                                        <h3 className="text-2xl font-normal text-[#1f1f1f] mb-2">Get a link you can share</h3>
                                        <p className="text-[#5f6368]">Click <span className="font-bold">New Classroom</span> to get a link you can send to people you want to learn with</p>

                                        <div className="mt-8 flex items-center justify-center gap-2">
                                            <button className="w-3 h-3 rounded-full bg-blue-600" />
                                            <button className="w-3 h-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" />
                                            <button className="w-3 h-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Section (Minimal) */}
                <div className="max-w-7xl mx-auto w-full px-6 py-10 flex flex-col sm:flex-row items-center justify-between border-t border-gray-50 gap-4 mt-auto">
                    <div className="text-sm text-[#5f6368] font-light">
                        &copy; {new Date().getFullYear()} Kawempe Muslim Secondary School
                    </div>
                    <div className="flex items-center gap-8">
                        <Link href="/privacy" className="text-sm text-[#5f6368] hover:text-[#1a73e8] transition-colors font-light">Privacy</Link>
                        <Link href="/terms" className="text-sm text-[#5f6368] hover:text-[#1a73e8] transition-colors font-light">Terms</Link>
                        <Link href="/help" className="text-sm text-[#5f6368] hover:text-[#1a73e8] transition-colors font-light">Help Center</Link>
                    </div>
                </div>
            </main>

            {/* Feedback Modal (Dark Themed as per reference) */}
            <AnimatePresence>
                {showFeedbackModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-end justify-end p-0 sm:p-6 pointer-events-none"
                    >
                        <motion.div
                            initial={{ x: 400 }}
                            animate={{ x: 0 }}
                            exit={{ x: 400 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="w-full sm:w-[400px] h-full sm:h-auto bg-[#202124] text-white shadow-2xl sm:rounded-tl-2xl flex flex-col pointer-events-auto"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                                <span className="font-normal text-base">Send feedback to Google</span>
                                <button onClick={() => setShowFeedbackModal(false)} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 flex flex-col items-center text-center">
                                <div className="mb-8 relative w-48 h-32 bg-[#2d2e31] rounded-2xl flex items-center justify-center overflow-hidden">
                                    <svg viewBox="0 0 100 60" className="w-full h-full opacity-80">
                                        <circle cx="50" cy="30" r="25" fill="#3c4043" />
                                        <rect x="40" y="20" width="20" height="20" rx="4" fill="#1a73e8" />
                                    </svg>
                                </div>

                                <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-800 rounded-xl transition-colors mb-2 text-left group">
                                    <div className="p-2 bg-[#3c4043] rounded-full group-hover:bg-[#1a73e8] transition-colors">
                                        <Flag size={18} />
                                    </div>
                                    <span className="flex-1 font-light">Report an issue</span>
                                    <ArrowRight size={16} className="text-gray-500" />
                                </button>

                                <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-800 rounded-xl transition-colors text-left group">
                                    <div className="p-2 bg-[#3c4043] rounded-full group-hover:bg-[#1a73e8] transition-colors">
                                        <Lightbulb size={18} />
                                    </div>
                                    <span className="flex-1 font-light">Suggest an idea</span>
                                    <ArrowRight size={16} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="mt-auto p-4 border-t border-gray-700 bg-[#3c4043]/30">
                                <p className="text-[11px] text-gray-500 leading-relaxed">
                                    Your feedback will be used to help improve Kawempe Live. We may contact you for more information about your feedback.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Meeting Ready Modal (when creating meeting for later) */}
            <AnimatePresence>
                {showMeetingReadyModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setShowMeetingReadyModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-normal text-[#202124]">Your meeting&apos;s ready</h2>
                                    <button
                                        onClick={() => setShowMeetingReadyModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-[#5f6368]" />
                                    </button>
                                </div>

                                {/* Add Others Button */}
                                <button
                                    onClick={() => {
                                        setShowMeetingReadyModal(false);
                                        router.push(`/academics/e-learning/join/${meetingId}`);
                                    }}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-full font-medium mb-6 transition-colors"
                                >
                                    <UserPlus size={18} />
                                    Add others
                                </button>

                                {/* Meeting Link Section */}
                                <p className="text-sm text-[#5f6368] mb-3">
                                    Or share this meeting link with others you want in the meeting
                                </p>

                                <div className="flex items-center gap-2 p-3 bg-[#f1f3f4] rounded-lg mb-4">
                                    <span className="flex-1 text-sm text-[#3c4043] truncate font-medium">
                                        {meetingUrl.replace('https://', '').replace('http://', '')}
                                    </span>
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-2 hover:bg-white rounded-lg transition-colors"
                                    >
                                        {copied ? (
                                            <Check size={18} className="text-green-600" />
                                        ) : (
                                            <Copy size={18} className="text-[#5f6368]" />
                                        )}
                                    </button>
                                </div>

                                {/* Security Notice */}
                                <div className="flex items-start gap-3 p-3 bg-[#e8f0fe] rounded-lg">
                                    <div className="w-8 h-8 bg-[#1a73e8] rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#3c4043]">
                                            People who use this meeting link must get your permission before they can join.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
