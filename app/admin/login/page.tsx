"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();

    // Mandatory Secret Access Check
    useEffect(() => {
        const hasAccess = sessionStorage.getItem('secretAccess');

        if (!hasAccess) {
            router.replace("/");
        } else {
            setIsVerified(true);
        }
    }, [router]);

    // Don't even render the HTML while checking
    if (!isVerified) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push("/admin/dashboard");

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200">
                    {/* Logo & Branding */}
                    <div className="text-center mb-10 relative">
                        <Link
                            href="/"
                            className="absolute left-0 top-0 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-xs font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                            <Image
                                src="/logo.png"
                                alt="KMSS Logo"
                                width={96}
                                height={96}
                                className="object-contain drop-shadow-sm"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            KMSS
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">
                            Admin Portal
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50/50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-slate-700 text-sm font-medium block">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@kmss.ac.ug"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-slate-700 text-sm font-medium block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-8">
                        <p className="text-slate-400 text-xs">
                            Kawempe Muslim Secondary School © 2026
                        </p>
                        <p className="text-slate-300 text-[10px] mt-1">
                            Powered by <span className="font-semibold text-slate-400">Tazon</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
