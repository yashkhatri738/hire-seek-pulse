"use server";

import {
  ForgotPasswordData,
  forgotPasswordSchema,
  UpdatePasswordData,
  updatePasswordSchema,
} from "../schemaValidation/auth.schema";
import { createSupabaseServerClient } from "../supabase";

export const requestPasswordResetAction = async (
  data: ForgotPasswordData,
  originUrl?: string
) => {
  try {
    const parsed = forgotPasswordSchema.safeParse(data);
    if (!parsed.success) {
      return {
        status: "ERROR",
        message: parsed.error.issues[0].message,
      };
    }

    const { email } = parsed.data;
    const supabase = await createSupabaseServerClient();

    const redirectTo = originUrl
      ? `${originUrl}/reset-password`
      : `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      return {
        status: "ERROR",
        message: error.message || "Failed to send password reset email.",
      };
    }

    return {
      status: "SUCCESS",
      message: "Password reset instructions have been sent to your email address.",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
};

export const updatePasswordAction = async (data: UpdatePasswordData) => {
  try {
    const parsed = updatePasswordSchema.safeParse(data);
    if (!parsed.success) {
      return {
        status: "ERROR",
        message: parsed.error.issues[0].message,
      };
    }

    const { password } = parsed.data;
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return {
        status: "ERROR",
        message: error.message || "Failed to update password.",
      };
    }

    return {
      status: "SUCCESS",
      message: "Your password has been successfully updated.",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
};
