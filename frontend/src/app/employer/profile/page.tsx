import EmployerSettingsForm from "@/components/employer/settingForm";
import { getEmployerDetails } from "@/lib/action/employer/employer.action";
import { EmployerProfileData } from "@/lib/schemaValidation/employer.schema";
import { Building2 } from "lucide-react";

const SettingsPage = async () => {
  const response = await getEmployerDetails();

  if (response.status !== "SUCCESS" || !response.data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Failed to load employer data.</p>
        </div>
      </div>
    );
  }

  const employer = response.data;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Company Details
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground mt-2 ml-[52px]">
          Update your company&apos;s public profile and information.
        </p>
      </div>

      <EmployerSettingsForm
        initialData={
          {
            name: employer.name || "",
            description: employer.description || "",
            organizationType: employer.organizationType || "development",
            teamSize: employer.teamSize || "1",
            location: employer.location || "",
            websiteUrl: employer.websiteUrl || "",
            yearOfEstablishment: employer.yearOfEstablishment?.toString() || "",
            avatarUrl: employer.avatarUrl || "",
            bannerImageUrl: employer.bannerImageUrl || "",
          } as EmployerProfileData
        }
      />
    </div>
  );
};

export default SettingsPage;
