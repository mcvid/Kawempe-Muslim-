"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"; // Retained as it's used later
import Link from "next/link"; // Retained as it's used later
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
    Users, MoreVertical, MonitorUp, Smile, Send, Info,
    Share2, Settings, Hand, UserCircle, LogOut, ScreenShare, Loader2,
    X, Paperclip
} from "lucide-react";
import { getDailyManager } from "@/utils/daily/client";
import type { DailyParticipant } from "@daily-co/daily-js";
import { createClient } from "@/utils/supabase/client";
import { getCurrentProfile } from "@/utils/auth/schoolAuth";
import SettingsModal from "@/app/components/e-learning/SettingsModal";
import { getVideoSettings, UserProfile } from "@/app/utils/e-learning/userPreferences";


/**
 * Component to render a participant's video/audio
 */
interface DailyVideoProps {
    participant: DailyParticipant;
    videoStyle?: string;
}

function DailyVideo({ participant, videoStyle = "" }: DailyVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoTrack = participant?.tracks?.video?.persistentTrack;
    const audioTrack = participant?.tracks?.audio?.persistentTrack;
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!participant) return;

        if (videoRef.current && participant.videoTrack) {
            videoRef.current.srcObject = new MediaStream([participant.videoTrack]);
        }

        if (audioRef.current && participant.audioTrack && !participant.local) {
            audioRef.current.srcObject = new MediaStream([participant.audioTrack]);
            audioRef.current.play().catch(e => console.error('Audio play failed:', e));
        }
    }, [participant]);

    if (!participant) return null;

    return (
        <div className="w-full h-full relative">
            {participant.video ? (
                <video
                    ref={videoRef}
                    autoPlay
                    muted={participant.local}
                    playsInline
                    style={{ filter: videoStyle }}
                    className={`w-full h-full object-cover ${participant.local ? 'transform -scale-x-100' : ''}`}
                />
            ) : (
                <div className="w-full h-full bg-[#1e293b] flex items-center justify-center">
                    <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl overflow-hidden">
                        {(participant.userData as any)?.avatar_url ? (
                            <Image src={(participant.userData as any).avatar_url} alt={participant.user_name} width={128} height={128} className="object-cover w-full h-full" />
                        ) : (
                            participant.user_name?.charAt(0).toUpperCase() || '?'
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ClassroomPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const meetingId = params.id as string;

    // Meeting states
    const [micOn, setMicOn] = useState(searchParams.get('mic') !== 'false');
    const [videoOn, setVideoOn] = useState(searchParams.get('camera') !== 'false');
    const [showChat, setShowChat] = useState(false);
    const [activeTab, setActiveTab] = useState<"chat" | "participants" | "info">("chat");
    const [message, setMessage] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [roomNotFound, setRoomNotFound] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [videoFilterStyle, setVideoFilterStyle] = useState("");

    // Daily.co states
    const [participants, setParticipants] = useState<{ [id: string]: DailyParticipant }>({});
    const [callObject, setCallObject] = useState<any>(null);
    const [isSharing, setIsSharing] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [chatMessages, setChatMessages] = useState<any[]>([]);

    const sendMessage = (text: string) => {
        if (!callObject || !text.trim()) return;

        const displayName = searchParams.get('name') || profile?.full_name || 'Guest';
        const msg = {
            message: text,
            sender: displayName,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        callObject.sendAppMessage({ type: 'chat', data: msg });
        setChatMessages(prev => [...prev, msg]); // Add local message
        setMessage("");
    };

    // Auth & Profile state
    const [profile, setProfile] = useState<any>(null);
    const isHost = profile && (profile.role === 'teacher' || profile.role === 'admin');

    // Load video settings and apply filters
    useEffect(() => {
        const settings = getVideoSettings();
        const filters = [
            `brightness(${100 + settings.brightness}%)`,
            `contrast(${settings.contrast}%)`,
            `saturate(${settings.saturation}%)`
        ];
        setVideoFilterStyle(filters.join(' '));
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleScreenShare = async () => {
        if (!callObject) return;
        try {
            const isLocalSharing = !!callObject.participants().local.screen;
            if (isLocalSharing) {
                await callObject.stopScreenShare();
                setIsSharing(false);
            } else {
                await callObject.startScreenShare();
                setIsSharing(true);
            }
        } catch (error: any) {
            console.error('ScreenShare error:', error);
            const msg = error.name === 'NotReadableError'
                ? 'Could not start screen share. Please check browser permissions or if another app is using your screen.'
                : `Screen share failed: ${error.message}`;
            alert(msg);
        }
    };

    const toggleHand = () => {
        if (!callObject) return;
        const isRaised = !!(callObject.participants().local.userData as any)?.handRaised;
        callObject.setUserData({ handRaised: !isRaised });
    };

    const copyMeetingLink = () => {
        const url = `${window.location.origin}/academics/e-learning/join/${meetingId}`;
        navigator.clipboard.writeText(url);
        alert('Meeting link copied to clipboard!');
    };

    // Removed muteAllParticipants - keeping collaborative environment

    useEffect(() => {
        setIsClient(true);

        // Helper: Promise with timeout
        const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number, errorMsg: string): Promise<T> => {
            return Promise.race([
                promise,
                new Promise<T>((_, reject) => 
                    setTimeout(() => reject(new Error(errorMsg)), timeoutMs)
                )
            ]);
        };

        // Initialize Daily.co with optimized loading
        const initMeeting = async () => {
            try {
                // Parallel: Load profile while fetching room data
                const [profileData, roomResponse] = await Promise.all([
                    getCurrentProfile(),
                    withTimeout(
                        fetch(`/api/daily/room?name=${encodeURIComponent(meetingId)}`),
                        20000,
                        'Room fetch timeout - please check your connection'
                    )
                ]);
                
                setProfile(profileData);

                const meetingData = await roomResponse.json();

                if (!roomResponse.ok || !meetingData || !meetingData.room_url) {
                    console.error('Room not found or invalid response for ID:', meetingId);
                    setRoomNotFound(true);
                    return;
                }

                const manager = getDailyManager();
                const displayName = searchParams.get('name') || profileData?.full_name || "Guest";

                // Join call with timeout (20 seconds max)
                const call = await withTimeout(
                    manager.join(meetingData.room_url, {
                        userName: displayName,
                        audioSource: micOn,
                        videoSource: videoOn
                    }),
                    20000,
                    'Connection timeout - unable to join meeting'
                );

                if (call) {
                    await call.setUserData({
                        avatar_url: profileData?.avatar_url,
                        role: profileData?.role || 'guest'
                    });
                }

                setCallObject(call);

                // Event handlers
                const handleParticipants = () => {
                    if (call) {
                        setParticipants(call.participants());
                    }
                };

                call.on('participant-joined', handleParticipants);
                call.on('participant-updated', handleParticipants);
                call.on('participant-left', handleParticipants);
                call.on('app-message', (ev: any) => {
                    const eventData = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data;

                    if (eventData?.type === 'chat') {
                        setChatMessages(prev => [...prev, eventData.data]);
                    }
                });
                call.on('error', (e: any) => {
                    console.error('Daily error:', e);
                    setConnectionError(e.errorMsg || 'Connection error occurred');
                });

                // Initial state
                handleParticipants();

                return () => {
                    call.off('participant-joined', handleParticipants);
                    call.off('participant-updated', handleParticipants);
                    call.off('participant-left', handleParticipants);
                    manager.leave();
                };
            } catch (err: any) {
                console.error('Meeting init failed:', err);
                setConnectionError(err.message || 'Failed to connect to meeting');
            }
        };

        if (meetingId) {
            initMeeting();
        }
    }, [meetingId]);

    // Handle Mic/Video Toggle
    const toggleMic = () => {
        const newState = !micOn;
        setMicOn(newState);
        if (callObject) callObject.setLocalAudio(newState);
    };

    const toggleVideo = () => {
        const newState = !videoOn;
        setVideoOn(newState);
        if (callObject) callObject.setLocalVideo(newState);
    };

    if (!isClient) return null;

    if (roomNotFound || connectionError) {
        return (
            <div className="h-screen bg-[#202124] flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <h1 className="text-4xl font-bold mb-4 text-white uppercase italic tracking-tighter">
                        {roomNotFound ? 'Meeting not found' : 'Connection failed'}
                    </h1>
                    <p className="text-[#9aa0a6] mb-8">
                        {roomNotFound 
                            ? 'This meeting link is invalid or has expired.'
                            : connectionError || 'Unable to connect to the meeting. Please check your internet connection and try again.'
                        }
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold uppercase italic tracking-wider transition-colors"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => router.push('/academics/e-learning/onboarding')}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase italic tracking-wider transition-colors"
                        >
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const allParticipants = Object.values(participants);
    const localParticipant = allParticipants.find(p => p.local);
    const remoteParticipants = allParticipants.filter(p => !p.local);

    // Logic to select main speaker (e.g. active speaker or teacher)
    const mainParticipant = remoteParticipants.length > 0 ? remoteParticipants[0] : localParticipant;
    const remainingParticipants = allParticipants.filter(p => p.session_id !== mainParticipant?.session_id);

    return (
        <div className="flex h-screen bg-[#202124] text-white font-sans selection:bg-blue-500/30 overflow-hidden relative">
            {/* Main Classroom Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Video Grid */}
                <div className="flex-1 p-4 relative overflow-y-auto no-scrollbar flex items-center justify-center">
                    <div className={`grid gap-4 w-full h-full max-w-[1400px] mx-auto ${allParticipants.length <= 1 ? 'grid-cols-1' :
                        allParticipants.length <= 2 ? 'grid-cols-1 md:grid-cols-2' :
                            allParticipants.length <= 4 ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-2' :
                                'grid-cols-2 md:grid-cols-3'
                        }`}>
                        {allParticipants.map((p) => (
                            <div
                                key={p.session_id}
                                className="bg-[#3c4043] rounded-xl overflow-hidden relative group aspect-video shadow-lg"
                            >
                                <DailyVideo participant={p} videoStyle={videoFilterStyle} />

                                {/* Name Overlay */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/5">
                                    {(p.userData as any)?.handRaised && <Hand size={14} className="text-yellow-400 fill-yellow-400" />}
                                    {!p.audio && <MicOff size={14} className="text-red-400" />}
                                    <span className="text-sm font-medium">
                                        {p.user_name || 'Connecting...'} {p.local ? '(You)' : ''}
                                    </span>
                                </div>

                                {/* Active Speaker Border */}
                                {p.audio && (
                                    <div className="absolute inset-0 border-4 border-blue-500 rounded-xl pointer-events-none opacity-0 group-data-[speaking=true]:opacity-100 transition-opacity" />
                                )}
                            </div>
                        ))}

                        {allParticipants.length === 0 && (
                            <div className="col-span-full h-full flex items-center justify-center">
                                <div className="text-center">
                                    <Loader2 size={48} className="text-blue-500 animate-spin mx-auto mb-4" />
                                    <p className="text-[#9aa0a6] text-lg">Joining meeting...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Control Bar (Google Meet Style) */}
                <div className="h-24 md:h-20 px-4 md:px-6 flex items-center justify-between bg-[#202124] z-50">
                    {/* Left: Time and Meeting Code - Hidden on mobile */}
                    <div className="hidden md:flex items-center gap-4 text-white min-w-[200px]">
                        <span className="text-lg font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <div className="w-px h-4 bg-gray-600" />
                        <span className="text-sm font-medium tracking-wide uppercase">{meetingId}</span>
                    </div>

                    {/* Center: Controls - Centered on mobile */}
                    <div className="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3">
                        <CircularControl active={micOn} onClick={toggleMic} onIcon={<Mic size={20} />} offIcon={<MicOff size={20} />} />
                        <CircularControl active={videoOn} onClick={toggleVideo} onIcon={<Video size={20} />} offIcon={<VideoOff size={20} />} />

                        <div className="flex items-center gap-2 md:gap-3 mx-1 md:mx-2">
                            <ActionButton
                                icon={<ScreenShare size={20} className={participants[callObject?.participants().local.session_id]?.screen ? "text-blue-500" : ""} />}
                                onClick={handleScreenShare}
                            />
                            <ActionButton
                                icon={<Hand size={20} className={(participants[callObject?.participants().local.session_id]?.userData as any)?.handRaised ? "text-yellow-400 fill-yellow-400" : ""} />}
                                onClick={toggleHand}
                            />
                            <ActionButton 
                                icon={<UserCircle size={20} />} 
                                onClick={() => setShowSettings(true)} 
                            />
                            <ActionButton icon={<Smile size={20} />} onClick={() => { }} />
                            <ActionButton icon={<MoreVertical size={20} />} />
                        </div>

                        <button
                            onClick={() => router.push(`/academics/e-learning/left/${meetingId}`)}
                            className="h-10 px-4 md:px-6 bg-[#ea4335] hover:bg-[#d93025] rounded-full flex items-center justify-center text-white transition-colors ml-1 md:ml-2"
                        >
                            <LogOut size={20} className="rotate-180" />
                        </button>
                    </div>

                    {/* Right: Info/People/Chat - Compact on mobile */}
                    <div className="flex items-center gap-0.5 md:gap-1 md:min-w-[200px] justify-end">
                        <div className="hidden sm:block">
                            <IconButton icon={<Info size={18} />} active={activeTab === 'info'} onClick={() => setActiveTab('info')} />
                        </div>
                        <IconButton
                            icon={<Users size={18} />}
                            active={activeTab === 'participants'}
                            onClick={() => {
                                setActiveTab('participants');
                                setShowChat(true);
                            }}
                            badge={allParticipants.length}
                        />
                        <IconButton
                            icon={<MessageSquare size={18} />}
                            active={activeTab === 'chat' && showChat}
                            onClick={() => {
                                setActiveTab('chat');
                                setShowChat(!showChat);
                            }}
                        />
                    </div>
                </div>
            </main>

            {/* Side Panel (Chat/Participants) */}
            <AnimatePresence>
                {showChat && (
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 md:top-4 md:bottom-24 md:right-4 w-full md:w-[360px] bg-white md:rounded-xl shadow-2xl flex flex-col z-[60] overflow-hidden"
                    >
                        <div className="p-6 flex items-center justify-between border-b">
                            <h2 className="text-xl text-[#202124] font-normal">
                                {activeTab === 'chat' ? 'In-call messages' : 'People'}
                            </h2>
                            <button onClick={() => setShowChat(false)} className="p-2 hover:bg-gray-100 rounded-full text-[#5f6368] transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Host Controls removed - maintaining collaborative environment */}

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
                            {activeTab === 'chat' ? (
                                <div className="space-y-6">
                                    <p className="bg-gray-100 p-3 rounded-lg text-xs text-[#5f6368] leading-relaxed">
                                        Messages can only be seen by people in the call and are deleted when the call ends.
                                    </p>
                                    {chatMessages.map((msg, i) => (
                                        <ChatMessage
                                            key={i}
                                            name={msg.sender}
                                            time={msg.timestamp}
                                            text={msg.message}
                                        />
                                    ))}
                                    {chatMessages.length === 0 && (
                                        <p className="text-center text-sm text-gray-400 mt-10">No messages yet.</p>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>
                            ) : activeTab === 'info' ? (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-[#202124]">Joining info</h3>
                                        <p className="text-xs text-[#5f6368] leading-relaxed break-all">
                                            {window.location.origin}/academics/e-learning/join/{meetingId}
                                        </p>
                                        <button
                                            onClick={copyMeetingLink}
                                            className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                                        >
                                            <Paperclip size={16} />
                                            Copy joining info
                                        </button>
                                    </div>
                                    <div className="h-px bg-gray-100" />
                                    <p className="text-xs text-[#5f6368]">
                                        Google Meet architecture. Authenticated via Kawempe school ID.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {allParticipants.map(p => (
                                        <div key={p.user_id} className="flex items-center gap-3 p-2">
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                                {p.user_name?.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-2">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-sm text-[#3c4043] font-medium truncate">{p.user_name}</span>
                                                    {p.owner && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">HOST</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {(p.userData as any)?.handRaised && <Hand size={14} className="text-yellow-500 fill-yellow-500" />}
                                                {!p.audio && <MicOff size={14} className="text-[#5f6368]" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {activeTab === 'chat' && (
                            <div className="p-4 border-t">
                                <div className="bg-gray-100 rounded-[24px] px-4 py-3 flex items-center gap-2">
                                    <input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Send a message"
                                        className="bg-transparent flex-1 outline-none text-sm text-[#202124] placeholder:text-[#5f6368]"
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage(message)}
                                    />
                                    <button onClick={() => sendMessage(message)} className="text-blue-600 p-1">
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    );
}

function CircularControl({ active, onClick, onIcon, offIcon }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${active
                ? 'bg-[#3c4043] hover:bg-[#4c5054] text-white'
                : 'bg-[#ea4335] hover:bg-[#d93025] text-white'
                }`}
        >
            {active ? onIcon : offIcon}
        </button>
    );
}

function ActionButton({ icon, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="w-10 h-10 rounded-full bg-[#3c4043] hover:bg-[#4c5054] text-white flex items-center justify-center transition-colors"
        >
            {icon}
        </button>
    );
}

function IconButton({ icon, active, onClick, badge }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-colors ${active ? 'text-blue-400 bg-blue-500/10' : 'text-white hover:bg-white/5'
                }`}
        >
            {icon}
            {badge !== undefined && badge > 0 && (
                <span className="absolute top-1 right-1 bg-blue-500 text-[9px] font-bold px-1 rounded-full">
                    {badge}
                </span>
            )}
        </button>
    );
}

function ChatMessage({ name, time, text }: any) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#202124]">{name}</span>
                <span className="text-[11px] text-[#5f6368]">{time}</span>
            </div>
            <p className="text-sm text-[#3c4043] leading-relaxed">{text}</p>
        </div>
    );
}
