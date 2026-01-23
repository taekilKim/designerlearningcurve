"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  id: string;
  name: string;
  label: string;
  icon: string;
  for_articles: boolean;
  for_curriculums: boolean;
  display_order: number;
}

interface CategorySidebarProps {
  type: "articles" | "curriculums";
  categories: Category[];
}

export function CategorySidebar({ type, categories }: CategorySidebarProps) {
  const pathname = usePathname();
  const basePath = type === "articles" ? "/" : "/curriculums";

  return (
    <aside className="w-64 flex-shrink-0 pr-8 border-r border-border">
      <div className="sticky top-24">
        <nav className="space-y-1">
          <Link
            href={basePath}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
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

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`${basePath}?category=${category.name}`}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                pathname.includes(category.name)
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
