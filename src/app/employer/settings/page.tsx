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

const settingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().url("Must be a valid URL"),
  industry: z.string().min(1, "Industry is required"),
  companySize: z.string().min(1, "Company size is required"),
  about: z.string().min(10, "About must be at least 10 characters"),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function EmployerSettings() {
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: "TechCorp Inc.",
      website: "https://techcorp.com",
      industry: "Technology",
      companySize: "100-500",
      about: "We are a leading technology company...",
    },
  });

  function onSubmit(values: SettingsValues) {
    console.log(values);
  }

  return (
    <DashboardLayout role="employer" title="Settings">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 card-shadow">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold relative">
              TC
              <button type="button" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-card card-shadow flex items-center justify-center">
                <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">TechCorp Inc.</h2>
              <p className="text-sm text-muted-foreground">Employer Account</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="companyName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-muted-foreground">Company Name</FormLabel>
                  <FormControl><Input {...field} className="rounded-xl" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="website" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-muted-foreground">Website</FormLabel>
                  <FormControl><Input {...field} className="rounded-xl" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="industry" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">Industry</FormLabel>
                    <FormControl><Input {...field} className="rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="companySize" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">Company Size</FormLabel>
                    <FormControl><Input {...field} className="rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="about" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-muted-foreground">About</FormLabel>
                  <FormControl><Textarea {...field} className="rounded-xl min-h-[80px]" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0 h-11">
                <Save className="h-4 w-4 mr-2" /> Save Settings
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
