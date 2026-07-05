import React from "react";
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  UserCircle,
  MessageSquare,
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
import { MobileNav } from "@/components/mobile-nav";
import { NavSearch } from "@/components/nav-search";

const Navbar = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <header className="sticky top-0 z-30 flex h-[70px] items-center border-b border-white/[0.06] bg-background/70 px-6 backdrop-blur-xl">
        <Link href="/" className="text-lg font-bold tracking-tight gradient-text">
          HireNest
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-white"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 transition-all hover:from-violet-500 hover:to-purple-500"
          >
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </header>
    );
  }

  const variant = user.role === "employer" ? "employer" : "applicant";
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-30 flex h-[70px] items-center gap-2 border-b border-white/[0.06] bg-background/70 px-4 backdrop-blur-xl sm:px-6">
      <MobileNav variant={variant} />

      {user.role === "applicant" && <NavSearch />}

      <div className="ml-auto flex items-center gap-2">
        {/* Messages shortcut */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-white/[0.06] hover:text-white"
        >
          <Link
            href={user.role === "employer" ? "/employer/chat" : "/chat"}
            aria-label="Messages"
          >
            <MessageSquare className="h-[18px] w-[18px]" />
          </Link>
        </Button>

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-white/[0.08]" />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex cursor-pointer items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-3 outline-none transition-colors hover:bg-white/[0.05]">
              <Avatar className="h-8 w-8 border border-primary/30">
                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-pink-600 text-xs font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold leading-none text-white">
                  {user?.name || "User"}
                </p>
                <p className="mt-0.5 text-[11px] capitalize leading-none text-muted-foreground">
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
              className="cursor-pointer rounded-lg px-3 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
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
