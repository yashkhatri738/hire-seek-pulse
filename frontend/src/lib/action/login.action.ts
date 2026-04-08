"use server";

import { db } from "@/config/db";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { LoginUserData, loginUserSchema } from "../schemaValidation/auth.schema";
import { users } from "@/drizzle/schema";
import { createUserSessionAndSetCookies } from "../user-case/session";

export const loginAction = async (data: LoginUserData) => {
  try {
    const parsed = loginUserSchema.safeParse(data);
    if (!parsed.success) {
      return {
        status: "ERROR",
        message: parsed.error.issues[0].message,
      };
    }
    const LoginValidation = parsed.data; 
    const { email, password } = LoginValidation;
   
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email,email));
    
    if (!user) {
        console.log("Login attempt: user not found for email:", email);
        return {
          status: "ERROR",
          message: "Invalid email or password",
        };
      }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return {
        status: "ERROR",
        message: "Invalid email or password",
      };
    }

    try {
      await createUserSessionAndSetCookies(user.id);
    } catch (sessionError) {
      console.error("Login: session creation error for user id:", user.id, sessionError);
      throw sessionError; // rethrow so outer catch returns 'Login failed'
    }

    return {
      status: "SUCCESS",
      message: "Login successful",
      role: user.role,
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
};
