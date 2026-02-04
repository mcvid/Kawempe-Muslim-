/**
 * School Authentication Utilities
 * 
 * Handles School ID + Password authentication without requiring Gmail.
 * Converts School IDs (STU-0142) to internal emails (stu-0142@kawempe.local)
 */

import { createClient } from '@/utils/supabase/client';

// Internal domain for fake emails (Supabase requires email format)
const SCHOOL_DOMAIN = 'kawempe.local';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface SchoolProfile {
    id: string;
    school_id: string;
    full_name: string;
    role: UserRole;
    class_level: string | null;
    classes_taught: string[];
    subjects: string[];
    avatar_url: string | null;
    is_active: boolean;
    first_login: boolean;
}

/**
 * Convert School ID to internal email format
 * STU-0142 → stu-0142@kawempe.local
 */
export function schoolIdToEmail(schoolId: string): string {
    return `${schoolId.toLowerCase()}@${SCHOOL_DOMAIN}`;
}

/**
 * Convert internal email back to School ID
 * stu-0142@kawempe.local → STU-0142
 */
export function emailToSchoolId(email: string): string {
    return email.split('@')[0].toUpperCase();
}

/**
 * Validate School ID format
 * Valid: STU-0142, T-009, ADM-001
 */
export function isValidSchoolId(schoolId: string): boolean {
    const patterns = [
        /^STU-\d{4}$/,  // Student: STU-0142
        /^T-\d{3}$/,     // Teacher: T-009
        /^ADM-\d{3}$/    // Admin: ADM-001
    ];
    return patterns.some(pattern => pattern.test(schoolId.toUpperCase()));
}

/**
 * Get role from School ID prefix
 */
export function getRoleFromSchoolId(schoolId: string): UserRole {
    const upperSchoolId = schoolId.toUpperCase();
    if (upperSchoolId.startsWith('STU-')) return 'student';
    if (upperSchoolId.startsWith('T-')) return 'teacher';
    if (upperSchoolId.startsWith('ADM-')) return 'admin';
    return 'student'; // Default
}

/**
 * Login with School ID and Password
 */
export async function loginWithSchoolId(schoolId: string, password: string) {
    const supabase = createClient();
    const email = schoolIdToEmail(schoolId);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return { success: false, error: error.message };
    }

    // Fetch the user's profile
    const profile = await getSchoolProfile(data.user.id);

    if (!profile) {
        return { success: false, error: 'Profile not found' };
    }

    if (!profile.is_active) {
        await supabase.auth.signOut();
        return { success: false, error: 'Account is deactivated. Contact admin.' };
    }

    return {
        success: true,
        user: data.user,
        profile,
        firstLogin: profile.first_login
    };
}

/**
 * Set password for first-time login
 */
export async function setFirstPassword(schoolId: string, newPassword: string) {
    const supabase = createClient();
    const email = schoolIdToEmail(schoolId);

    // For first login, we use a temporary password that admin sets
    // Then the user updates to their own password
    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        return { success: false, error: error.message };
    }

    // Update first_login flag
    const { error: profileError } = await supabase
        .from('school_profiles')
        .update({ first_login: false })
        .eq('school_id', schoolId.toUpperCase());

    if (profileError) {
        return { success: false, error: profileError.message };
    }

    return { success: true };
}

/**
 * Get school profile by user ID
 */
export async function getSchoolProfile(userId: string): Promise<SchoolProfile | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('school_profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !data) return null;
    return data as SchoolProfile;
}

/**
 * Get school profile by School ID
 */
export async function getProfileBySchoolId(schoolId: string): Promise<SchoolProfile | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('school_profiles')
        .select('*')
        .eq('school_id', schoolId.toUpperCase())
        .single();

    if (error || !data) return null;
    return data as SchoolProfile;
}

/**
 * Get current logged-in user's profile
 */
export async function getCurrentProfile(): Promise<SchoolProfile | null> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return getSchoolProfile(user.id);
}

/**
 * Logout
 */
export async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
}

/**
 * Check if School ID exists in system
 */
export async function checkSchoolIdExists(schoolId: string): Promise<boolean> {
    const profile = await getProfileBySchoolId(schoolId);
    return profile !== null;
}

/**
 * Admin: Create a new user account
 * This creates both the auth user and the profile
 * Default password is the school ID itself (user must change on first login)
 */
export async function createSchoolAccount(
    schoolId: string,
    fullName: string,
    role: UserRole,
    classLevel?: string,
    classesTaught?: string[],
    subjects?: string[]
) {
    const supabase = createClient();
    const email = schoolIdToEmail(schoolId);
    const tempPassword = schoolId; // Temporary password = School ID

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true // Auto-confirm since we don't use real emails
    });

    if (authError) {
        return { success: false, error: authError.message };
    }

    // Create profile
    const { error: profileError } = await supabase
        .from('school_profiles')
        .insert({
            id: authData.user.id,
            school_id: schoolId.toUpperCase(),
            full_name: fullName,
            role,
            class_level: classLevel || null,
            classes_taught: classesTaught || [],
            subjects: subjects || [],
            first_login: true
        });

    if (profileError) {
        return { success: false, error: profileError.message };
    }

    return { success: true, user: authData.user };
}
