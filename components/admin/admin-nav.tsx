"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  FolderOpen,
  Home
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
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 border-r bg-muted/40 p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">관리자 패널</h2>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
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

      <div className="mt-8 pt-8 border-t">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          <Home className="h-4 w-4" />
          사이트로 돌아가기
        </Link>
      </div>
    </nav>
  );
}
