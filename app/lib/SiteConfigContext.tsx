"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const SiteConfigContext = createContext<any>(null);

export const useSiteConfig = () => useContext(SiteConfigContext);

export const SiteConfigProvider = ({ children }: { children: React.ReactNode }) => {
    // Initial Defaults
    const defaultAnnouncement = {
        id: 'initial',
        enabled: false,
        title: "Welcome to the Official Site",
        message: "Stay tuned for the latest updates and highlights!",
        type: "celebration",
        startAt: new Date().toISOString(),
        endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        dismissible: true
    };

    const [announcement, setAnnouncement] = useState(defaultAnnouncement);
    const [loading, setLoading] = useState(true);
    const [isGlobalLoading, setIsGlobalLoading] = useState(true);
    const [hasSeenLoaderSession, setHasSeenLoaderSession] = useState(false);

    // Initial check for session storage
    useEffect(() => {
        const seen = sessionStorage.getItem('hasSeenGlobalLoader') === 'true';
        setHasSeenLoaderSession(seen);
        if (seen) setIsGlobalLoading(false);
    }, []);

    const markLoaderSeen = () => {
        sessionStorage.setItem('hasSeenGlobalLoader', 'true');
        setHasSeenLoaderSession(true);
    };


    // Fetch Config from Supabase
    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        if (!supabase) return;
        setLoading(true);

        const { data, error } = await supabase
            .from('site_config')
            .select('*');

        if (error) {
            console.error('Error fetching site config:', error);
        } else if (data) {
            // Map DB rows to state
            data.forEach(row => {
                if (row.key === 'announcement') setAnnouncement(row.value);
            });
        }
        setLoading(false);
    };

    // Helper to generic save to DB
    const saveToDB = async (key: string, value: any) => {
        if (!supabase) return;
        const { error } = await supabase
            .from('site_config')
            .upsert({ key, value });

        if (error) console.error(`Error saving ${key} config:`, error);
    };

    const updateAnnouncement = (newAnnouncement: any) => {
        const updated = { ...announcement, ...newAnnouncement };
        setAnnouncement(updated);
        saveToDB('announcement', updated);
    };

    return (
        <SiteConfigContext.Provider value={{
            announcement,
            updateAnnouncement,
            loading,
            isGlobalLoading,
            setIsGlobalLoading,
            hasSeenLoaderSession,
            markLoaderSeen,
            refreshConfig: fetchConfig
        }}>
            {children}
        </SiteConfigContext.Provider>
    );
};
