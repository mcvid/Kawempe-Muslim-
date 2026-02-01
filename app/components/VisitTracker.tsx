"use client";

import { useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function VisitTracker() {
    useEffect(() => {
        const trackVisit = async () => {
            if (typeof window === 'undefined') return;

            const hasVisited = sessionStorage.getItem('visited_today');
            if (!hasVisited) {
                try {
                    // This calls the session event trigger in your database
                    const { error } = await supabase.rpc('increment_visit_count');

                    if (!error) {
                        sessionStorage.setItem('visited_today', 'true');
                    }
                } catch (e) {
                    console.error("Visit tracking failed", e);
                }
            }
        };
        trackVisit();
    }, []);
    return null;
}
