"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase";

export const LogoutAction = async () => {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return redirect("/login");
}