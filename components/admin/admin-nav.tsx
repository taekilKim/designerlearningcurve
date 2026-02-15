"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  FolderOpen,
  Home,
  Rss,
  Menu,
} from "lucide-react";

const navItems = [
  {
    title: "대시보드",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "아티클 관리",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    title: "커리큘럼 관리",
    href: "/admin/curriculums",
    icon: BookOpen,
  },
  {
    title: "카테고리 관리",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "소스 관리",
    href: "/admin/sources",
    icon: Rss,
  },
];

function AdminNavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 border-t pt-8">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Home className="h-4 w-4" />
          사이트로 돌아가기
        </Link>
      </div>
    </>
  );
}

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:hidden">
        <h2 className="text-base font-semibold">관리자 패널</h2>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="관리 메뉴 열기">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="border-b px-6 py-4">
              <SheetTitle className="text-lg">관리자 패널</SheetTitle>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <AdminNavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <nav className="hidden w-64 shrink-0 border-r bg-muted/40 p-6 md:block">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">관리자 패널</h2>
        </div>

        <AdminNavLinks pathname={pathname} />
      </nav>
    </>
  );
}
