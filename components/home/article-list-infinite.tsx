"use client";

import { useEffect, useRef, useState } from "react";
import { ArticleCard } from "./article-card";
import { loadMoreArticlesAction } from "@/components/admin/actions";
import { Loader2 } from "lucide-react";

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

interface ArticleListInfiniteProps {
  initialArticles: Article[];
  category?: string;
}

const PAGE_SIZE = 12;

export function ArticleListInfinite({
  initialArticles,
  category,
}: ArticleListInfiniteProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialArticles.length === PAGE_SIZE);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset when category changes
    setArticles(initialArticles);
    setPage(1);
    setHasMore(initialArticles.length === PAGE_SIZE);
  }, [category, initialArticles]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, page, category]);

  const loadMore = async () => {
    setIsLoading(true);
    try {
      const result = await loadMoreArticlesAction(page, PAGE_SIZE, category);

      if (result.success && result.articles) {
        if (result.articles.length === 0) {
          setHasMore(false);
        } else {
          setArticles((prev) => [...prev, ...result.articles]);
          setPage((prev) => prev + 1);
          setHasMore(result.articles.length === PAGE_SIZE);
        }
      }
    } catch (error) {
      console.error("Error loading more articles:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Observer Target */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">로딩 중...</span>
          </div>
        )}
      </div>

      {!hasMore && articles.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            모든 아티클을 불러왔습니다.
          </p>
        </div>
      )}

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {category
              ? "이 카테고리에 아티클이 없습니다."
              : "아직 등록된 아티클이 없습니다."}
          </p>
        </div>
      )}
    </>
  );
}
