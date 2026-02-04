"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Lock, Eye, EyeOff, Check, X, ArrowRight,
    AlertCircle, Loader2, ShieldCheck
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { setFirstPassword, getCurrentProfile } from "@/utils/auth/schoolAuth";

export default function SetupPasswordPage() {
    const router = useRouter();
    const supabase = createClient();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [schoolId, setSchoolId] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);

    // Password strength checks
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const passwordsMatch = password === confirmPassword && password.length > 0;

    const isPasswordStrong = hasMinLength && hasUppercase && hasLowercase && hasNumber;

    useEffect(() => {
        // Get current user's profile
        const fetchProfile = async () => {
            const profile = await getCurrentProfile();
            if (!profile) {
                // Not logged in, redirect to login
                router.push("/auth/login");
                return;
            }
            if (!profile.first_login) {
                // Already set password, redirect to appropriate page
                router.push("/academics/e-learning/onboarding");
                return;
            }
            setSchoolId(profile.school_id);
            setFullName(profile.full_name);
        };
        fetchProfile();
    }, [router]);

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isPasswordStrong) {
            setError("Please meet all password requirements");
            return;
        }

        if (!passwordsMatch) {
            setError("Passwords do not match");
            return;
        }

        if (!schoolId) {
            setError("Session expired. Please login again.");
            return;
        }

        setIsLoading(true);

        try {
            const result = await setFirstPassword(schoolId, password);

            if (!result.success) {
                setError(result.error || "Failed to set password");
                setIsLoading(false);
                return;
            }

            // Success! Redirect to e-learning
            router.push("/academics/e-learning/onboarding");
        } catch {
            setError("An unexpected error occurred");
            setIsLoading(false);
        }
    };

    const PasswordCheck = ({ passed, label }: { passed: boolean; label: string }) => (
        <div className={`flex items-center gap-2 text-sm ${passed ? 'text-green-400' : 'text-slate-500'}`}>
            {passed ? <Check size={16} /> : <X size={16} />}
            <span>{label}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-green-500/20"
                    >
                        <ShieldCheck size={40} className="text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">Set Your Password</h1>
                    {fullName && (
                        <p className="text-slate-400">
                            Welcome, <span className="text-white font-medium">{fullName}</span>!
                        </p>
                    )}
                    {schoolId && (
                        <p className="text-slate-500 text-sm mt-1">
                            ID: {schoolId}
                        </p>
                    )}
                </div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl"
                >
                    <form onSubmit={handleSetPassword} className="space-y-6">
                        {/* New Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 block">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a strong password"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-green-500/50 transition-colors"
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

                        {/* Password Strength Indicators */}
                        <div className="space-y-2 p-4 bg-slate-900/30 rounded-2xl">
                            <p className="text-xs font-medium text-slate-400 mb-3">Password must have:</p>
                            <div className="grid grid-cols-2 gap-2">
                                <PasswordCheck passed={hasMinLength} label="8+ characters" />
                                <PasswordCheck passed={hasUppercase} label="Uppercase letter" />
                                <PasswordCheck passed={hasLowercase} label="Lowercase letter" />
                                <PasswordCheck passed={hasNumber} label="Number" />
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 block">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                    className={`w-full bg-slate-900/50 border rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none transition-colors ${confirmPassword && !passwordsMatch
                                            ? 'border-red-500/50 focus:border-red-500'
                                            : passwordsMatch
                                                ? 'border-green-500/50 focus:border-green-500'
                                                : 'border-slate-700 focus:border-green-500/50'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {confirmPassword && !passwordsMatch && (
                                <p className="text-xs text-red-400">Passwords do not match</p>
                            )}
                            {passwordsMatch && (
                                <p className="text-xs text-green-400 flex items-center gap-1">
                                    <Check size={14} /> Passwords match
                                </p>
                            )}
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !isPasswordStrong || !passwordsMatch}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Setting password...
                                </>
                            ) : (
                                <>
                                    Set Password & Continue
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Security Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-slate-500 text-sm mt-6"
                >
                    🔐 Your password is encrypted and secure.
                    <br />
                    Only you will know it.
                </motion.p>
            </motion.div>
        </div>
    );
}
