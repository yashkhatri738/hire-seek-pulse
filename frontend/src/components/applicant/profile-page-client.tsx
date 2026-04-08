"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileView } from "@/components/applicant/profile-view";
import { ProfileForm } from "@/components/applicant/profile-form";
import { Eye, Pencil } from "lucide-react";

interface ProfilePageClientProps {
  profile: any;
}

export function ProfilePageClient({ profile }: ProfilePageClientProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header with tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your professional profile.
          </p>
        </div>
      </div>

      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full max-w-xs grid-cols-2 h-11 bg-muted/70 p-1">
          <TabsTrigger value="view" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm h-9" id="tab-view">
            <Eye className="h-4 w-4" />
            View
          </TabsTrigger>
          <TabsTrigger value="edit" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm h-9" id="tab-edit">
            <Pencil className="h-4 w-4" />
            Edit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="mt-6">
          <ProfileView data={profile} />
        </TabsContent>

        <TabsContent value="edit" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProfileForm initialData={profile} />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
