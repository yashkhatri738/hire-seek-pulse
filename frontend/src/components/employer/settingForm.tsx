"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  Calendar,
  Camera,
  Globe,
  Loader,
  MapPin,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import {
  EmployerProfileData,
  employerProfileSchema,
  organizationTypes,
  teamSizes,
} from "@/lib/schemaValidation/employer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadButton } from "@/lib/uploadthing";
import Tiptap from "@/components/text-editor";
import { updateEmployerDetails } from "@/lib/action/employer/employer.action";

const EmployerSettingsForm = ({
  initialData,
}: {
  initialData?: Partial<EmployerProfileData>; // Key: Type
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch, //Give me the current value of this field in the form state, and re-render this component when it changes.
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EmployerProfileData>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      organizationType: initialData?.organizationType ?? organizationTypes[0],
      teamSize: initialData?.teamSize ?? teamSizes[0],
      yearOfEstablishment: initialData?.yearOfEstablishment ?? "",
      websiteUrl: initialData?.websiteUrl || "",
      location: initialData?.location || "",
      avatarUrl: initialData?.avatarUrl || "",
      bannerImageUrl: initialData?.bannerImageUrl || "",
    },
    resolver: zodResolver(employerProfileSchema),
  });

  const onError = (formErrors: Record<string, any>) => {
    console.log("Validation errors:", formErrors);
    const firstKey = Object.keys(formErrors)[0];
    if (firstKey && formErrors[firstKey]?.message) {
      toast.error(`Validation Error: ${formErrors[firstKey].message}`);
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  const handleFormSubmit = async (data: EmployerProfileData) => {
    try {
      const response = await updateEmployerDetails(data);
      if (response?.status === "SUCCESS") {
        toast.success(response.message || "Saved");
      } else {
        toast.error(response?.message || "Failed to save");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <Card className="w-full border-white/[0.06] bg-white/[0.03] backdrop-blur-sm pb-8">
      <CardContent className="p-6 md:p-8">
        <form
          onSubmit={handleSubmit(handleFormSubmit, onError)}
          className="space-y-8"
        >
          {/* MEDIA SECTION */}
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-pink-500/20 bg-pink-500/10 text-pink-300">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Company Media</h3>
                <p className="text-sm text-muted-foreground">Your logo and banner shown on your profile.</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* AVATAR */}
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28">
                  {/* Avatar Image */}
                  <div className="w-full h-full rounded-full overflow-hidden border border-white/[0.08] bg-white/[0.03]">
                    {watch("avatarUrl") ? (
                      <img
                        src={watch("avatarUrl")}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                        Logo
                      </div>
                    )}
                  </div>

                  {/* Avatar Upload */}
                  <div className="absolute bottom-1 right-1 z-10">
                    <UploadButton
                      endpoint="imageUploader"
                      appearance={{
                        button:
                          "w-9 h-9 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:scale-105 transition flex items-center justify-center",
                        allowedContent: "hidden",
                      }}
                      content={{
                        button: <Camera size={16} />,
                      }}
                      onClientUploadComplete={(res) => {
                        const url = res?.[0]?.ufsUrl || res?.[0]?.url || "";
                        if (url) {
                          setValue("avatarUrl", url, { shouldDirty: true });
                          toast.success("Avatar uploaded");
                        }
                      }}
                      onUploadError={(error) => {
                        toast.error("Upload failed: " + error.message);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground">Company Logo</p>
                  <p className="text-xs text-muted-foreground">
                    Click camera to upload logo
                  </p>
                </div>
              </div>

              {/* BANNER */}
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.03]">
                {watch("bannerImageUrl") ? (
                  <img
                    src={watch("bannerImageUrl")}
                    alt="banner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                    Banner Image
                  </div>
                )}

                {/* Subtle overlay for legibility over the image */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />

                {/* Banner Upload */}
                <div className="absolute bottom-3 right-3">
                  <UploadButton
                    endpoint="imageUploader"
                    appearance={{
                      button:
                        "w-10 h-10 rounded-full bg-background/60 text-white border border-white/10 backdrop-blur hover:bg-background/80 transition flex items-center justify-center",
                      allowedContent: "hidden",
                    }}
                    content={{
                      button: <Camera size={18} />,
                    }}
                    onClientUploadComplete={(res) => {
                      const url = res?.[0]?.ufsUrl || res?.[0]?.url || "";
                      if (url) {
                        setValue("bannerImageUrl", url, { shouldDirty: true });
                        toast.success("Banner uploaded");
                      }
                    }}
                    onUploadError={(error) => {
                      toast.error("Upload failed: " + error.message);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* COMPANY INFORMATION SECTION */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-300">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Company Information</h3>
                <p className="text-sm text-muted-foreground">Tell candidates about your organization.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-foreground">Company Name *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Enter company name"
                  className={`pl-10 ${errors.name ? "border-destructive" : ""} `}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

          <div className="space-y-2">
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Tiptap
                    content={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue("description", val, { shouldDirty: true });
                    }}
                  />

                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Organization Type */}
            <div className="space-y-2">
              <Label htmlFor="organizationType">Organization Type *</Label>

              <Controller
                name="organizationType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="pl-10 w-full ">
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {/* {capitalizeWords(type)} */}
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.organizationType && (
                <p className="text-sm text-destructive">
                  {errors.organizationType.message}
                </p>
              )}
            </div>

            {/* Organization Type */}
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size *</Label>
              <Controller
                name="teamSize"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="pl-10 w-full ">
                        <SelectValue placeholder="Select Team Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamSizes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {/* {capitalizeWords(type)} */}
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.teamSize && (
                <p className="text-sm text-destructive">
                  {errors.teamSize.message}
                </p>
              )}
            </div>
          </div>

          {/* Year of Establishment and Location - Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="yearOfEstablishment">
                Year of Establishment *
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="yearOfEstablishment"
                  type="text"
                  placeholder="e.g., 2020"
                  maxLength={4}
                  className="pl-10"
                  {...register("yearOfEstablishment")}
                />
              </div>
              {errors.yearOfEstablishment && (
                <p className="text-sm text-destructive">
                  {errors.yearOfEstablishment.message}
                </p>
              )}
            </div>

            {/* Year of Establishment and Location - Two columns */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Pune, Bangalore"
                  className="pl-10"
                  {...register("location")}
                />
              </div>
            </div>
            {errors.location && (
              <p className="text-sm text-destructive">
                {errors.location.message}
              </p>
            )}
          </div>
          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="websiteUrl"
                type="text"
                placeholder="https://www.yourcompany.com"
                className="pl-10"
                {...register("websiteUrl")}
              />
            </div>
            {errors.websiteUrl && (
              <p className="text-sm text-destructive">
                {errors.websiteUrl.message}
              </p>
            )}
          </div>
          </div>

          <div className="flex items-center gap-4 border-t border-white/[0.06] pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500"
            >
              {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>

            {!isDirty && (
              <p className="text-sm text-muted-foreground">
                No changes to save
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployerSettingsForm;
