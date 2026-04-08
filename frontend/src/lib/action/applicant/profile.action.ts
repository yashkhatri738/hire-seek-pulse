"use server"

import { db } from "@/config/db";
import { applicants, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "../auth.quires";
import { ApplicantFormData, applicantSchema } from "@/lib/schemaValidation/applicant.schema";
import { revalidatePath } from "next/cache";

export const getApplicantProfile = async () => {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "applicant") {
            return null;
        }

        const result = await db.select()
            .from(applicants)
            .where(eq(applicants.id, user.id))
            .leftJoin(users, eq(users.id, applicants.id))
            .limit(1);

        if (!result || result.length === 0) return null;

        // Structure it to match the previous response for compatibility
        return {
            ...result[0].applicants,
            user: result[0].users
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

        await db.transaction(async (tx) => {
            // Update users table
            await tx.update(users)
                .set({ 
                    name: validated.data.name, 
                    email: validated.data.email, 
                    phoneNumber: validated.data.phoneNumber, 
                    avatarUrl: validated.data.avatarUrl 
                })
                .where(eq(users.id, userAuth.id));

            // Update applicants table
            await tx.update(applicants)
                .set({ 
                    biography: validated.data.biography,
                    dateOfBirth: validated.data.dateOfBirth ? new Date(validated.data.dateOfBirth) : null,
                    nationality: validated.data.nationality,
                    resumeUrl: validated.data.resumeUrl,
                    avatarUrl: validated.data.avatarUrl,
                    maritalStatus: validated.data.maritalStatus,
                    gender: validated.data.gender,
                    education: validated.data.education,
                    experience: validated.data.experience,
                    projects: validated.data.projects,
                    skills: validated.data.skills,
                    websiteUrl: validated.data.websiteUrl,
                    location: validated.data.location,
                })
                .where(eq(applicants.id, userAuth.id));
        });

        revalidatePath("/profile");
        return { status: "SUCCESS", message: "Profile updated successfully" };
    } catch (error) {
        console.error("Error updating profile", error);
        return { status: "ERROR", message: "Failed to update profile" };
    }
}
