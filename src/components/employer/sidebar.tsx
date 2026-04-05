"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, ClipboardCheck, FileUser, LayoutDashboardIcon, UserPen, LogOut, Users } from "lucide-react";
import { LogoutAction } from "@/lib/action/auth.action";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
    {href: "/employer/dashboard", label: "Dashboard", icon: <LayoutDashboardIcon className="w-5 h-5" />},
    {href: "/employer/postjob", label: "Jobs", icon: <Briefcase className="w-5 h-5" />},
    {href: "/employer/candidates", label: "Candidates", icon: <Users className="w-5 h-5" />},
    {href: "/employer/application", label: "Applications", icon: <FileUser className="w-5 h-5" />},
    {href: "/employer/profile", label: "Profile", icon: <UserPen className="w-5 h-5" />},
    {href: "/employer/schedule-interview", label: "Schedule Interview", icon: <ClipboardCheck className="w-5 h-5" />},
];

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-card flex flex-col z-40 card-shadow">
            <div className="h-16 flex items-center px-6 border-b">
                <span className="text-xl font-bold gradient-text">Grow Career</span>
            </div>
            
            <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto w-full">
                <div className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider px-2">Menu</div>
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link 
                            key={link.href} 
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${isActive ? 'bg-primary/10 text-primary hero-shadow' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t mt-auto">
                    <Button type="submit" variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 px-3 transition-colors" onClick={() => LogoutAction()}>
                        <LogOut className="w-5 h-5 mr-3" />
                        Log out
                    </Button>
            </div>
        </aside>
    );
}

export default Sidebar;