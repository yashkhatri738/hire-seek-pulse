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
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Your <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your professional profile.
          </p>
        </div>
      </div>

      <Tabs defaultValue="view" className="w-full">
        <TabsList className="glass grid w-full max-w-xs grid-cols-2 h-11 p-1">
          <TabsTrigger
            value="view"
            className="h-9 gap-2 text-muted-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-violet-500/30"
            id="tab-view"
          >
            <Eye className="h-4 w-4" />
            View
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="h-9 gap-2 text-muted-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-violet-500/30"
            id="tab-edit"
          >
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
