import React from "react";
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  UserCircle,
  MessageSquare,
  Bell,
  Search,
  Sun,
  Moon,
} from "lucide-react";
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
import { Avatar, AvatarFallback } from "../ui/avatar";

const Navbar = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <header className="h-[70px] border-b border-border/60 bg-card/80 backdrop-blur-xl flex items-center px-6 sticky top-0 z-30">
        <div className="ml-auto flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="gradient-primary text-white border-0 shadow-md hover:shadow-lg transition-shadow"
          >
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </header>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="h-[70px] border-b border-border/60 bg-card/80 backdrop-blur-xl flex items-center px-6 sticky top-0 z-30">
      {/* Search bar (optional - visible on wider screens) */}
      <div className="hidden lg:flex items-center gap-2 bg-muted/60 rounded-xl px-3 py-2 w-72 transition-colors focus-within:bg-muted focus-within:ring-1 focus-within:ring-primary/20">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-pink-500 ring-2 ring-card animate-pulse-soft" />
        </Button>

        {/* Messages shortcut */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80"
        >
          <Link href={user.role === "employer" ? "/employer/chat" : "/chat"}>
            <MessageSquare className="h-[18px] w-[18px]" />
          </Link>
        </Button>

        {/* Divider */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 cursor-pointer hover:bg-muted/60 py-1.5 pl-1.5 pr-3 rounded-xl transition-colors outline-none">
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarFallback className="gradient-primary text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold leading-none">
                  {user?.name || "User"}
                </p>
                <p className="text-[11px] text-muted-foreground leading-none mt-0.5 capitalize">
                  {user?.role}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">
                  {user?.name || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg px-3 py-2"
            >
              <Link
                href={
                  user?.role === "employer"
                    ? "/employer/dashboard"
                    : "/dashboard"
                }
                className="flex w-full items-center"
              >
                <LayoutDashboard className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg px-3 py-2"
            >
              <Link
                href={
                  user?.role === "employer" ? "/employer/profile" : "/profile"
                }
                className="flex w-full items-center"
              >
                <UserCircle className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            {user.role === "applicant" && (
              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-lg px-3 py-2"
              >
                <Link href="/applications" className="flex w-full items-center">
                  <Briefcase className="mr-2.5 h-4 w-4 text-muted-foreground" />
                  <span>My Applications</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg px-3 py-2"
            >
              <Link
                href={user.role === "employer" ? "/employer/chat" : "/chat"}
                className="flex w-full items-center"
              >
                <MessageSquare className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span>Messages</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg px-3 py-2 text-destructive focus:text-destructive focus:bg-destructive/8"
            >
              <form action={LogoutAction} className="w-full">
                <button type="submit" className="flex w-full items-center">
                  <LogOut className="mr-2.5 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
