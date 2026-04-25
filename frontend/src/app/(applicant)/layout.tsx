// import { getCurrentUser } from "@/lib/action/auth.quires";
// import { redirect } from "next/navigation";
import React from "react";
import Navbar from "@/components/employer/navbar";
import ApplicantSidebar from "@/components/applicant/sidebar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  // const user = await getCurrentUser();
  // if (user && user.role !== "applicant") {
  //     redirect("/login");
  // }

  return (
    <div className="min-h-screen bg-background">
      <ApplicantSidebar />
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
