"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Video, Volume2, Palette, Sliders } from "lucide-react";
import { getProfile, saveProfile, UserProfile, getVideoSettings, saveVideoSettings, getAudioSettings, saveAudioSettings } from "@/app/utils/e-learning/userPreferences";
import ProfileSetupForm from "./ProfileSetupForm";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProfileUpdate?: (profile: UserProfile) => void;
}

type TabType = 'profile' | 'video' | 'audio' | 'appearance';

export default function SettingsModal({ isOpen, onClose, onProfileUpdate }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [videoSettings, setVideoSettings] = useState(getVideoSettings());
    const [audioSettings, setAudioSettings] = useState(getAudioSettings());

    const handleVideoChange = (key: string, value: number | boolean) => {
        const updated = { ...videoSettings, [key]: value };
        setVideoSettings(updated);
        saveVideoSettings(updated);
    };

    const handleAudioChange = (key: string, value: boolean) => {
        const updated = { ...audioSettings, [key]: value };
        setAudioSettings(updated);
        saveAudioSettings(updated);
    };

    const tabs = [
        { id: 'profile' as TabType, label: 'Profile', icon: User },
        { id: 'video' as TabType, label: 'Video', icon: Video },
        { id: 'audio' as TabType, label: 'Audio', icon: Volume2 },
        { id: 'appearance' as TabType, label: 'Appearance', icon: Palette },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 px-6">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                            {activeTab === 'profile' && (
                                <div>
                                    <ProfileSetupForm
                                        onComplete={(profile) => {
                                            onProfileUpdate?.(profile);
                                            onClose();
                                        }}
                                        initialProfile={getProfile()}
                                    />
                                </div>
                            )}

                            {activeTab === 'video' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Enhancements</h3>
                                        
                                        {/* Brightness */}
                                        <div className="mb-6">
                                            <label className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Brightness</span>
                                                <span className="text-sm text-gray-500">{videoSettings.brightness}</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="-100"
                                                max="100"
                                                value={videoSettings.brightness}
                                                onChange={(e) => handleVideoChange('brightness', parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                        </div>

                                        {/* Contrast */}
                                        <div className="mb-6">
                                            <label className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Contrast</span>
                                                <span className="text-sm text-gray-500">{videoSettings.contrast}%</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="200"
                                                value={videoSettings.contrast}
                                                onChange={(e) => handleVideoChange('contrast', parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                        </div>

                                        {/* Saturation */}
                                        <div className="mb-6">
                                            <label className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Saturation</span>
                                                <span className="text-sm text-gray-500">{videoSettings.saturation}%</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="200"
                                                value={videoSettings.saturation}
                                                onChange={(e) => handleVideoChange('saturation', parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                        </div>

                                        {/* Background Blur */}
                                        <div className="mb-6">
                                            <label className="flex items-center justify-between mb-3">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-700">Background Blur</span>
                                                    <p className="text-xs text-gray-500 mt-1">Blur your background during video calls</p>
                                                </div>
                                                <button
                                                    onClick={() => handleVideoChange('backgroundBlur', !videoSettings.backgroundBlur)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                        videoSettings.backgroundBlur ? 'bg-blue-600' : 'bg-gray-200'
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                            videoSettings.backgroundBlur ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                    />
                                                </button>
                                            </label>

                                            {videoSettings.backgroundBlur && (
                                                <div className="flex gap-2 mt-3">
                                                    {(['low', 'medium', 'high'] as const).map(intensity => (
                                                        <button
                                                            key={intensity}
                                                            onClick={() => handleVideoChange('blurIntensity', intensity)}
                                                            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium text-sm capitalize transition-all ${
                                                                videoSettings.blurIntensity === intensity
                                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                                            }`}
                                                        >
                                                            {intensity}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'audio' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Settings</h3>
                                        
                                        {/* Noise Suppression */}
                                        <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">Noise Suppression</span>
                                                <p className="text-xs text-gray-500 mt-1">Reduce background noise during calls</p>
                                            </div>
                                            <button
                                                onClick={() => handleAudioChange('noiseSuppress', !audioSettings.noiseSuppress)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    audioSettings.noiseSuppress ? 'bg-blue-600' : 'bg-gray-200'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        audioSettings.noiseSuppress ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        {/* Echo Cancellation */}
                                        <div className="flex items-center justify-between py-4">
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">Echo Cancellation</span>
                                                <p className="text-xs text-gray-500 mt-1">Prevent audio feedback and echo</p>
                                            </div>
                                            <button
                                                onClick={() => handleAudioChange('echoCancellation', !audioSettings.echoCancellation)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    audioSettings.echoCancellation ? 'bg-blue-600' : 'bg-gray-200'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        audioSettings.echoCancellation ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'appearance' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
                                        <div className="flex items-center justify-center py-12 text-gray-500">
                                            <div className="text-center">
                                                <Sliders size={48} className="mx-auto mb-3 text-gray-300" />
                                                <p className="text-sm">Appearance customization coming soon</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
