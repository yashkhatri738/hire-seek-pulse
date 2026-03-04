"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Briefcase, FileText, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const step0Schema = z.object({
  title: z.string().min(1, "Job title is required"),
  type: z.string().min(1, "Job type is required"),
  location: z.string().min(1, "Location is required"),
  salaryMin: z.string().min(1, "Min salary is required"),
  salaryMax: z.string().min(1, "Max salary is required"),
});

const step1Schema = z.object({
  description: z.string().min(20, "Description must be at least 20 characters"),
  skills: z.string().min(1, "Skills are required"),
  experience: z.string().min(1, "Experience is required"),
});

const fullSchema = step0Schema.merge(step1Schema);
type FormValues = z.infer<typeof fullSchema>;

const steps = [
  { icon: Briefcase, label: "Job Details" },
  { icon: FileText, label: "Description" },
  { icon: Send, label: "Publish" },
];

export default function PostJob() {
  const [step, setStep] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      title: "", type: "", location: "", salaryMin: "", salaryMax: "",
      description: "", skills: "", experience: "",
    },
    mode: "onChange",
  });

  const values = form.watch();

  const handleNext = async () => {
    let valid = false;
    if (step === 0) {
      valid = await form.trigger(["title", "type", "location", "salaryMin", "salaryMax"]);
    } else if (step === 1) {
      valid = await form.trigger(["description", "skills", "experience"]);
    }
    if (valid) setStep((s) => s + 1);
  };

  const handlePublish = (data: FormValues) => {
    toast({ title: "Job Published! 🎉", description: `"${data.title}" is now live.` });
    setStep(0);
    form.reset();
  };

  return (
    <DashboardLayout role="employer" title="Post a Job">
      <div className="max-w-xl mx-auto">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i <= step ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline">{s.label}</span>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 rounded ${i < step ? "gradient-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePublish)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-2xl p-6 card-shadow"
              >
                {step === 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground text-lg">Job Details</h3>
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground">Job Title</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g. Senior Frontend Developer" className="rounded-xl" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground">Job Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="location" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground">Location</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g. San Francisco, CA" className="rounded-xl" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField control={form.control} name="salaryMin" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-muted-foreground">Min Salary</FormLabel>
                          <FormControl><Input {...field} placeholder="$80,000" className="rounded-xl" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="salaryMax" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-muted-foreground">Max Salary</FormLabel>
                          <FormControl><Input {...field} placeholder="$120,000" className="rounded-xl" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground text-lg">Description</h3>
                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground">Job Description</FormLabel>
                        <FormControl><Textarea {...field} placeholder="Describe the role and responsibilities..." className="rounded-xl min-h-[120px]" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="skills" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground">Skills Required</FormLabel>
                        <FormControl><Input {...field} placeholder="React, TypeScript, Node.js" className="rounded-xl" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="experience" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground">Experience Required</FormLabel>
                        <FormControl><Input {...field} placeholder="3-5 years" className="rounded-xl" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground text-lg">Preview & Publish</h3>
                    <div className="bg-muted rounded-xl p-4 space-y-2">
                      <p className="font-semibold text-foreground">{values.title || "Job Title"}</p>
                      <p className="text-sm text-muted-foreground">{values.type || "Type"} · {values.location || "Location"}</p>
                      <p className="text-sm text-muted-foreground">{values.salaryMin && values.salaryMax ? `${values.salaryMin} – ${values.salaryMax}` : "Salary"}</p>
                      <p className="text-sm text-muted-foreground mt-2">{values.description || "No description provided."}</p>
                      {values.skills && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {values.skills.split(",").map((s) => (
                            <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  {step > 0 ? (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="rounded-xl">
                      <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                  ) : <div />}
                  {step < 2 ? (
                    <Button type="button" onClick={handleNext} className="gradient-primary text-primary-foreground border-0 rounded-xl">
                      Next <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button type="submit" className="gradient-primary text-primary-foreground border-0 rounded-xl hero-shadow">
                      <Send className="h-4 w-4 mr-1" /> Publish Job
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}
