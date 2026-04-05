"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
    applicantSchema, 
    ApplicantFormData, 
} from "@/lib/schemaValidation/applicant.schema";
import { updateApplicantProfile } from "@/lib/action/applicant/profile.action";
import { useTransition } from "react";
import { toast } from "sonner";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Plus, Trash2, Briefcase, GraduationCap, FolderKanban } from "lucide-react";
import { MARITAL_STATUS, GENDER } from "@/config/constants";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface ProfileFormProps {
    initialData: any;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<ApplicantFormData>({
        resolver: zodResolver(applicantSchema),
        defaultValues: {
            name: initialData.user?.name || "",
            email: initialData.user?.email || "",
            phoneNumber: initialData.user?.phoneNumber || "",
            biography: initialData.biography || "",
            dateOfBirth: initialData.dateOfBirth ? format(new Date(initialData.dateOfBirth), "yyyy-MM-dd") : "",
            nationality: initialData.nationality || "",
            resumeUrl: initialData.resumeUrl || "",
            avatarUrl: initialData.user?.avatarUrl || "",
            maritalStatus: initialData.maritalStatus || undefined,
            gender: initialData.gender || undefined,
            education: initialData.education || [],
            experience: initialData.experience || [],
            projects: initialData.projects || [],
            websiteUrl: initialData.websiteUrl || "",
            location: initialData.location || "",
            skills: initialData.skills || "",
        },
    });

    const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
        control: form.control,
        name: "experience",
    });

    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
        control: form.control,
        name: "education",
    });

    const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({
        control: form.control,
        name: "projects",
    });

    const onSubmit = (values: ApplicantFormData) => {
        startTransition(async () => {
            const result = await updateApplicantProfile(values);
            if (result.status === "SUCCESS") {
                toast.success(result.message as string);
            } else {
                toast.error(result.message as string);
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Info */}
                        <Card className="card-shadow border-0">
                            <CardContent className="pt-6 space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl><Input {...field} placeholder="John Doe" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl><Input {...field} type="email" placeholder="john@example.com" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ""} placeholder="+1 234 567 890" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dateOfBirth"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date of Birth</FormLabel>
                                                <FormControl><Input {...field} value={field.value || ""} type="date" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="biography"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Bio</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} value={field.value || ""} placeholder="Tell us about your professional journey..." className="min-h-[100px] resize-none" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="skills"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Skills (Comma separated)</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ""} placeholder="React, Next.js, Node.js, TypeScript" />
                                            </FormControl>
                                            <FormDescription>These will be displayed as badges on your profile.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Work Experience */}
                        <Card className="card-shadow border-0">
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center justify-between border-b pb-2 mb-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                        Work Experience
                                    </h3>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        className="gap-2"
                                        onClick={() => appendExp({ role: "", company: "", period: "", description: "", current: false })}
                                    >
                                        <Plus className="h-4 w-4" /> Add
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {expFields.map((field, index) => (
                                        <div key={field.id} className="p-4 rounded-xl border bg-muted/30 relative space-y-4">
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="sm" 
                                                className="absolute top-2 right-2 h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => removeExp(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`experience.${index}.role`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Job Role</FormLabel>
                                                            <FormControl><Input {...field} placeholder="Senior Developer" /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`experience.${index}.company`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Company Name</FormLabel>
                                                            <FormControl><Input {...field} placeholder="Google" /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`experience.${index}.period`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Period</FormLabel>
                                                            <FormControl><Input {...field} placeholder="Jan 2022 - Present" /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name={`experience.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl><Textarea {...field} value={field.value || ""} placeholder="Key responsibilities and achievements..." className="min-h-[80px] resize-none" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ))}
                                    {expFields.length === 0 && (
                                        <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-xl">
                                            No experience added yet. Click &quot;Add&quot; to begin.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Education */}
                        <Card className="card-shadow border-0">
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center justify-between border-b pb-2 mb-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-primary" />
                                        Education
                                    </h3>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        className="gap-2"
                                        onClick={() => appendEdu({ school: "", degree: "", year: "", grade: "" })}
                                    >
                                        <Plus className="h-4 w-4" /> Add
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {eduFields.map((field, index) => (
                                        <div key={field.id} className="p-4 rounded-xl border bg-muted/30 relative space-y-4">
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="sm" 
                                                className="absolute top-2 right-2 h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => removeEdu(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`education.${index}.school`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>School / University</FormLabel>
                                                            <FormControl><Input {...field} placeholder="IIT Delhi" /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`education.${index}.degree`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Degree / Course</FormLabel>
                                                            <FormControl><Input {...field} placeholder="B.Tech Computer Science" /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`education.${index}.year`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Year</FormLabel>
                                                            <FormControl><Input {...field} placeholder="2018 - 2022" /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`education.${index}.grade`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Grade / CGPA</FormLabel>
                                                            <FormControl><Input {...field} value={field.value || ""} placeholder="8.5 CGPA" /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {eduFields.length === 0 && (
                                        <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-xl">
                                            No education added yet.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Projects */}
                        <Card className="card-shadow border-0">
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center justify-between border-b pb-2 mb-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <FolderKanban className="h-5 w-5 text-primary" />
                                        Projects
                                    </h3>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        className="gap-2"
                                        onClick={() => appendProj({ name: "", tech: "", description: "", link: "" })}
                                    >
                                        <Plus className="h-4 w-4" /> Add
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {projFields.map((field, index) => (
                                        <div key={field.id} className="p-4 rounded-xl border bg-muted/30 relative space-y-4">
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="sm" 
                                                className="absolute top-2 right-2 h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => removeProj(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`projects.${index}.name`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Project Name</FormLabel>
                                                            <FormControl><Input {...field} placeholder="HireSeek Pulse" /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`projects.${index}.tech`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Tech Stack</FormLabel>
                                                            <FormControl><Input {...field} placeholder="Next.js, Tailwind, Drizzle" /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`projects.${index}.link`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Project Link</FormLabel>
                                                            <FormControl><Input {...field} value={field.value || ""} placeholder="https://github.com/..." /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name={`projects.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl><Textarea {...field} placeholder="Briefly describe what you built..." className="min-h-[80px] resize-none" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ))}
                                    {projFields.length === 0 && (
                                        <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-xl">
                                            No projects added yet.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Sidebar info */}
                    <div className="space-y-6">
                        <Card className="card-shadow border-0">
                            <CardContent className="pt-6 space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Profile Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gender</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {GENDER.map(g => <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maritalStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Marital Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {MARITAL_STATUS.map(ms => <SelectItem key={ms} value={ms} className="capitalize">{ms}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Location</FormLabel>
                                            <FormControl><Input {...field} value={field.value || ""} placeholder="City, State, Country" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nationality"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nationality</FormLabel>
                                            <FormControl><Input {...field} value={field.value || ""} placeholder="e.g. Indian" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card className="card-shadow border-0">
                            <CardContent className="pt-6 space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Web & Links</h3>
                                <FormField
                                    control={form.control}
                                    name="websiteUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Portfolio URL</FormLabel>
                                            <FormControl><Input {...field} value={field.value || ""} placeholder="https://portfolio.com" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="resumeUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Resume Link (Cloud Storage)</FormLabel>
                                            <FormControl><Input {...field} value={field.value || ""} placeholder="https://drive.google.com/..." /></FormControl>
                                            <FormDescription>Link to your PDF resume.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <div className="sticky top-6">
                            <Button type="submit" className="w-full h-12 text-lg shadow-lg gradient-primary text-white" disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                Save Profile changes
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground mt-3">
                                Changes are reflected immediately on your public profile.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
