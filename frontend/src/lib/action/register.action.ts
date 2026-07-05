"use server";

import {
  RegisterUserData,
  registerUserSchema,
} from "../schemaValidation/auth.schema";
import { createSupabaseServerClient } from "../supabase";

export const registrationAction = async (data: RegisterUserData) => {
  try {
    const parsed = registerUserSchema.safeParse(data);
    if (!parsed.success) {
      return {
        status: "ERROR",
        message: parsed.error.issues[0].message,
      };
    }
    const { name, userName, email, phoneNumber, password, role } = parsed.data;

    const supabase = await createSupabaseServerClient();
    
    // Check if user email or username exists in the public profiles first
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email, username")
      .or(`email.eq.${email},username.eq.${userName}`)
      .maybeSingle();

    if (existingUser) {
      if (existingUser.email === email) {
        return {
          status: "ERROR",
          message: "Email already registered",
        };
      }
      if (existingUser.username === userName) {
        return {
          status: "ERROR",
          message: "Username already taken",
        };
      }
    }

    // Sign up using Supabase Auth. Triggers in the database will auto-populate public profile tables.
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username: userName,
          role,
          phone_number: phoneNumber,
        },
      },
    });

    if (authError || !authData.user) {
      return {
        status: "ERROR",
        message: authError?.message || "Registration failed",
      };
    }

    return {
      status: "SUCCESS",
      message: "Registration successful",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Registration failed",
    };
  }
};
