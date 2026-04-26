// import { getCurrentUser } from "@/lib/action/auth.quires";
// import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Navbar from "@/components/employer/navbar";
import ApplicantSidebar from "@/components/applicant/sidebar";

function SidebarFallback() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-card/95 backdrop-blur-xl flex flex-col z-40 border-r border-border/60 animate-pulse">
      <div className="h-[70px] flex items-center px-6 gap-3">
        <div className="h-9 w-9 rounded-xl bg-muted" />
        <div className="space-y-1.5">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-2.5 w-14 rounded bg-muted" />
        </div>
      </div>
      <div className="flex-1 py-5 px-3 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-muted/60" />
        ))}
      </div>
    </aside>
  );
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  // const user = await getCurrentUser();
  // if (user && user.role !== "applicant") {
  //     redirect("/login");
  // }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<SidebarFallback />}>
        <ApplicantSidebar />
      </Suspense>
      <div className="pl-[260px] flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 bg-dot-pattern gradient-mesh">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
