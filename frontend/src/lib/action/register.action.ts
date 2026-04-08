"use server";

import { db } from "@/config/db";
import { applicants, employers, users } from "@/drizzle/schema";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import {
  RegisterUserData,
  registerUserSchema,
} from "../schemaValidation/auth.schema";
import { createUserSessionAndSetCookies } from "../user-case/session";

export const registrationAction = async (data: RegisterUserData) => {
  try {
    const parsed = registerUserSchema.safeParse(data);
    if (!parsed.success) {
      return {
        status: "ERROR",
        message: parsed.error.issues[0].message,
      };
    }
    const RegisterValidation = parsed.data;

    const { name, userName, email, phoneNumber, password, role } =
      RegisterValidation;

    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.userName, userName)));

    if (user) {
      if (user.email === email) {
        return {
          status: "ERROR",
          message: "Email already registered",
        };
      }
      if (user.userName === userName) {
        return {
          status: "ERROR",
          message: "Username already taken",
        };
      }
    }

    const hashPassword = await bcrypt.hash(password, 12);

    await db.insert(users).values({
      name,
      userName,
      email,
      phoneNumber,
      password: hashPassword,
      role,
    });

    // After inserting, fetch the newly created user to get its id.
    const [newUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!newUser) {
      return {
        status: "ERROR",
        message: "Registration failed: created user not found",
      };
    }

    // Depending on the role, insert into the respective table
    if (newUser.role === "employer") {
      await db.insert(employers).values({
        id: newUser.id,
      });
    }

    if (newUser.role === "applicant") {
      await db.insert(applicants).values({
        id: newUser.id,
      });
    }
        
    try {
      await createUserSessionAndSetCookies(newUser.id);
    } catch (sessionError) {
      console.error(
        "Registration: session creation error for user id:",
        newUser.id,
        sessionError
      );
      throw sessionError;
    }

    return {
      status: "SUCCESS",
      message: "Registration successful",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Registration failed",
    };
  }
};
