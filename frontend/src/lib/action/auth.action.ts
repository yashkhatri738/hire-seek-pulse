"use server";

import { cookies } from "next/headers";
import crypto from "crypto";
import { redirect } from "next/navigation";
import { invalidSession } from "../user-case/session";

export const LogoutAction = async () => {
    const cookie = await cookies();
    const session = cookie.get("session")?.value;
    
    if (!session) return;
    
    const hasToken = crypto.createHash("sha256").update(session).digest("hex");
    
    await invalidSession(hasToken);

    return redirect("/login");
}