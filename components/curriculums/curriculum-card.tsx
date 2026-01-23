import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
    curriculum_items?: { count: number }[];
  };
}

const difficultyLabels = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

export function CurriculumCard({ curriculum }: CurriculumCardProps) {
  const articleCount = curriculum.curriculum_items?.[0]?.count || 0;

  return (
    <Link
      href={`/curriculums/${curriculum.id}`}
      className="group block cursor-pointer"
    >
      <article className="rounded-lg overflow-hidden transition-all hover:bg-muted/30">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {curriculum.thumbnail_url ? (
            <Image
              src={curriculum.thumbnail_url}
              alt={curriculum.title}
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
              className="object-cover transition-opacity group-hover:opacity-80"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/15 group-hover:to-primary/10 transition-colors">
              <BookOpen className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Category & Difficulty */}
          <div className="flex items-center gap-2">
            {curriculum.category && (
              <Badge variant="secondary" className="text-xs">
                {curriculum.category}
              </Badge>
            )}
            {curriculum.difficulty && (
              <Badge variant="outline" className="text-xs">
                {difficultyLabels[curriculum.difficulty]}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {curriculum.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {curriculum.description || "설명이 없습니다."}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{articleCount}개 아티클</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
