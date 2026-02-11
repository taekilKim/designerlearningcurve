import Link from "next/link";
import { BookOpen } from "lucide-react";
import Image from "next/image";

interface CurriculumCardProps {
  curriculum: {
    id: string;
    title: string;
    description: string | null;
    category?: string | null;
    thumbnail_url?: string | null;
    difficulty?: "beginner" | "intermediate" | "advanced";
    estimated_hours?: number | null;
    created_at?: string;
    curriculum_items?: { count: number }[];
  };
}

const difficultyLabels: Record<string, string> = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

const difficultyColors: Record<string, string> = {
  beginner: "text-emerald-600",
  intermediate: "text-blue-600",
  advanced: "text-purple-600",
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
  } catch {
    return "";
  }
}

export function CurriculumCard({ curriculum }: CurriculumCardProps) {
  const articleCount = curriculum.curriculum_items?.[0]?.count || 0;

  return (
    <Link
      href={`/curriculums/${curriculum.id}`}
      className="group block cursor-pointer"
    >
      <article>
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
          {curriculum.thumbnail_url ? (
            <Image
              src={curriculum.thumbnail_url}
              alt={curriculum.title}
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/5">
              <BookOpen className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-3 space-y-1.5">
          {/* Meta */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{articleCount}개 아티클</span>
            {curriculum.estimated_hours && (
              <>
                <span className="text-muted-foreground/50">|</span>
                <span>약 {curriculum.estimated_hours}시간</span>
              </>
            )}
            {curriculum.created_at && (
              <>
                <span className="text-muted-foreground/50">|</span>
                <span>{formatDate(curriculum.created_at)}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {curriculum.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-1">
            {curriculum.description || "설명이 없습니다."}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-2 pt-1">
            {curriculum.difficulty && (
              <span className={`text-xs font-medium ${difficultyColors[curriculum.difficulty]}`}>
                {difficultyLabels[curriculum.difficulty]}
              </span>
            )}
            {curriculum.category && (
              <span className="text-xs font-medium text-primary">
                {curriculum.category}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
