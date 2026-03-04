"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion } from "framer-motion";
import { Camera, Save } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  skills: z.string().min(1, "Skills are required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  portfolio: z.string().url("Must be a valid URL").or(z.literal("")),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ApplicantProfile() {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      skills: "React, TypeScript, Node.js, Python",
      bio: "Full-stack developer with 5 years of experience...",
      portfolio: "https://johndoe.dev",
    },
  });

  function onSubmit(values: ProfileValues) {
    console.log(values);
  }

  return (
    <DashboardLayout role="applicant" title="Profile">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 card-shadow">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Profile Completion</span>
              <span className="font-medium text-primary">65%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-primary rounded-full transition-all" style={{ width: "65%" }} />
            </div>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold relative">
              JD
              <button type="button" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-card card-shadow flex items-center justify-center">
                <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">John Doe</h2>
              <p className="text-sm text-muted-foreground">john.doe@email.com</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-muted-foreground">First Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-muted-foreground">Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">Skills</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="rounded-xl min-h-[80px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portfolio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">Portfolio Link</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0 h-11">
                <Save className="h-4 w-4 mr-2" /> Save Profile
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
