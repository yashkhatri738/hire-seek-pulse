import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { getIPAddress } from "./location";
import { db } from "@/config/db";
import {  sessions, users } from "@/drizzle/schema";
import { SESSION_LIFETIME } from "@/config/constants";
import { eq } from "drizzle-orm";

type createUserSessionParams = {
  token: string;
  userId: number;
  userAgent: string;
  ip: string;
};

const generateToken = () => {
  return crypto.randomBytes(48).toString("hex").normalize();
};

const createUserSession = async ({
  token,
  userId,
  userAgent,
  ip,
}: createUserSessionParams) => {
  const hasToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    // Remove any existing sessions for this user to avoid duplicate rows
    await db.delete(sessions).where(eq(sessions.userId, userId));
    // Drizzle's insert result for mysql2 is not an array — don't destructure it.
    const result = await db.insert(sessions).values({
      userId,
      id: hasToken,
      userAgent,
      ip,
      expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000), // 30 days
    });
    return result;
  } catch (dbError) {
    console.error("createUserSession: DB insert error:", dbError);
    throw dbError;
  }
};

export const createUserSessionAndSetCookies = async (userId: number) => {
  const token = generateToken();
  const ip = await getIPAddress();
  const headersList = await headers();

  await createUserSession({
    token,
    userId: userId,
    userAgent: headersList.get("user-agent") || "",
    ip: ip,
  });

  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    maxAge: SESSION_LIFETIME,
    path: "/",
    secure: true,
  });
};

export const validSessionAndGetUser = async (session: string) => {
  try {
    const hashToken = crypto
      .createHash("sha256")
      .update(session)
      .digest("hex");

    const [user] = await db
      .select({
        id: users.id,
        session: {
          id: sessions.id,
          expiresAt: sessions.expiresAt,
          userAgent: sessions.userAgent,
          ip: sessions.ip,
        },
        name: users.name,
        userName: users.userName,
        email: users.email,
        role: users.role,
        phoneNumber: users.phoneNumber,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(eq(sessions.id, hashToken));

    //  No session found
    if (!user) return null;

    //  Session expired
    if (user.session.expiresAt.getTime() < Date.now()) {
      await invalidSession(user.session.id);
      await clearSessionCookie();
      return null; 
    }

    //  Extend valid session
    await extendSession(user.session.id);

    return user;
  } catch (error) {
    console.error("validSessionAndGetUser error:", error);
    return null; 
  }
};

export const clearSessionCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("session");
};


export const invalidSession = async (sessionId: string) => {
  try {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  } catch (dbError) {
    console.error("invalidSession: DB delete error:", dbError);
    throw dbError;
  } 
};

const extendSession = async (sessionId: string) => {
  try {
    await db.update(sessions)
      .set({
        expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000), // 30 days
      })
      .where(eq(sessions.id, sessionId));
  } catch (dbError) {
    console.error("extendSession: DB update error:", dbError);
    throw dbError;
  }
}