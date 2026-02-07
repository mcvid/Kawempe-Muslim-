"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Upload, Palette } from "lucide-react";
import { saveProfile, getProfile, generateInitialsAvatar, UserProfile } from "@/app/utils/e-learning/userPreferences";

interface ProfileSetupFormProps {
    onComplete: (profile: UserProfile) => void;
    initialProfile?: UserProfile | null;
}

const PRESET_COLORS = [
    '#1a73e8', '#34a853', '#fbbc04', '#ea4335',
    '#9334e6', '#06b6d4', '#f97316', '#ef4444'
];

export default function ProfileSetupForm({ onComplete, initialProfile }: ProfileSetupFormProps) {
    const [username, setUsername] = useState('');
    const [avatarType, setAvatarType] = useState<'initials' | 'upload' | 'preset'>('initials');
    const [avatarColor, setAvatarColor] = useState(PRESET_COLORS[0]);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [error, setError] = useState('');

    // Load saved profile on mount
    useEffect(() => {
        const saved = initialProfile || getProfile();
        if (saved.username) {
            setUsername(saved.username);
            setAvatarType(saved.avatarType || 'initials');
            setAvatarColor(saved.avatarColor || PRESET_COLORS[0]);
            if (saved.avatarUrl) {
                setAvatarPreview(saved.avatarUrl);
            }
        }
    }, [initialProfile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('Image must be smaller than 2MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }

            setAvatarFile(file);
            setError('');

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        if (username.length > 30) {
            setError('Username must be less than 30 characters');
            return;
        }

        let avatarUrl = '';
        
        if (avatarType === 'initials') {
            avatarUrl = generateInitialsAvatar(username, avatarColor);
        } else if (avatarType === 'upload' && avatarPreview) {
            avatarUrl = avatarPreview; // For guests, use data URL directly
        }

        const profile: UserProfile = {
            username: username.trim(),
            avatarType,
            avatarColor,
            avatarUrl
        };

        // Save to localStorage
        saveProfile(profile);

        // Pass to parent
        onComplete(profile);
    };

    const previewAvatar = () => {
        if (avatarType === 'upload' && avatarPreview) {
            return avatarPreview;
        }
        if (avatarType === 'initials' && username) {
            return generateInitialsAvatar(username, avatarColor);
        }
        return '';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
        >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Set up your profile</h2>
            <p className="text-sm text-gray-600 mb-6">This will be visible to other meeting participants</p>

            {/* Preview */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-3 shadow-lg">
                    {previewAvatar() ? (
                        <img 
                            src={previewAvatar()} 
                            alt="Avatar preview" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User size={40} className="text-gray-400" />
                    )}
                </div>
                <p className="text-lg font-medium text-gray-900">{username || 'Your name'}</p>
            </div>

            {/* Username Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setError('');
                    }}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    maxLength={30}
                />
                <p className="text-xs text-gray-500 mt-1">{username.length}/30 characters</p>
            </div>

            {/* Avatar Type Selection */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Avatar style
                </label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setAvatarType('initials')}
                        className={`flex-1 py-2.5 px-4 rounded-lg border-2 font-medium text-sm transition-all ${
                            avatarType === 'initials'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Palette size={16} className="inline mr-2" />
                        Initials
                    </button>
                    <button
                        type="button"
                        onClick={() => setAvatarType('upload')}
                        className={`flex-1 py-2.5 px-4 rounded-lg border-2 font-medium text-sm transition-all ${
                            avatarType === 'upload'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Upload size={16} className="inline mr-2" />
                        Upload
                    </button>
                </div>
            </div>

            {/* Color Picker for Initials */}
            {avatarType === 'initials' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Avatar color
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                        {PRESET_COLORS.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setAvatarColor(color)}
                                className={`w-8 h-8 rounded-full transition-all ${
                                    avatarColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                                }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* File Upload for Custom Avatar */}
            {avatarType === 'upload' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="avatar-upload"
                        />
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                                {avatarFile ? avatarFile.name : 'Click to upload (max 2MB)'}
                            </p>
                        </label>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
                Continue
            </button>
        </motion.div>
    );
}
