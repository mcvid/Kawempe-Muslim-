"use client";

import { useState, useEffect } from 'react';
import { X, Bell, Star, Trophy, AlertTriangle, Info } from 'lucide-react';
import { useSiteConfig } from '../lib/SiteConfigContext';
import './AnnouncementDrop.css';

const AnnouncementDrop = () => {
    const context = useSiteConfig();
    const announcement = context?.announcement;
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        if (!announcement || !announcement.enabled) {
            setIsVisible(false);
            return;
        }

        const now = new Date();
        const start = new Date(announcement.startAt);
        const end = new Date(announcement.endAt);

        // Rule: Enabled and within time range
        const withinTime = now >= start && now <= end;

        if (withinTime) {
            setIsVisible(true);
            setShowAnimation(true);
        } else {
            setIsVisible(false);
        }
    }, [announcement]);

    const handleDismiss = () => {
        if (announcement.dismissible) {
            setIsDismissed(true);
            // Hide for this view only, resets on refresh
            setTimeout(() => setIsVisible(false), 500);
        }
    };

    if (!isVisible) return null;

    const getIcon = () => {
        switch (announcement.type) {
            case 'celebration': return <Trophy className="a-icon" />;
            case 'matchday': return <Star className="a-icon" />;
            case 'alert': return <AlertTriangle className="a-icon" />;
            default: return <Info className="a-icon" />;
        }
    };

    return (
        <div className={`announcement-rope-container ${showAnimation ? 'animate-drop' : 'static-show'} ${isDismissed ? 'exit-lift' : ''}`}>
            {/* The Rope */}
            <div className="rope-svg-container">
                <svg width="2" height="120" viewBox="0 0 2 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="1" y1="0" x2="1" y2="120" stroke="#8B5E3C" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
                <div className="rope-knot"></div>
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
        </div>
    );
};

export default AnnouncementDrop;
