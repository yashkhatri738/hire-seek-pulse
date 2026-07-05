"use server"

import { createSupabaseServerClient } from "../../supabase";
import { getCurrentUser } from "../auth.quires";
import { revalidatePath } from "next/cache";

export const getEmployerReceivedApplications = async () => {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "employer") {
            return { status: "ERROR", data: [] };
        }

        const supabase = await createSupabaseServerClient();

        // 1. Fetch this employer's jobs
        const { data: myJobs, error: jobsError } = await supabase
            .from("jobs")
            .select("id")
            .eq("employer_id", user.id);

        if (jobsError) throw jobsError;

        const jobIds = (myJobs || []).map(j => j.id);

        if (jobIds.length === 0) {
            return { status: "SUCCESS", data: [] };
        }

        // 2. Fetch all applications linked to these job IDs
        const { data: list, error: appsError } = await supabase
            .from("job_applications")
            .select(`
                *,
                job:jobs (
                    *
                ),
                applicantInfo:applicants (
                    *
                ),
                userAccount:users (
                    *
                )
            `)
            .in("job_id", jobIds)
            .order("applied_at", { ascending: false });

        if (appsError) throw appsError;

        // Map column names for compatibility
        const formatted = (list || []).map((app: any) => ({
            application: {
                id: app.id,
                jobId: app.job_id,
                applicantId: app.applicant_id,
                name: app.name,
                email: app.email,
                phoneNumber: app.phone_number,
                resumeUrl: app.resume_url,
                coverLetter: app.cover_letter,
                linkedInUrl: app.linkedin_url,
                githubUrl: app.github_url,
                portfolioUrl: app.portfolio_url,
                yearsOfExperience: app.years_of_experience,
                status: app.status,
                employerNotes: app.employer_notes,
                appliedAt: app.applied_at,
                updatedAt: app.updated_at
            },
            job: {
                id: app.job.id,
                title: app.job.title,
                employersId: app.job.employer_id,
                description: app.job.description,
                tags: app.job.tags,
                minSalary: app.job.min_salary,
                maxSalary: app.job.max_salary,
                salaryCurrency: app.job.salary_currency,
                salaryPeriod: app.job.salary_period,
                location: app.job.location,
                jobType: app.job.job_type,
                workType: app.job.work_type,
                jobLevel: app.job.job_level,
                experience: app.job.experience,
                minEducation: app.job.min_education,
                isFeatured: app.job.is_featured,
                expiresAt: app.job.expires_at,
                deletedAt: app.job.deleted_at,
                createdAt: app.job.created_at,
                updatedAt: app.job.updated_at
            },
            applicantInfo: app.applicantInfo ? {
                id: app.applicantInfo.id,
                biography: app.applicantInfo.biography,
                dateOfBirth: app.applicantInfo.date_of_birth,
                nationality: app.applicantInfo.nationality,
                resumeUrl: app.applicantInfo.resume_url,
                avatarUrl: app.applicantInfo.avatar_url,
                maritalStatus: app.applicantInfo.marital_status,
                gender: app.applicantInfo.gender,
                education: app.applicantInfo.education,
                experience: app.applicantInfo.experience,
                projects: app.applicantInfo.projects,
                skills: app.applicantInfo.skills,
                websiteUrl: app.applicantInfo.website_url,
                location: app.applicantInfo.location,
                deletedAt: app.applicantInfo.deleted_at,
                createdAt: app.applicantInfo.created_at,
                updatedAt: app.applicantInfo.updated_at
            } : null,
            userAccount: app.userAccount ? {
                id: app.userAccount.id,
                name: app.userAccount.name,
                userName: app.userAccount.username,
                email: app.userAccount.email,
                role: app.userAccount.role,
                phoneNumber: app.userAccount.phone_number,
                avatarUrl: app.userAccount.avatar_url,
                deletedAt: app.userAccount.deleted_at,
                createdAt: app.userAccount.created_at,
                updatedAt: app.userAccount.updated_at
            } : null
        }));

        return { status: "SUCCESS", data: formatted };
    } catch (error) {
         console.error("Error fetching employer applications:", error);
         return { status: "ERROR", data: [] };
    }
}

export const updateApplicationStatus = async (applicationId: number, status: string) => {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "employer") {
            return { status: "ERROR", message: "Unauthorized" };
        }

        const supabase = await createSupabaseServerClient();
        const { error } = await supabase
            .from("job_applications")
            .update({ status: status as any })
            .eq("id", applicationId);

        if (error) throw error;

        revalidatePath(`/employer/candidates`);
        
        return { status: "SUCCESS", message: "Application status updated successfully." };
    } catch (error: any) {
        console.error("Error updating application status:", error);
        return { status: "ERROR", message: error?.message || "Failed to update status." };
    }
}
