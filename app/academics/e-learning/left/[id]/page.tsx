"use client";

import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowRight, RotateCcw, MessageSquare, Home } from "lucide-react";

export default function LeftMeetingPage() {
    const router = useRouter();
    const params = useParams();
    const meetingId = params.id as string;

    const rejoinMeeting = () => {
        router.push(`/academics/e-learning/join/${meetingId}`);
    };

    const returnHome = () => {
        router.push("/academics/e-learning/onboarding");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-lg w-full"
            >
                {/* Animated checkmark/goodbye icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-24 h-24 mx-auto mb-8 relative"
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Spinning ring */}
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#1a73e8"
                            strokeWidth="3"
                            strokeDasharray="283"
                            strokeDashoffset="70"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            style={{ transformOrigin: "center" }}
                        />
                        {/* Inner circle */}
                        <circle cx="50" cy="50" r="35" fill="#e8f0fe" />
                        {/* Checkmark */}
                        <motion.path
                            d="M 35 50 L 45 60 L 65 40"
                            fill="none"
                            stroke="#1a73e8"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        />
                    </svg>
                </motion.div>

                {/* Main message */}
                <h1 className="text-3xl font-normal text-[#202124] mb-6">
                    You left the meeting
                </h1>

                {/* Action buttons */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <button
                        onClick={rejoinMeeting}
                        className="flex items-center gap-2 px-6 py-3 border border-[#dadce0] hover:bg-[#f8f9fa] rounded-full text-[#1a73e8] font-medium transition-colors"
                    >
                        <RotateCcw size={18} />
                        Rejoin
                    </button>
                    <button
                        onClick={returnHome}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-full font-medium transition-colors"
                    >
                        Return to home screen
                        <ArrowRight size={18} />
                    </button>
                </div>

                {/* Feedback link */}
                <Link
                    href="#"
                    className="inline-flex items-center gap-2 text-[#1a73e8] hover:text-[#1557b0] text-sm font-medium transition-colors mb-10"
                >
                    <MessageSquare size={16} />
                    Submit feedback
                </Link>

                {/* Security card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white border border-[#dadce0] rounded-2xl p-6 max-w-sm mx-auto shadow-sm"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#e8f0fe] rounded-full flex items-center justify-center flex-shrink-0">
                            <Shield size={24} className="text-[#1a73e8]" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-medium text-[#202124] mb-1">
                                Your meeting is safe
                            </h3>
                            <p className="text-sm text-[#5f6368] leading-relaxed">
                                No one can join a meeting unless invited or admitted by the host
                            </p>
                            <Link
                                href="#"
                                className="text-[#1a73e8] hover:text-[#1557b0] text-sm font-medium mt-2 inline-block"
                            >
                                Learn more
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Footer - Time spent (optional enhancement) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="fixed bottom-8 text-center"
            >
                <p className="text-sm text-[#5f6368]">
                    Meeting ID: <span className="font-medium">{meetingId}</span>
                </p>
            </motion.div>
        </div>
    );
}
