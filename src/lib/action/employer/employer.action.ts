"use server"

import { employers } from "@/drizzle/schema";
import { getCurrentUser } from "../auth.quires"
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { EmployerProfileData } from "@/lib/schemaValidation/employer.schema";

export const getEmployerDetails = async () => {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== "employer") {
            return {
                status: "ERROR",
                message: "Unauthorized",
            }
        }

        const [employer] = await db
            .select()
            .from(employers)
            .where(eq(employers.id, user.id))

        return {
            status: "SUCCESS",
            data: employer
        }
    } catch (error) {
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

        await db
            .update(employers)
            .set({
                ...restData,
                yearOfEstablishment: yearOfEstablishment ? parseInt(yearOfEstablishment) : null,
            })
            .where(eq(employers.id, user.id));

        return {
            status: "SUCCESS",
            message: "Employer details updated successfully",
        }
    } catch (error) {
        return {
            status: "ERROR",
            message: "Failed to update employer details",
        }
    }
}