import React from "react";
import { Briefcase, LayoutDashboard, LogOut, UserCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/action/auth.quires";
import { LogoutAction } from "@/lib/action/auth.action";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

const Navbar = async () => {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <header className="h-16 border-b bg-card flex items-center px-6 sticky top-0 z-30 card-shadow">
                <div className="ml-auto flex items-center gap-4">
                    <Button asChild variant="outline">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild variant="default">
                        <Link href="/register">Register</Link>
                    </Button>
                </div>
            </header>
        );
    }

    return (
        <header className="h-16 border-b bg-card flex items-center px-6 sticky top-0 z-30 card-shadow">
            <div className="ml-auto flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors">
                            <UserCircle className="w-6 h-6 text-muted-foreground" />
                            <span className="text-sm font-medium">{user?.name || "Employer"}</span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name || "Employer"}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email || "employer@example.com"}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={user?.role === "employer" ? "/employer/dashboard" : "/dashboard"} className="flex w-full items-center">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={user?.role === "employer" ? "/employer/profile" : "/profile"} className="flex w-full items-center">
                                <UserCircle className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        {user.role === "applicant" && (
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href="/applications" className="flex w-full items-center">
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    <span>My Applications</span>
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer text-destructive focus:text-destructive">
                            <form action={LogoutAction} className="w-full">
                                <button type="submit" className="flex w-full items-center">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

export default Navbar;