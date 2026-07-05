"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarContents } from "@/components/portal-sidebar";

export function MobileNav({ variant }: { variant: "applicant" | "employer" }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-white/[0.06] hover:text-white lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[280px] border-white/[0.06] bg-sidebar/95 p-0 backdrop-blur-xl"
      >
        <SidebarContents variant={variant} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
