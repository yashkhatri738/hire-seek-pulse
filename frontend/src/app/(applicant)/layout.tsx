import { getCurrentUser } from "@/lib/action/auth.quires";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Navbar from "@/components/employer/navbar";
import ApplicantSidebar from "@/components/applicant/sidebar";
import { AppBackground } from "@/components/app-background";

function SidebarFallback() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] animate-pulse flex-col border-r border-white/[0.06] bg-sidebar/80 backdrop-blur-xl lg:flex">
      <div className="flex h-[70px] items-center gap-3 px-6">
        <div className="h-9 w-9 rounded-xl bg-muted" />
        <div className="space-y-1.5">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-2.5 w-14 rounded bg-muted" />
        </div>
      </div>
      <div className="flex-1 space-y-2 px-3 py-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-muted/60" />
        ))}
      </div>
    </aside>
  );
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "applicant") {
    redirect("/employer/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-background">
      <AppBackground />
      <Suspense fallback={<SidebarFallback />}>
        <ApplicantSidebar />
      </Suspense>
      <div className="relative z-10 flex min-h-screen flex-col lg:pl-[260px]">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
