import { cache } from "react";
import { createSupabaseServerClient } from "../supabase";

export const getCurrentUser = cache(async () => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) return null;

    // Fetch corresponding public profile
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("id, name, username, email, role, phone_number, avatar_url, created_at, updated_at")
      .eq("id", authUser.id)
      .maybeSingle();

    if (profileError || !userProfile) return null;

    return {
      id: userProfile.id,
      name: userProfile.name,
      userName: userProfile.username,
      email: userProfile.email,
      role: userProfile.role,
      phoneNumber: userProfile.phone_number,
      avatarUrl: userProfile.avatar_url,
      createdAt: new Date(userProfile.created_at),
      updatedAt: new Date(userProfile.updated_at),
    };
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null; 
  }
});
