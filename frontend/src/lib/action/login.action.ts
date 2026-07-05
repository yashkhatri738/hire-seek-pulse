"use server";

import { LoginUserData, loginUserSchema } from "../schemaValidation/auth.schema";
import { createSupabaseServerClient } from "../supabase";

export const loginAction = async (data: LoginUserData) => {
  try {
    const parsed = loginUserSchema.safeParse(data);
    if (!parsed.success) {
      return {
        status: "ERROR",
        message: parsed.error.issues[0].message,
      };
    }
    const { email, password } = parsed.data;

    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return {
        status: "ERROR",
        message: authError?.message || "Invalid email or password",
      };
    }

    // Fetch the role from public users table to return for redirection
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (profileError || !userProfile) {
      return {
        status: "ERROR",
        message: "Failed to retrieve user profile details.",
      };
    }

    return {
      status: "SUCCESS",
      message: "Login successful",
      role: userProfile.role,
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
};
