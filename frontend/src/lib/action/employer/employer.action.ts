"use server"

import { getCurrentUser } from "../auth.quires"
import { EmployerProfileData } from "@/lib/schemaValidation/employer.schema";
import { createSupabaseServerClient } from "../../supabase";

export const getEmployerDetails = async () => {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== "employer") {
            return {
                status: "ERROR",
                message: "Unauthorized",
            }
        }

        const supabase = await createSupabaseServerClient();
        const { data: employer, error } = await supabase
            .from("employers")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

        if (error || !employer) {
            throw error || new Error("Employer not found");
        }

        // Map column naming conventions: e.g. year_of_establishment -> yearOfEstablishment, banner_image_url -> bannerImageUrl
        const formatted = {
            id: employer.id,
            name: employer.name,
            description: employer.description,
            avatarUrl: employer.avatar_url,
            bannerImageUrl: employer.banner_image_url,
            organizationType: employer.organization_type,
            teamSize: employer.team_size,
            yearOfEstablishment: employer.year_of_establishment,
            websiteUrl: employer.website_url,
            location: employer.location,
            deletedAt: employer.deleted_at,
            createdAt: employer.created_at,
            updatedAt: employer.updated_at
        };

        return {
            status: "SUCCESS",
            data: formatted
        }
    } catch (error) {
        console.error("Error fetching employer details:", error);
        return {
            status: "ERROR",
            message: "Failed to fetch employer details",
        }
    }
};

export const updateEmployerDetails = async (data: EmployerProfileData) => {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== "employer") {
            return {
                status: "ERROR",
                message: "Unauthorized",
            }
        }

        const { yearOfEstablishment, ...restData } = data;

        const supabase = await createSupabaseServerClient();
        const { error } = await supabase
            .from("employers")
            .update({
                name: restData.name,
                description: restData.description,
                avatar_url: restData.avatarUrl,
                banner_image_url: restData.bannerImageUrl,
                organization_type: restData.organizationType,
                team_size: restData.teamSize,
                year_of_establishment: yearOfEstablishment ? parseInt(yearOfEstablishment) : null,
                website_url: restData.websiteUrl,
                location: restData.location,
            })
            .eq("id", user.id);

        if (error) throw error;

        return {
            status: "SUCCESS",
            message: "Employer details updated successfully",
        }
    } catch (error) {
        console.error("Error updating employer details:", error);
        return {
            status: "ERROR",
            message: "Failed to update employer details",
        }
    }
}