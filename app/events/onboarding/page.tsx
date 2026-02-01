'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createEventUser, updateEventUser, getInterests, getUserInterests, getUserProfile } from '../actions';
import { BookOpen, Trophy, Music, Palette, Cpu, Users, Check, ArrowLeft, Camera, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Icon mapping
const iconMap: Record<string, any> = {
    'BookOpen': BookOpen,
    'Trophy': Trophy,
    'Music': Music,
    'Palette': Palette,
    'Cpu': Cpu,
    'Users': Users,
};

export default function OnboardingPage() {
    const [showSplash, setShowSplash] = useState(true);
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [availableInterests, setAvailableInterests] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);
    const router = useRouter();

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('event_user_id');

        // Load interests and user data
        const loadInitialData = async () => {
            const interestsData = await getInterests();
            setAvailableInterests(interestsData);

            if (userId) {
                setIsEditing(true);
                const [profile, userInterests] = await Promise.all([
                    getUserProfile(userId),
                    getUserInterests(userId)
                ]);

                if (profile) {
                    setName(profile.full_name || '');
                    setNickname(profile.nickname || '');
                    setExistingAvatarUrl(profile.avatar_url);
                    if (profile.avatar_url) {
                        setAvatarPreview(profile.avatar_url);
                    }
                }

                if (userInterests.length > 0) {
                    setSelectedInterests(userInterests);
                }
            } else {
                // Pre-select mandatory interests for new users
                const mandatory = interestsData.filter((i: any) => i.is_mandatory).map((i: any) => i.id);
                setSelectedInterests(prev => [...new Set([...prev, ...mandatory])]);
            }
        };

        loadInitialData();

        // Splash timer - only show if not editing or if we want it every time
        const timer = setTimeout(() => setShowSplash(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    const toggleInterest = (id: string, isMandatory: boolean) => {
        if (isMandatory) return;
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('nickname', nickname);
        formData.append('interests', JSON.stringify(selectedInterests));
        if (avatar) {
            formData.append('avatar', avatar);
        }
        if (isEditing && existingAvatarUrl) {
            formData.append('avatarUrl', existingAvatarUrl);
        }

        const userId = localStorage.getItem('event_user_id');
        const result = isEditing && userId
            ? await updateEventUser(userId, formData)
            : await createEventUser(formData);

        if (result.success && result.userId) {
            localStorage.setItem('event_user_id', result.userId);
            localStorage.setItem('event_user_name', name);
            router.push('/events');
        } else {
            alert('Something went wrong. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
            <AnimatePresence mode="wait">
                {showSplash ? (
                    <motion.div
                        key="splash"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -50 }} // Slide up on exit
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-green-600"
                    >
                        <Link href="/" className="absolute top-8 left-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
                            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                            <span className="text-xs font-bold uppercase tracking-widest">Home</span>
                        </Link>
                        {/* Logo Animation */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="relative w-32 h-32 bg-white rounded-[2.5rem] p-6 flex items-center justify-center border border-white/10">
                                <Image src="/logo.png" alt="KMSS Logo" width={120} height={120} className="object-contain" />
                            </div>
                            <div className="text-center">
                                <h1 className="text-4xl font-black tracking-tight text-white mb-1">KMSS Events</h1>
                                <p className="text-white/70 text-sm tracking-[0.3em] uppercase font-bold">Stay Connected</p>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="min-h-screen flex flex-col p-6 max-w-md mx-auto"
                    >
                        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors group mb-8 w-fit">
                            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                            <span className="text-xs font-bold uppercase tracking-widest">Home</span>
                        </Link>

                        <div className="mb-8 flex flex-col items-start gap-4">
                            <div className="w-12 h-12 relative">
                                <Image src="/logo.png" alt="KMSS Logo" fill className="object-contain opacity-20" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{isEditing ? 'Update Profile' : 'Welcome! 👋'}</h1>
                                <p className="text-slate-500 mt-2">
                                    {isEditing ? 'Modify your details and interests below.' : 'Let\'s set up your profile to personalize your experience.'}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-8">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center gap-4">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden group"
                                >
                                    {avatarPreview ? (
                                        <>
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={avatarPreview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Camera size={24} className="text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-slate-400">
                                            <Camera size={28} />
                                            <span className="text-[10px] font-bold uppercase">Add Photo</span>
                                        </div>
                                    )}
                                </div>
                                {avatarPreview && (
                                    <button
                                        type="button"
                                        onClick={() => { setAvatar(null); setAvatarPreview(null); }}
                                        className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-1"
                                    >
                                        <X size={12} /> Remove
                                    </button>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Alex Mwebaze"
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Nickname (Optional)</label>
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        placeholder="Lexy"
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all font-bold text-red-500"
                                    />
                                </div>
                            </div>

                            {/* Interests Section */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Select your interests</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {availableInterests.map((interest) => {
                                        const Icon = iconMap[interest.icon] || BookOpen;
                                        const isSelected = selectedInterests.includes(interest.id);
                                        const isMandatory = interest.is_mandatory;

                                        return (
                                            <motion.div
                                                key={interest.id}
                                                whileTap={{ scale: isMandatory ? 1 : 0.95 }}
                                                onClick={() => toggleInterest(interest.id, isMandatory)}
                                                className={`
                          relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center h-32
                          ${isSelected
                                                        ? 'bg-slate-900 border-slate-900 text-white'
                                                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                                    }
                          ${isMandatory ? 'opacity-80 cursor-default' : ''}
                        `}
                                            >
                                                {isSelected && !isMandatory && (
                                                    <div className="absolute top-3 right-3 text-green-400">
                                                        <Check size={16} strokeWidth={3} />
                                                    </div>
                                                )}
                                                {isMandatory && (
                                                    <div className="absolute top-3 right-3 text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                                                        Must
                                                    </div>
                                                )}

                                                <Icon size={28} className={isSelected ? "text-white" : "text-slate-400"} />
                                                <span className="font-medium text-sm">{interest.name}</span>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-auto pt-8 pb-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !name.trim()}
                                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                                >
                                    {isSubmitting ? 'Setting up...' : (isEditing ? 'Save Changes' : 'Get Started')}
                                </button>
                                <p className="text-center text-xs text-slate-400 mt-4">
                                    By continuing, you agree to view academic events as required.
                                </p>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
