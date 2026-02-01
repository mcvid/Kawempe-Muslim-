'use server';

import { createClient } from '@/utils/supabase/server';

export interface KMSSEvent {
    id: string;
    title: string;
    description: string;
    event_date: string;
    location: string;
    category: string;
    image_url: string;
    interest_id: string;
    is_featured: boolean;
    is_liked?: boolean;
    like_count?: number;
    event_interests?: {
        id: string;
        name: string;
        color: string;
    };
}

export async function createEventUser(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get('name') as string;
    const nickname = formData.get('nickname') as string;
    const interests = JSON.parse(formData.get('interests') as string);
    const avatarFile = formData.get('avatar') as File | null;

    if (!name) return { error: 'Name is required' };

    let avatarUrl = '';

    // 1. Upload Avatar if provided
    if (avatarFile && avatarFile.size > 0) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, avatarFile);

        if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);
            avatarUrl = publicUrl;
        }
    }

    // 2. Create User
    const { data: user, error: userError } = await supabase
        .from('event_users')
        .insert({
            full_name: name,
            nickname: nickname || null,
            avatar_url: avatarUrl
        })
        .select()
        .single();

    if (userError) return { error: userError.message };

    // 3. Add Interests
    const interestInserts = interests.map((interestId: string) => ({
        user_id: user.id,
        interest_id: interestId
    }));

    const { error: interestError } = await supabase
        .from('event_user_interests')
        .insert(interestInserts);

    if (interestError) return { error: interestError.message };

    return { success: true, userId: user.id };
}

export async function updateEventUser(userId: string, formData: FormData) {
    const supabase = await createClient();
    const name = formData.get('name') as string;
    const nickname = formData.get('nickname') as string;
    const interests = JSON.parse(formData.get('interests') as string);
    const avatarFile = formData.get('avatar') as File | null;
    let avatarUrl = formData.get('avatarUrl') as string || '';

    if (!name) return { error: 'Name is required' };

    // 1. Upload Avatar if provided
    if (avatarFile && avatarFile.size > 0) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, avatarFile);

        if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);
            avatarUrl = publicUrl;
        }
    }

    // 2. Update User
    const { error: userError } = await supabase
        .from('event_users')
        .update({
            full_name: name,
            nickname: nickname || null,
            avatar_url: avatarUrl
        })
        .eq('id', userId);

    if (userError) return { error: userError.message };

    // 3. Update Interests (Delete and Re-insert)
    await supabase.from('event_user_interests').delete().eq('user_id', userId);

    const interestInserts = interests.map((interestId: string) => ({
        user_id: userId,
        interest_id: interestId
    }));

    const { error: interestError } = await supabase
        .from('event_user_interests')
        .insert(interestInserts);

    if (interestError) return { error: interestError.message };

    return { success: true, userId };
}

export async function generateGoogleCalendarLink(event: KMSSEvent) {
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || '');
    const location = encodeURIComponent(event.location || '');

    // Format date to YYYYMMDDTHHmmSSZ
    const startDate = new Date(event.event_date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

    const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const dates = `${formatDate(startDate)}/${formatDate(endDate)}`;

    return `${baseUrl}&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}

export async function getInterests() {
    const supabase = await createClient();
    const { data } = await supabase.from('event_interests').select('*').order('name');
    return data || [];
}

export async function getUserInterests(userId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('event_user_interests')
        .select('interest_id')
        .eq('user_id', userId);
    return data?.map(d => d.interest_id) || [];
}

export async function getUserProfile(userId: string) {
    const supabase = await createClient();
    const { data } = await supabase.from('event_users').select('*').eq('id', userId).single();
    return data;
}

export async function toggleLikeEvent(userId: string, eventId: string) {
    const supabase = await createClient();

    // Check if already liked
    const { data: existing } = await supabase
        .from('event_likes')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .single();

    if (existing) {
        await supabase
            .from('event_likes')
            .delete()
            .eq('user_id', userId)
            .eq('event_id', eventId);
        return { liked: false };
    } else {
        await supabase
            .from('event_likes')
            .insert({ user_id: userId, event_id: eventId });
        return { liked: true };
    }
}

export async function getEvents(userId: string) {
    const supabase = await createClient();

    // Get user interests
    const { data: userInterests } = await supabase
        .from('event_user_interests')
        .select('interest_id')
        .eq('user_id', userId);

    const interestIds = userInterests?.map((ui: { interest_id: string }) => ui.interest_id) || [];

    // Get user likes (for personalized status)
    const { data: userLikes } = await supabase
        .from('event_likes')
        .select('event_id')
        .eq('user_id', userId);

    const likedEventIds = userLikes?.map(ul => ul.event_id) || [];

    // Get ALL likes for trending calculation
    const { data: allLikes } = await supabase
        .from('event_likes')
        .select('event_id');

    // Count likes per event
    const likeCounts: Record<string, number> = {};
    allLikes?.forEach(like => {
        likeCounts[like.event_id] = (likeCounts[like.event_id] || 0) + 1;
    });

    // Fetch all events joined with interests
    const { data: events } = await supabase
        .from('events')
        .select(`
      *,
      event_interests (
        id,
        name,
        color
      )
    `)
        .order('event_date', { ascending: true });

    if (!events) return { featured: [], forYou: [], nearby: [] };

    const eventList = (events as unknown as KMSSEvent[]).map(e => ({
        ...e,
        is_liked: likedEventIds.includes(e.id),
        like_count: likeCounts[e.id] || 0
    }));

    const featured = eventList.filter((e) => e.is_featured);

    /**
     * "For You" Algorithm:
     * - Matches user interests
     * - OR personally liked by the user
     * - OR is "Trending" (has 5+ community likes)
     */
    const forYou = eventList.filter((e) => {
        if (e.is_featured) return false;

        const isInterestMatch = interestIds.includes(e.interest_id);
        const isPersonallyLiked = e.is_liked;
        const isTrending = (e.like_count || 0) >= 5;

        return isInterestMatch || isPersonallyLiked || isTrending;
    });

    // Nearby is anything else not featured or in forYou
    const nearby = eventList.filter((e) => {
        if (e.is_featured) return false;
        const isInForYou = forYou.some(fe => fe.id === e.id);
        return !isInForYou;
    });

    return { featured, forYou, nearby };
}
