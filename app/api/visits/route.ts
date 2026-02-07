import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// POST: Create a new visit request
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fullName, email, phone, preferredDate, timeSlot, visitType, notes } = body;

        // Basic validation
        if (!fullName || !email || !preferredDate || !timeSlot) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from("visit_requests")
            .insert([
                {
                    full_name: fullName,
                    email,
                    phone: phone || null,
                    preferred_date: preferredDate,
                    time_slot: timeSlot,
                    visit_type: visitType || "campus_tour",
                    notes: notes || null,
                    status: "pending",
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json(
                { error: "Failed to schedule visit. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, visit: data }, { status: 201 });
    } catch (err) {
        console.error("API error:", err);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}

// GET: Fetch all visit requests (for admin)
export async function GET() {
    try {
        const { data, error } = await supabase
            .from("visit_requests")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase fetch error:", error);
            return NextResponse.json(
                { error: "Failed to fetch visits" },
                { status: 500 }
            );
        }

        return NextResponse.json({ visits: data });
    } catch (err) {
        console.error("API error:", err);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
