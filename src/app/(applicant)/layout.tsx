// import { getCurrentUser } from "@/lib/action/auth.quires";
// import { redirect } from "next/navigation";
import React from "react";
import Navbar from "@/components/employer/navbar";

const Layout = async({children}: {children: React.ReactNode}) => {
    // const user = await getCurrentUser();
    // if (user && user.role !== "applicant") {
    //     redirect("/login");
    // }

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 lg:p-8">
                {children}
            </main>
        </div>
    )
}

export default Layout;