"use client";

import { useState, useEffect, Suspense } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Briefcase,
  FileText,
  Send,
  DollarSign,
  MapPin,
  Clock,
  Award,
  Tag,
  GraduationCap,
  Calendar,
  Loader,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { jobSchema, JobFormData } from "@/lib/schemaValidation/job.schema";
import {
  JOB_TYPE,
  WORK_TYPE,
  JOB_LEVEL,
  MIN_EDUCATION,
  SALARY_CURRENCY,
  SALARY_PERIOD,
} from "@/config/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createJob, updateJob } from "@/lib/action/employer/job.action";
import Tiptap from "@/components/text-editor";

const steps = [
  { icon: Briefcase, label: "Job Details" },
  { icon: FileText, label: "Description & Req" },
  { icon: DollarSign, label: "Salary & Expiry" },
  { icon: Send, label: "Publish" },
];

interface JobPostFormProps {
  initialData?: any; 
  isEditMode?: boolean; 
}

const JobForm = ({
  initialData,
  isEditMode = false,
}: JobPostFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: {errors, isDirty, isSubmitting},
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues : initialData,
  })

  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleFormSubmit = async (data: JobFormData) => {
    try {
      let res;
      if(isEditMode && initialData?.id){
        res = await updateJob(initialData.id, data);
      }else{
        res = await createJob(data);
      }

      if(res.status === "SUCCESS"){
        toast({
          title: isEditMode ? "Job Updated!" : "Job Posted!",
          description: `"${data.title}" has been successfully ${isEditMode ? "updated" : "posted"}.`,
        })
        if(!isEditMode){
          reset();
          setStep(0);
        }
        router.push("/employer/dashboard");
        router.refresh();
      }
    } catch (error) {
        toast({
          title: "Error",
          description: `Failed to ${isEditMode ? "update" : "post"} job.`,
          variant: "destructive",
        })
    }
  } 

  return (
    <div className="max-w-xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1 sm:gap-2">
            <div
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${i <= step ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`w-4 sm:w-8 h-0.5 rounded ${i < step ? "gradient-primary" : "bg-muted"}`}
              />
            )}
          </div>
        ))}
      </div>

      <Card className="w-full max-w-4xl mx-auto border border-white/60 bg-white/80 backdrop-blur-sm rounded-2xl">
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="title"
                type="text"
                placeholder="e.g., Senior Frontend Developer"
                className={cn("pl-10", errors.title && "border-destructive")}
                {...register("title")}
                aria-invalid={!!errors.title}
              />
            </div>
            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message as string}
              </p>
            )}
          </div>

          {/* Job Type, Work Type, Job Level */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Controller
                name="jobType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="jobType"
                        className={cn(
                          "pl-10 w-full",
                          errors.jobType && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPE.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.jobType && (
                <p className="text-sm text-destructive">
                  {errors.jobType.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workType">Work Type *</Label>
              <Controller
                name="workType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="workType"
                        className={cn(
                          "pl-10 w-full",
                          errors.workType && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                      <SelectContent>
                        {WORK_TYPE.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.workType && (
                <p className="text-sm text-destructive">
                  {errors.workType.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobLevel">Job Level *</Label>
              <Controller
                name="jobLevel"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="jobLevel"
                        className={cn(
                          "pl-10 w-full",
                          errors.jobLevel && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select job level" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_LEVEL.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.jobLevel && (
                <p className="text-sm text-destructive">
                  {errors.jobLevel.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Location and Tags */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., New York, NY or Remote"
                  className={cn(
                    "pl-10",
                    errors.location && "border-destructive",
                  )}
                  {...register("location")}
                  aria-invalid={!!errors.location}
                />
              </div>
              {errors.location && (
                <p className="text-sm text-destructive">
                  {errors.location.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="tags"
                  type="text"
                  placeholder="e.g., React, TypeScript, Node.js"
                  className={cn("pl-10", errors.tags && "border-destructive")}
                  {...register("tags")}
                  aria-invalid={!!errors.tags}
                />
              </div>
              {errors.tags && (
                <p className="text-sm text-destructive">
                  {errors.tags.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Salary Information */}
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="minSalary">Min Salary (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="minSalary"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g., 50000"
                  className={cn(
                    "pl-10",
                    errors.minSalary && "border-destructive",
                  )}
                  {...register("minSalary")}
                  aria-invalid={!!errors.minSalary}
                />
              </div>
              {errors.minSalary && (
                <p className="text-sm text-destructive">
                  {errors.minSalary.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSalary">Max Salary (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="maxSalary"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g., 80000"
                  className={cn(
                    "pl-10",
                    errors.maxSalary && "border-destructive",
                  )}
                  {...register("maxSalary")}
                  aria-invalid={!!errors.maxSalary}
                />
              </div>
              {errors.maxSalary && (
                <p className="text-sm text-destructive">
                  {errors.maxSalary.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryCurrency">Currency</Label>
              <Controller
                name="salaryCurrency"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="salaryCurrency"
                      className={cn(
                        "w-full",
                        errors.salaryCurrency && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALARY_CURRENCY.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.salaryCurrency && (
                <p className="text-sm text-destructive">
                  {errors.salaryCurrency.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryPeriod">Period</Label>
              <Controller
                name="salaryPeriod"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="salaryPeriod"
                      className={cn(
                        "w-full",
                        errors.salaryPeriod && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALARY_PERIOD.map((period) => (
                        <SelectItem key={period} value={period}>
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.salaryPeriod && (
                <p className="text-sm text-destructive">
                  {errors.salaryPeriod.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Education and Experience */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minEducation">Minimum Education (Optional)</Label>
              <Controller
                name="minEducation"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="minEducation"
                        className={cn(
                          "pl-10 w-full",
                          errors.minEducation && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {MIN_EDUCATION.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.minEducation && (
                <p className="text-sm text-destructive">
                  {errors.minEducation.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiry Date (Optional)</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="expiresAt"
                  type="date"
                  className={cn(
                    "pl-10",
                    errors.expiresAt && "border-destructive",
                  )}
                  {...register("expiresAt")}
                  aria-invalid={!!errors.expiresAt}
                />
              </div>
              {errors.expiresAt && (
                <p className="text-sm text-destructive">
                  {errors.expiresAt.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience">
              Experience Requirements (Optional)
            </Label>
            <div className="relative">
              <Award className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="experience"
                type="text"
                placeholder="e.g., 3+ years of React development"
                className={cn(
                  "pl-10",
                  errors.experience && "border-destructive",
                )}
                {...register("experience")}
                aria-invalid={!!errors.experience}
              />
            </div>
            {errors.experience && (
              <p className="text-sm text-destructive">
                {errors.experience.message as string}
              </p>
            )}
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label>Job Description *</Label>
                <Tiptap
                  content={field.value}
                  onChange={(value) => field.onChange(value)}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex items-center gap-4 pt-4 flex-wrap">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
              {isEditMode
                ? isSubmitting
                  ? "Saving..."
                  : "Update Job"
                : isSubmitting
                  ? "Saving..."
                  : "Post Job"}
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
    </div>
  );
}

export default JobForm;