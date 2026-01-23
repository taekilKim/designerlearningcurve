"use client";

import { useEffect, useRef, useState } from "react";
import { CurriculumCard } from "./curriculum-card";
import { loadMoreCurriculumsAction } from "@/components/admin/actions";
import { Loader2 } from "lucide-react";

interface Curriculum {
  id: string;
  title: string;
  description: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_hours: number | null;
  thumbnail_url: string | null;
  category: string | null;
  created_at: string;
  curriculum_items?: { count: number }[];
}

interface CurriculumListInfiniteProps {
  initialCurriculums: Curriculum[];
  category?: string;
}

const PAGE_SIZE = 12;

export function CurriculumListInfinite({
  initialCurriculums,
  category,
}: CurriculumListInfiniteProps) {
  const [curriculums, setCurriculums] = useState<Curriculum[]>(initialCurriculums);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialCurriculums.length === PAGE_SIZE);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset when category changes
    setCurriculums(initialCurriculums);
    setPage(1);
    setHasMore(initialCurriculums.length === PAGE_SIZE);
  }, [category, initialCurriculums]);

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
      const result = await loadMoreCurriculumsAction(page, PAGE_SIZE, category);

      if (result.success && result.curriculums) {
        if (result.curriculums.length === 0) {
          setHasMore(false);
        } else {
          setCurriculums((prev) => [...prev, ...result.curriculums]);
          setPage((prev) => prev + 1);
          setHasMore(result.curriculums.length === PAGE_SIZE);
        }
      }
    } catch (error) {
      console.error("Error loading more curriculums:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {curriculums.map((curriculum) => (
          <CurriculumCard key={curriculum.id} curriculum={curriculum} />
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

      {!hasMore && curriculums.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            모든 커리큘럼을 불러왔습니다.
          </p>
        </div>
      )}

      {curriculums.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {category
              ? "이 카테고리에 커리큘럼이 없습니다."
              : "아직 등록된 커리큘럼이 없습니다."}
          </p>
        </div>
      )}
    </>
  );
}
