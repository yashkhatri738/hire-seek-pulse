"use server"

import { getCurrentUser } from "../auth.quires";
import { ApplicantFormData, applicantSchema } from "@/lib/schemaValidation/applicant.schema";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../supabase";

export const getApplicantProfile = async () => {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "applicant") {
            return null;
        }

        const supabase = await createSupabaseServerClient();
        const { data: profile, error } = await supabase
            .from("applicants")
            .select(`
                *,
                user:users (
                    *
                )
            `)
            .eq("id", user.id)
            .maybeSingle();

        if (error || !profile) return null;

        return {
            ...profile,
            user: profile.user
        };
    } catch (error) {
        console.error("Error fetching applicant profile", error);
        return null;
    }
}

export const updateApplicantProfile = async (data: ApplicantFormData) => {
    try {
        const validated = applicantSchema.safeParse(data);
        if (!validated.success) {
            return { status: "ERROR", message: "Invalid data" };
        }

        const userAuth = await getCurrentUser();
        if (!userAuth || userAuth.role !== "applicant") {
            return { status: "ERROR", message: "Unauthorized" };
        }

        const supabase = await createSupabaseServerClient();

        // Update public users profile details
        const { error: userError } = await supabase
            .from("users")
            .update({ 
                name: validated.data.name, 
                email: validated.data.email, 
                phone_number: validated.data.phoneNumber, 
                avatar_url: validated.data.avatarUrl 
            })
            .eq("id", userAuth.id);

        if (userError) {
            console.error("User profile update error:", userError);
            return { status: "ERROR", message: "Failed to update profile details" };
        }

        // Update applicant specifics
        const { error: applicantError } = await supabase
            .from("applicants")
            .update({ 
                biography: validated.data.biography,
                date_of_birth: validated.data.dateOfBirth ? new Date(validated.data.dateOfBirth).toISOString().split('T')[0] : null,
                nationality: validated.data.nationality,
                resume_url: validated.data.resumeUrl,
                avatar_url: validated.data.avatarUrl,
                marital_status: validated.data.maritalStatus,
                gender: validated.data.gender,
                education: validated.data.education,
                experience: validated.data.experience,
                projects: validated.data.projects,
                skills: validated.data.skills,
                website_url: validated.data.websiteUrl,
                location: validated.data.location,
            })
            .eq("id", userAuth.id);

        if (applicantError) {
            console.error("Applicant profile update error:", applicantError);
            return { status: "ERROR", message: "Failed to update profile specifics" };
        }

        revalidatePath("/profile");
        return { status: "SUCCESS", message: "Profile updated successfully" };
    } catch (error) {
        console.error("Error updating profile", error);
        return { status: "ERROR", message: "Failed to update profile" };
    }
}
