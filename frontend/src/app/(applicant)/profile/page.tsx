import React from "react";
import { getApplicantProfile } from "@/lib/action/applicant/profile.action";
import { User } from "lucide-react";
import { ProfilePageClient } from "@/components/applicant/profile-page-client";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getApplicantProfile();

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto animate-fade-up">
        <div className="glass-card card-shadow flex flex-col items-center justify-center rounded-2xl py-20 text-center">
          <div className="h-14 w-14 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center mb-3">
            <User className="h-6 w-6 text-violet-300" />
          </div>
          <h3 className="mt-2 text-lg font-semibold text-white">
            Profile Not Found
          </h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            We couldn&apos;t retrieve your profile data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <ProfilePageClient profile={profile} />
    </div>
  );
}
