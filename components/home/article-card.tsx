"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface Article {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail_url: string | null;
  author: string | null;
  published_at: string;
  category?: string;
}

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block cursor-pointer"
    >
      <article className="rounded-lg overflow-hidden transition-all hover:bg-muted/30">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {article.thumbnail_url ? (
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
              className="object-cover transition-opacity group-hover:opacity-80"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/15 group-hover:to-primary/10 transition-colors">
              <FileText className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Category */}
          {article.category && (
            <div>
              <Badge variant="secondary" className="text-xs">
                {article.category}
              </Badge>
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          {/* Description */}
          {article.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {article.description}
            </p>
          )}

          {/* Author */}
          {article.author && (
            <p className="text-xs text-muted-foreground">
              {article.author}
            </p>
          )}
        </div>
      </article>
    </a>
  );
}
