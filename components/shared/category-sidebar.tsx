"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CATEGORIES = [
  { id: "research", label: "리서치 및 방법론", icon: "🔍" },
  { id: "ui-design", label: "UI 디자인", icon: "🎨" },
  { id: "ux-design", label: "UX 설계", icon: "✏️" },
  { id: "design-system", label: "디자인 시스템", icon: "🧩" },
  { id: "design-principle", label: "디자인 원칙 및 철학", icon: "💡" },
  { id: "collaboration", label: "협업과 소프트스킬", icon: "🤝" },
  { id: "career", label: "디자인 커리어", icon: "🚀" },
];

interface CategorySidebarProps {
  type: "articles" | "curriculums";
}

export function CategorySidebar({ type }: CategorySidebarProps) {
  const pathname = usePathname();
  const basePath = type === "articles" ? "/" : "/curriculums";

  return (
    <aside className="w-64 flex-shrink-0 pr-8 border-r border-border">
      <div className="sticky top-24">
        <nav className="space-y-1">
          <Link
            href={basePath}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
              pathname === basePath
                ? "bg-secondary text-secondary-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            <span>📚</span>
            <span>전체 보기</span>
          </Link>

          <div className="pt-4 pb-2 px-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              카테고리
            </h3>
          </div>

          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`${basePath}?category=${category.id}`}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
                pathname.includes(category.id)
                  ? "bg-secondary text-secondary-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
