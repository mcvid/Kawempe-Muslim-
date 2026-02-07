"use client";

import { useState, useEffect } from 'react';
import { X, Bell, Star, Trophy, AlertTriangle, Info } from 'lucide-react';
import { useSiteConfig } from '../lib/SiteConfigContext';
import './AnnouncementDrop.css';

const AnnouncementDrop = () => {
    const context = useSiteConfig();
    const announcement = context?.announcement;
    const isGlobalLoading = context?.isGlobalLoading;
    const hasSeenLoaderSession = context?.hasSeenLoaderSession;
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [forceExit, setForceExit] = useState(false);

    // Persistence: Check if this Specific announcement has been dismissed in THIS session
    const storageKey = announcement ? `dismissedAnn_${announcement.id}` : null;

    useEffect(() => {
        if (!announcement || !announcement.enabled) {
            setIsVisible(false);
            return;
        }

        const now = new Date();
        const start = new Date(announcement.startAt);
        const end = new Date(announcement.endAt);
        const withinTime = now >= start && now <= end;

        if (withinTime) {
            const alreadyDismissed = storageKey ? sessionStorage.getItem(storageKey) === 'true' : false;

            if (alreadyDismissed) {
                // CASE: Already seen/dismissed in this session
                // We show it ONLY while global loading is true (for consistency), then exit
                if (isGlobalLoading) {
                    setIsVisible(true);
                    setShowAnimation(true);
                    setForceExit(false);
                } else {
                    setForceExit(true);
                    const timer = setTimeout(() => setIsVisible(false), 1000);
                    return () => clearTimeout(timer);
                }
            } else {
                // CASE: Fresh session or not yet dismissed
                setIsVisible(true);
                // Only animate (drop) if it's the first time seeing the loader in this session
                setShowAnimation(!hasSeenLoaderSession);
                setForceExit(false);
            }
        } else {
            setIsVisible(false);
        }
    }, [announcement, isGlobalLoading, storageKey, hasSeenLoaderSession]);

    const handleDismiss = () => {
        if (announcement.dismissible) {
            setIsDismissed(true);
            if (storageKey) sessionStorage.setItem(storageKey, 'true');
            setTimeout(() => setIsVisible(false), 800);
        }
    };

    if (!isVisible) return null;

    const liftClass = isDismissed || forceExit ? 'exit-lift' : '';

    const getIcon = () => {
        switch (announcement.type) {
            case 'celebration': return <Trophy className="a-icon" />;
            case 'matchday': return <Star className="a-icon" />;
            case 'alert': return <AlertTriangle className="a-icon" />;
            default: return <Info className="a-icon" />;
        }
    };

    // Premium Islamic SVGs
    const Lantern = () => (
        <svg width="40" height="60" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10V25M30 40H70L85 80L50 130L15 80L30 40Z" stroke="#D4AF37" strokeWidth="4" fill="rgba(212, 175, 55, 0.1)"/>
            <path d="M40 50H60M35 70H65M42 90H58" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="50" cy="75" r="15" fill="#FFD700" className="lantern-glow"/>
            <path d="M50 5L45 15H55L50 5Z" fill="#D4AF37"/>
        </svg>
    );

    const Crescent = () => (
        <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 15C50 15 30 35 30 60C30 85 50 105 70 105C55 105 40 90 40 60C40 30 55 15 70 15Z" fill="#D4AF37"/>
        </svg>
    );

    return (
        <div className={`announcement-rope-container ${showAnimation ? 'animate-drop' : 'static-show'} ${liftClass} islamic-theme`}>
            {/* The Golden Chain (Beaded Rope) */}
            <div className="rope-svg-container">
                <div className="golden-chain"></div>
                <div className="hanging-ornament">
                    {announcement.type === 'celebration' ? <Lantern /> : <Crescent />}
                </div>
            </div>

            {/* The Card */}
            <div className={`announcement-card type-${announcement.type}`}>
                <div className="a-card-content">
                    <div className="a-icon-wrap">
                        {getIcon()}
                    </div>
                    <div className="a-text-box">
                        <h3>{announcement.title}</h3>
                        <p>{announcement.message}</p>
                    </div>
                    {announcement.dismissible && (
                        <button className="a-close-btn" onClick={handleDismiss} title="Dismiss">
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>
            {/* Hanging stars around */}
            <div className="floating-star s-1">★</div>
            <div className="floating-star s-2">★</div>
        </div>
    );
};

export default AnnouncementDrop;
