import React from "react";
import { getApplicantProfile } from "@/lib/action/applicant/profile.action";
import { UserCircle } from "lucide-react";
import { ProfilePageClient } from "@/components/applicant/profile-page-client";

export default async function ProfilePage() {
    const profile = await getApplicantProfile();

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-card border rounded-lg">
                <UserCircle className="h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">Profile Not Found</h3>
                <p className="text-muted-foreground">We couldn&apos;t retrieve your profile data. Please try again later.</p>
            </div>
        );
    }

    return <ProfilePageClient profile={profile} />;
}
