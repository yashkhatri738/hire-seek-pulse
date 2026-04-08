"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveImage } from "@/lib/upload";
import { submitApplication } from "@/lib/action/applicant/application.action";
import { toast } from "sonner";
import { Loader2, Briefcase } from "lucide-react";

interface ApplyModalProps {
  jobId: number;
  applicantData: any;
}

export function ApplyModal({ jobId, applicantData }: ApplyModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string>(applicantData?.resumeUrl || "");
  const [formData, setFormData] = useState({
    name: applicantData?.user?.name || applicantData?.name || "",
    email: applicantData?.user?.email || applicantData?.email || "",
    phoneNumber: applicantData?.user?.phoneNumber || applicantData?.phoneNumber || "",
    linkedInUrl: applicantData?.linkedInUrl || "",
    githubUrl: applicantData?.githubUrl || "",
    portfolioUrl: applicantData?.websiteUrl || "",
    yearsOfExperience: applicantData?.experience ? "Sample extracted experience" : "", // In real life might be simpler string
    coverLetter: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      setIsLoading(true);
      const url = await saveImage(formData);
      setResumeUrl(url);
      toast.success("Resume uploaded successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload resume");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeUrl) {
      toast.error("Please upload your resume.");
      return;
    }

    setIsLoading(true);
    const result = await submitApplication({
      jobId,
      ...formData,
      resumeUrl,
    });

    if (result.status === "SUCCESS") {
      toast.success("Application submitted successfully!");
      setOpen(false);
    } else {
      toast.error(result.message || "Failed to submit application");
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gradient-primary text-white shadow-lg px-8 h-10 w-full sm:w-auto">
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
             </div>
             <div>
                <DialogTitle className="text-xl">Submit Application</DialogTitle>
                <DialogDescription>
                  Make sure your contact information and links are up to date.
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input required id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input required type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input id="yearsOfExperience" name="yearsOfExperience" placeholder="e.g. 3 years" value={formData.yearsOfExperience} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
              <Input id="linkedInUrl" name="linkedInUrl" placeholder="https://linkedin.com/..." value={formData.linkedInUrl} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input id="githubUrl" name="githubUrl" placeholder="https://github.com/..." value={formData.githubUrl} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
              <Label htmlFor="portfolioUrl">Portfolio / Website</Label>
              <Input id="portfolioUrl" name="portfolioUrl" placeholder="https://..." value={formData.portfolioUrl} onChange={handleChange} />
          </div>

          <div className="space-y-2">
              <Label>Resume / CV *</Label>
              {resumeUrl ? (
                <div className="p-4 border rounded-lg bg-muted flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">Resume uploaded successfully</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setResumeUrl("")}>Replace</Button>
                </div>
              ) : (
                <Input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileUpload} 
                  disabled={isLoading}
                />
              )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              rows={4}
              placeholder="Why are you a great fit for this role?"
              value={formData.coverLetter}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gradient-primary text-white">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
