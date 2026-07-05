import { getCurrentUser } from "@/lib/action/auth.quires";
import { redirect } from "next/navigation";
import React from "react";
import Sidebar from "@/components/employer/sidebar";
import Navbar from "@/components/employer/navbar";
import { AppBackground } from "@/components/app-background";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "employer") {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-background">
      <AppBackground />
      <Sidebar />
      <div className="relative z-10 flex min-h-screen flex-col lg:pl-[260px]">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
