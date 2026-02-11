"use client";

import Image from "next/image";
import { FileText } from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail_url: string | null;
  author: string | null;
  published_at: string | null;
  category?: string;
}

interface ArticleCardProps {
  article: Article;
}

function getFaviconUrl(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
}

function formatDate(dateStr: string | null) {
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

export function ArticleCard({ article }: ArticleCardProps) {
  const faviconUrl = getFaviconUrl(article.url);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block cursor-pointer"
    >
      <article>
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
          {article.thumbnail_url ? (
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/5">
              <FileText className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}

          {/* Favicon */}
          {faviconUrl && (
            <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
              <Image
                src={faviconUrl}
                alt=""
                width={18}
                height={18}
                className="rounded-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-3 space-y-1.5">
          {/* Author | Date */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {article.author && (
              <>
                <span className="font-medium text-foreground/70">{article.author}</span>
                <span className="text-muted-foreground/50">|</span>
              </>
            )}
            <span>{formatDate(article.published_at)}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          {/* Description */}
          {article.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {article.description}
            </p>
          )}

          {/* Category Tag */}
          {article.category && (
            <div className="pt-1">
              <Link
                href={`/?category=${article.category}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-medium text-primary hover:underline"
              >
                {article.category}
              </Link>
            </div>
          )}
        </div>
      </article>
    </a>
  );
}
