import EmployerSettingsForm from "@/components/employer/settingForm";
import { getEmployerDetails } from "@/lib/action/employer/employer.action";
import { EmployerProfileData } from "@/lib/schemaValidation/employer.schema";

const SettingsPage = async () => {
  const response = await getEmployerDetails();
  
  if (response.status !== "SUCCESS" || !response.data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Failed to load employer data.</p>
      </div>
    );
  }

  const employer = response.data;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Company Details</h1>
        <p className="text-muted-foreground mt-2">Update your company's public profile and information.</p>
      </div>

      <EmployerSettingsForm
        initialData={
          {
            name: employer.name || "",
            description: employer.description || "",
            organizationType: employer.organizationType || "development" ,
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
