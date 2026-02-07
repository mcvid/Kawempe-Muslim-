import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const DAILY_API_URL = 'https://api.daily.co/v1/rooms';
const DAILY_API_KEY = process.env.DAILY_API_KEY;

/**
 * API Route to create Daily.co rooms securely
 */
export async function POST(req: Request) {
    try {
        if (!DAILY_API_KEY) {
            console.error('DAILY_API_KEY is not configured');
            return NextResponse.json(
                { error: 'Daily.co API key is missing. Please add it to .env.local' },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { name, properties } = body;

        // Create a room via Daily.co REST API
        const response = await fetch(DAILY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${DAILY_API_KEY}`,
            },
            body: JSON.stringify({
                name,
                properties: {
                    enable_chat: true,
                    enable_knocking: true,
                    enable_screenshare: true,
                    exp: Math.round(Date.now() / 1000) + 3600 * 24,
                    ...properties
                }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Daily.co API error:', data);
            return NextResponse.json(
                { error: data.error || 'Failed to create meeting room' },
                { status: response.status }
            );
        }

        // Initialize Supabase client
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (!supabaseUrl) {
            console.error('NEXT_PUBLIC_SUPABASE_URL is missing');
            return NextResponse.json({ error: 'Supabase URL is missing' }, { status: 500 });
        }

        // Identification disabled to prevent hangs in API routes
        const creator_id = null;

        // Initialize the client for the operation
        const supabase = serviceRoleKey
            ? createAdminClient(supabaseUrl, serviceRoleKey)
            : await createServerClient();

        const { error: dbError } = await supabase
            .from('meeting_sessions')
            .insert({
                room_name: data.name,
                room_url: data.url,
                title: body.title || 'Untitled Meeting',
                description: body.description || '',
                creator_id: creator_id,
                meeting_type: body.meeting_type || 'instant',
                scheduled_start: body.scheduled_start,
                scheduled_end: body.scheduled_end
            });

        if (dbError) {
            console.error('Database error storing meeting:', dbError);
            return NextResponse.json(
                { error: 'Database error: ' + dbError.message, details: dbError },
                { status: 500 }
            );
        }

        return NextResponse.json({
            url: data.url,
            name: data.name,
            config: data.config
        });
    } catch (error) {
        console.error('Error creating Daily room:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET room details by name (Proxies DB access for guests)
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const roomName = searchParams.get('name');

    if (!roomName) {
        return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
    }

    try {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (!supabaseUrl) {
            return NextResponse.json({ error: 'Supabase URL is missing' }, { status: 500 });
        }

        const supabase = serviceRoleKey
            ? createAdminClient(supabaseUrl, serviceRoleKey)
            : await createServerClient();

        const { data: meetingData, error } = await supabase
            .from('meeting_sessions')
            .select('*')
            .eq('room_name', roomName)
            .single();

        if (error || !meetingData) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
        }

        return NextResponse.json(meetingData);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
    }
}



