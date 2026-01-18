"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  author: string;
  published_at: string;
}

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-lg overflow-hidden"
      onClick={() => window.open(article.url, "_blank")}
    >
      {article.thumbnail_url && (
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          <Image
            src={article.thumbnail_url}
            alt={article.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2">
          <span className="line-clamp-2">{article.title}</span>
          <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        </CardTitle>
        {article.description && (
          <CardDescription className="line-clamp-2">
            {article.description}
          </CardDescription>
        )}
      </CardHeader>
      {article.author && (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            by {article.author}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
