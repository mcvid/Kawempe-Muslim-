'use server';

import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { schoolIdToEmail } from '@/utils/auth/schoolAuth';

// Admin client with Service Role Key for creating users
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function registerStudent(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const class_name = formData.get('class_name') as string;
    const gender = formData.get('gender') as string;
    const admission_number = formData.get('admission_number') as string;
    const parent_name = formData.get('parent_name') as string;
    const parent_contact = formData.get('parent_contact') as string;

    if (!name || !class_name || !admission_number) {
        return { error: 'Missing required fields' };
    }

    try {
        // 1. Verify Requestor is Admin
        const supabase = await createServerClient();
        const { data: { user: requestor } } = await supabase.auth.getUser();

        if (!requestor) {
            return { error: 'Unauthorized: Not logged in. Please log out and sign in again to refresh your session.' };
        }

        // Check admin status using the service role client (bypasses RLS)
        const { data: profile, error: profileCheckError } = await supabaseAdmin
            .from('school_profiles')
            .select('role')
            .eq('id', requestor.id)
            .single();

        if (profileCheckError || !profile || profile.role !== 'admin') {
            console.error('Admin check failed:', profileCheckError, profile);
            return { error: 'Unauthorized: Only admins can register students' };
        }

        // 2. Prepare User Credentials
        // Default Email: STU-001@kawempe.local
        // Default Password: STU-001
        const email = schoolIdToEmail(admission_number);
        const password = admission_number.toUpperCase(); // Initial password is the ID

        // 3. Create Auth User (Supabase Auth)
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm
            user_metadata: {
                full_name: name,
                role: 'student'
            }
        });

        if (authError) {
            console.error('Auth User Creation Error:', authError);
            return { error: `Failed to create account: ${authError.message}` };
        }

        if (!authUser.user) return { error: 'Failed to create user object' };

        const userId = authUser.user.id;

        // 4. Create School Profile
        // Note: school_profiles usually has a trigger/RLS, but since we are using Service Role key
        // via basic insert (or if we used admin client for insert), we bypass RLS.
        // However, `supabaseAdmin` is a raw client.
        const { error: profileError } = await supabaseAdmin
            .from('school_profiles')
            .insert({
                id: userId,
                school_id: admission_number.toUpperCase(),
                full_name: name,
                role: 'student',
                class_level: class_name, // e.g., S1
                first_login: true,
                is_active: true
            });

        if (profileError) {
            // Rollback auth user if profile fails (manual simplified rollback)
            await supabaseAdmin.auth.admin.deleteUser(userId);
            return { error: `Failed to create school profile: ${profileError.message}` };
        }

        // 5. Create Student Record (The Registry)
        // This is redundancy effectively, but per requirements we keep the registry table.
        // We can link it to the user ID if we want future consistency.
        const { error: registryError } = await supabaseAdmin
            .from('students')
            .insert({
                // id: userId, // Optimization: Use the same ID? The schema has default uuid, let's keep it separate or update schema later.
                name,
                class_name,
                gender,
                admission_number,
                parent_name,
                parent_contact
            });

        if (registryError) {
            console.error('Registry Error:', registryError);
            // We don't rollback the account here, just warn. 
            // Ideally we should transaction this, but Supabase HTTP API doesn't support convenient transactions across Auth & Public schemes easily without stored procedures.
            return { message: 'Account created, but failed to add to registry table. Please contact support.', success: false };
        }

        return { success: true, message: 'Student registered successfully!' };

    } catch (err: any) {
        console.error('Registration Error:', err);
        return { error: 'Internal Server Error: ' + err.message };
    }
}
