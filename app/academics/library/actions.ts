'use server';

import { createClient } from '@/utils/supabase/server';

export async function getSubjects(level: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('subjects')
        .select(`
            *,
            past_papers(count),
            resources(count)
        `)
        .eq('level', level)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    return data?.map(subject => ({
        ...subject,
        papersCount: subject.past_papers?.[0]?.count || 0,
        resourcesCount: subject.resources?.[0]?.count || 0
    })) || [];
}

export async function getSubjectYears(level: string, subjectName: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('past_papers')
        .select('year')
        .eq('level', level)
        .eq('subject', subjectName)
        .order('year', { ascending: false });

    if (!data) return [];

    // Count papers per year
    const counts: Record<number, number> = {};
    data.forEach(p => {
        counts[p.year] = (counts[p.year] || 0) + 1;
    });

    return Object.entries(counts).map(([year, count]) => ({
        year: parseInt(year),
        filesCount: count
    }));
}

export async function getPapers(level: string, subjectName: string, year?: number) {
    const supabase = await createClient();
    let query = supabase
        .from('past_papers')
        .select('*')
        .eq('level', level)
        .eq('subject', subjectName);

    if (year) {
        query = query.eq('year', year);
    }

    const { data } = await query.order('year', { ascending: false }).order('title', { ascending: true });
    return data || [];
}

export async function getResources(level: string, subjectName?: string) {
    const supabase = await createClient();
    let query = supabase
        .from('resources')
        .select('*')
        .eq('level', level);

    if (subjectName) {
        query = query.eq('subject', subjectName);
    }

    const { data } = await query.order('created_at', { ascending: false });
    return data || [];
}

// Admin Actions
export async function addSubject(subject: { name: string; level: string; code?: string; icon?: string; sort_order?: number }) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('subjects')
        .insert([subject])
        .select()
        .single();

    if (error) return { error: error.message };
    return { success: true, data };
}

export async function updateSubject(id: string, updates: any) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}

export async function deleteSubject(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}
