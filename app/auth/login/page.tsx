"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    User, Lock, Eye, EyeOff, ArrowRight, AlertCircle,
    GraduationCap, BookOpen, Shield, Loader2
} from "lucide-react";
import {
    loginWithSchoolId,
    isValidSchoolId,
    getRoleFromSchoolId
} from "@/utils/auth/schoolAuth";

export default function SchoolLoginPage() {
    const router = useRouter();
    const [schoolId, setSchoolId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Detect role from ID as user types
    const detectedRole = schoolId ? getRoleFromSchoolId(schoolId) : null;

    const getRoleIcon = () => {
        switch (detectedRole) {
            case 'student': return <GraduationCap size={20} className="text-blue-400" />;
            case 'teacher': return <BookOpen size={20} className="text-green-400" />;
            case 'admin': return <Shield size={20} className="text-purple-400" />;
            default: return null;
        }
    };

    const getRoleLabel = () => {
        switch (detectedRole) {
            case 'student': return 'Student';
            case 'teacher': return 'Teacher';
            case 'admin': return 'Admin';
            default: return null;
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate School ID format
        if (!isValidSchoolId(schoolId)) {
            setError("Invalid School ID format. Use STU-XXXX, T-XXX, or ADM-XXX");
            return;
        }

        if (!password) {
            setError("Please enter your password");
            return;
        }

        setIsLoading(true);

        try {
            const result = await loginWithSchoolId(schoolId, password);

            if (!result.success) {
                setError(result.error || "Login failed");
                setIsLoading(false);
                return;
            }

            // If first login, redirect to password setup
            if (result.firstLogin) {
                router.push("/auth/setup-password");
                return;
            }

            // Redirect based on role
            switch (result.profile?.role) {
                case 'admin':
                    router.push("/admin");
                    break;
                case 'teacher':
                    router.push("/academics/e-learning/onboarding");
                    break;
                case 'student':
                    router.push("/academics/e-learning/onboarding");
                    break;
                default:
                    router.push("/");
            }
        } catch {
            setError("An unexpected error occurred");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* School Logo/Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20"
                    >
                        <span className="font-black text-3xl italic text-white tracking-tighter">KM</span>
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to Kawempe Live</p>
                </div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl"
                >
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* School ID Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 block">
                                School ID
                            </label>
                            <div className={`
                                relative rounded-2xl transition-all duration-300
                                ${focusedField === 'schoolId' ? 'ring-2 ring-blue-500/50' : ''}
                            `}>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={schoolId}
                                    onChange={(e) => setSchoolId(e.target.value.toUpperCase())}
                                    onFocus={() => setFocusedField('schoolId')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="STU-0142"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-16 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                                {/* Role indicator */}
                                <AnimatePresence>
                                    {detectedRole && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2"
                                        >
                                            {getRoleIcon()}
                                            <span className={`text-xs font-medium ${detectedRole === 'student' ? 'text-blue-400' :
                                                    detectedRole === 'teacher' ? 'text-green-400' :
                                                        'text-purple-400'
                                                }`}>
                                                {getRoleLabel()}
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <p className="text-xs text-slate-500">
                                Format: STU-0142 (Student) • T-009 (Teacher) • ADM-001 (Admin)
                            </p>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 block">
                                Password
                            </label>
                            <div className={`
                                relative rounded-2xl transition-all duration-300
                                ${focusedField === 'password' ? 'ring-2 ring-blue-500/50' : ''}
                            `}>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter your password"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400"
                                >
                                    <AlertCircle size={20} />
                                    <span className="text-sm">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Forgot Password Link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/auth/forgot-password"
                            className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                </motion.div>

                {/* Help Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-slate-500 text-sm mt-6"
                >
                    First time? Your initial password is your School ID.
                    <br />
                    Example: If your ID is STU-0142, password is also STU-0142
                </motion.p>

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-4"
                >
                    <Link
                        href="/"
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
