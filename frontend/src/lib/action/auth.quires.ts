import { cookies } from "next/headers";
import { cache } from "react";
import { validSessionAndGetUser } from "../user-case/session";
export const getCurrentUser = cache(async () => {
  try {
    const cookie = await cookies();
    const session = cookie.get("session")?.value;

    if (!session) return null;

    const user = await validSessionAndGetUser(session);
    return user;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null; 
  }
});
