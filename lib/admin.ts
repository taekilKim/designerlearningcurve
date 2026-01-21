import { createClient } from "@/lib/supabase/server";

/**
 * Check if the current user is an admin
 * @returns true if user is admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return profile?.is_admin === true;
}

/**
 * Get current user's admin status and profile
 * @returns object with user, profile, and isAdmin flag
 */
export async function getAdminStatus() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, isAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    user,
    profile,
    isAdmin: profile?.is_admin === true,
  };
}

/**
 * Require admin access - redirect to home if not admin
 * Use this in server components that require admin access
 */
export async function requireAdmin() {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { redirect: null };
}
