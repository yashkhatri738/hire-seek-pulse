"use server"

import { getCurrentUser } from "../auth.quires";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../supabase";

export type ApplicationInput = {
    jobId: number;
    name: string;
    email: string;
    phoneNumber?: string;
    resumeUrl: string;
    coverLetter?: string;
    linkedInUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    yearsOfExperience?: string;
}

export const submitApplication = async (data: ApplicationInput) => {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "applicant") {
            return { status: "ERROR", message: "Unauthorized or not an applicant." };
        }

        const supabase = await createSupabaseServerClient();

        // Check if already applied
        const { data: existing, error: checkError } = await supabase
            .from("job_applications")
            .select("id")
            .eq("job_id", data.jobId)
            .eq("applicant_id", user.id);

        if (checkError) throw checkError;

        if (existing && existing.length > 0) {
            return { status: "ERROR", message: "You have already applied for this job." };
        }

        const { error: insertError } = await supabase
            .from("job_applications")
            .insert({
                job_id: data.jobId,
                applicant_id: user.id,
                name: data.name,
                email: data.email,
                phone_number: data.phoneNumber || "",
                resume_url: data.resumeUrl,
                cover_letter: data.coverLetter || "",
                linkedin_url: data.linkedInUrl || "",
                github_url: data.githubUrl || "",
                portfolio_url: data.portfolioUrl || "",
                years_of_experience: data.yearsOfExperience || "",
                status: "applied"
            });

        if (insertError) throw insertError;

        revalidatePath(`/jobs/${data.jobId}`);
        revalidatePath(`/applications`);
        
        return { status: "SUCCESS", message: "Application submitted successfully." };
    } catch (error: any) {
        console.error("Error submitting application:", error);
        return { status: "ERROR", message: error?.message || "Failed to submit application." };
    }
}

export const getMyApplications = async () => {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "applicant") {
            return { status: "ERROR", data: [] };
        }

        const supabase = await createSupabaseServerClient();
        const { data: list, error } = await supabase
            .from("job_applications")
            .select(`
                *,
                job:jobs (
                    *,
                    employer:employers (
                        *
                    )
                )
            `)
            .eq("applicant_id", user.id)
            .order("applied_at", { ascending: false });

        if (error) throw error;

        // Map format to match original: { application, job, employer }
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
            employer: app.job.employer ? {
                id: app.job.employer.id,
                name: app.job.employer.name,
                description: app.job.employer.description,
                avatarUrl: app.job.employer.avatar_url,
                bannerImageUrl: app.job.employer.banner_image_url,
                organizationType: app.job.employer.organization_type,
                teamSize: app.job.employer.team_size,
                yearOfEstablishment: app.job.employer.year_of_establishment,
                websiteUrl: app.job.employer.website_url,
                location: app.job.employer.location,
                deletedAt: app.job.employer.deleted_at,
                createdAt: app.job.employer.created_at,
                updatedAt: app.job.employer.updated_at
            } : null
        }));

        return { status: "SUCCESS", data: formatted };
    } catch (error) {
         console.error("Error fetching applications:", error);
         return { status: "ERROR", data: [] };
    }
}
