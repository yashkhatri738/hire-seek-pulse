import React from "react";
import { getApplicantProfile } from "@/lib/action/applicant/profile.action";
import { User } from "lucide-react";
import { ProfilePageClient } from "@/components/applicant/profile-page-client";

export default async function ProfilePage() {
  const profile = await getApplicantProfile();

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-card border-0 rounded-xl card-shadow">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-2 text-lg font-semibold">Profile Not Found</h3>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t retrieve your profile data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <ProfilePageClient profile={profile} />
    </div>
  );
}
