"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    Video, VideoOff, Mic, MicOff, Settings, ArrowRight,
    Users, Clock, Shield, Loader2, Volume2
} from "lucide-react";
import { getCurrentProfile } from "@/utils/auth/schoolAuth";
import { createClient } from "@/utils/supabase/client";

export default function JoinMeetingPage() {
    const router = useRouter();
    const params = useParams();
    const meetingId = params.id as string;

    const videoRef = useRef<HTMLVideoElement>(null);
    const [step, setStep] = useState<'camera-choice' | 'lobby'>('camera-choice');
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [micEnabled, setMicEnabled] = useState(true);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isJoining, setIsJoining] = useState(false);
    const [userName, setUserName] = useState("You"); // Will be fetched from profile

    // Load profile
    useEffect(() => {
        const loadProfile = async () => {
            const profile = await getCurrentProfile();
            if (profile) {
                setUserName(profile.full_name);
            } else {
                setUserName("Guest " + Math.floor(Math.random() * 1000));
            }
        };
        loadProfile();
    }, []);

    // Request camera access
    const enableCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setStream(mediaStream);
            setCameraEnabled(true);
            setMicEnabled(true);
            setStep('lobby');
        } catch (error) {
            console.error("Camera access denied:", error);
            // Continue without camera
            setStep('lobby');
        }
    };

    // Continue without camera
    const continueWithoutCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            setStream(mediaStream);
            setMicEnabled(true);
        } catch (error) {
            console.error("Microphone access denied:", error);
        }
        setCameraEnabled(false);
        setStep('lobby');
    };

    // Attach stream to video element
    useEffect(() => {
        if (videoRef.current && stream && cameraEnabled) {
            videoRef.current.srcObject = stream;
        }

        // Cleanup on unmount
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream, cameraEnabled]);

    // Toggle camera
    const toggleCamera = async () => {
        if (cameraEnabled && stream) {
            // Turn off camera
            stream.getVideoTracks().forEach(track => track.stop());
            setCameraEnabled(false);
        } else {
            // Turn on camera
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: micEnabled
                });
                setStream(mediaStream);
                setCameraEnabled(true);
            } catch (error) {
                console.error("Camera access denied:", error);
            }
        }
    };

    // Toggle microphone
    const toggleMic = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !micEnabled;
            });
            setMicEnabled(!micEnabled);
        }
    };

    // Join the meeting
    const joinMeeting = () => {
        setIsJoining(true);
        // Pass camera/mic state and name to the meeting page
        const queryParams = new URLSearchParams({
            camera: cameraEnabled.toString(),
            mic: micEnabled.toString(),
            name: userName
        });
        router.push(`/academics/e-learning/class/${meetingId}?${queryParams.toString()}`);
    };

    return (
        <div className="min-h-screen bg-[#202124] flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
                {step === 'camera-choice' ? (
                    <CameraChoiceScreen
                        key="camera-choice"
                        onUseCamera={enableCamera}
                        onContinueWithout={continueWithoutCamera}
                    />
                ) : (
                    <LobbyScreen
                        key="lobby"
                        meetingId={meetingId}
                        videoRef={videoRef}
                        cameraEnabled={cameraEnabled}
                        micEnabled={micEnabled}
                        onToggleCamera={toggleCamera}
                        onToggleMic={toggleMic}
                        onJoin={joinMeeting}
                        isJoining={isJoining}
                        userName={userName}
                        setUserName={setUserName}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Camera Choice Screen (Simplified)
function CameraChoiceScreen({
    onUseCamera,
    onContinueWithout
}: {
    onUseCamera: () => void;
    onContinueWithout: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl border border-gray-100"
        >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video size={24} className="text-[#1a73e8]" />
            </div>

            <h1 className="text-xl font-medium text-[#202124] mb-2">
                Turn on camera?
            </h1>
            <p className="text-sm text-[#5f6368] mb-6">
                You can turn it off anytime.
            </p>

            {/* Buttons */}
            <div className="space-y-3">
                <button
                    onClick={onUseCamera}
                    className="w-full flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white py-2.5 px-4 rounded-full text-sm font-medium transition-colors"
                >
                    Enable Camera
                </button>
                <button
                    onClick={onContinueWithout}
                    className="w-full text-[#5f6368] hover:bg-gray-50 py-2.5 px-4 rounded-full text-sm font-medium transition-colors"
                >
                    Continue without
                </button>
            </div>
        </motion.div>
    );
}

// Lobby/Preview Screen
function LobbyScreen({
    meetingId,
    videoRef,
    cameraEnabled,
    micEnabled,
    onToggleCamera,
    onToggleMic,
    onJoin,
    isJoining,
    userName,
    setUserName
}: {
    meetingId: string;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    cameraEnabled: boolean;
    micEnabled: boolean;
    onToggleCamera: () => void;
    onToggleMic: () => void;
    onJoin: () => void;
    isJoining: boolean;
    userName: string;
    setUserName: (name: string) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-center"
        >
            {/* Video Preview */}
            <div className="flex-1 w-full">
                <div className="relative aspect-video bg-[#3c4043] rounded-2xl overflow-hidden">
                    {cameraEnabled ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform -scale-x-100"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 bg-[#5f6368] rounded-full flex items-center justify-center">
                                <span className="text-4xl font-medium text-white">
                                    {userName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Controls overlay */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
                        <button
                            onClick={onToggleMic}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${micEnabled
                                ? 'bg-[#3c4043] hover:bg-[#4a4d51] text-white'
                                : 'bg-[#ea4335] hover:bg-[#d33828] text-white'
                                }`}
                        >
                            {micEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                        </button>
                        <button
                            onClick={onToggleCamera}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${cameraEnabled
                                ? 'bg-[#3c4043] hover:bg-[#4a4d51] text-white'
                                : 'bg-[#ea4335] hover:bg-[#d33828] text-white'
                                }`}
                        >
                            {cameraEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                        </button>
                        <button className="w-14 h-14 rounded-full bg-[#3c4043] hover:bg-[#4a4d51] flex items-center justify-center text-white transition-colors">
                            <Settings size={24} />
                        </button>
                    </div>

                    {/* Name tag */}
                    <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                        <div className="px-3 py-1.5 bg-black/50 rounded-lg">
                            <span className="text-white text-sm">{userName}</span>
                        </div>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter your name"
                            className="bg-black/40 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs outline-none focus:border-blue-500 transition-colors w-40"
                        />
                    </div>
                </div>
            </div>

            {/* Meeting Info Panel */}
            <div className="w-full lg:w-80 bg-white rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-normal text-[#202124] mb-2">Ready to join?</h2>
                <p className="text-sm text-[#5f6368] mb-6">
                    Meeting ID: <span className="font-medium text-[#202124]">{meetingId}</span>
                </p>

                {/* Status checks */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${micEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {micEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                        </div>
                        <span className="text-[#3c4043]">
                            Microphone is {micEnabled ? 'on' : 'off'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cameraEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                            {cameraEnabled ? <Video size={16} /> : <VideoOff size={16} />}
                        </div>
                        <span className="text-[#3c4043]">
                            Camera is {cameraEnabled ? 'on' : 'off'}
                        </span>
                    </div>
                </div>

                {/* Join button */}
                <button
                    onClick={onJoin}
                    disabled={isJoining}
                    className="w-full flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white py-3.5 px-6 rounded-full font-medium transition-colors disabled:opacity-50"
                >
                    {isJoining ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Joining...
                        </>
                    ) : (
                        <>
                            Join now
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>

                {/* Security notice */}
                <div className="mt-6 flex items-start gap-3 p-3 bg-[#f8f9fa] rounded-xl">
                    <Shield size={20} className="text-[#1a73e8] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#5f6368]">
                        This meeting is secured. Only invited participants can join.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
