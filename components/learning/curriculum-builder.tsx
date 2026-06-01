"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  MagnifyingGlass,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
} from "@phosphor-icons/react";
import { createUserCurriculumAction } from "./curriculum-actions";

export interface BuilderArticle {
  id: string;
  title: string;
  author: string | null;
  category: string | null;
}

interface CurriculumBuilderProps {
  articles: BuilderArticle[];
}

export function CurriculumBuilder({ articles }: CurriculumBuilderProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const articleById = useMemo(() => {
    const map = new Map<string, BuilderArticle>();
    for (const article of articles) map.set(article.id, article);
    return map;
  }, [articles]);

  // Search by title / author / category, excluding already-selected articles
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selectedSet = new Set(selectedIds);
    return articles
      .filter((article) => !selectedSet.has(article.id))
      .filter((article) => {
        if (!q) return true;
        return (
          article.title.toLowerCase().includes(q) ||
          (article.author?.toLowerCase().includes(q) ?? false) ||
          (article.category?.toLowerCase().includes(q) ?? false)
        );
      })
      .slice(0, 30);
  }, [articles, query, selectedIds]);

  const selectedArticles = selectedIds
    .map((id) => articleById.get(id))
    .filter((a): a is BuilderArticle => Boolean(a));

  const addArticle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeArticle = (id: string) => {
    setSelectedIds((prev) => prev.filter((existing) => existing !== id));
  };

  const move = (index: number, direction: -1 | 1) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (selectedIds.length === 0) {
      toast.error("아티클을 1개 이상 선택해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await createUserCurriculumAction({
        title,
        description,
        articleIds: selectedIds,
      });

      if (result.success && result.curriculumId) {
        toast.success("나만의 커리큘럼이 생성되었습니다!");
        router.push(`/my-learning/${result.curriculumId}`);
      } else {
        toast.error(result.error ?? "생성 중 오류가 발생했습니다.");
        setIsSaving(false);
      }
    } catch {
      toast.error("생성 중 오류가 발생했습니다.");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Curriculum meta */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="curriculum-title">제목</Label>
          <Input
            id="curriculum-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 디자인 시스템 입문 3주 코스"
            maxLength={100}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="curriculum-description">설명 (선택)</Label>
          <Textarea
            id="curriculum-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="이 커리큘럼으로 무엇을 배우게 되나요?"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Article search & pick */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">아티클 검색</h2>
          <div className="relative">
            <MagnifyingGlass
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="제목 · 저자 · 카테고리로 검색"
              className="pl-9"
            />
          </div>
          <div className="rounded-lg border divide-y max-h-[480px] overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((article) => (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => addArticle(article.id)}
                  className="w-full flex items-start gap-3 p-3 text-left hover:bg-accent/50 transition-colors"
                >
                  <Plus
                    size={18}
                    className="mt-0.5 flex-shrink-0 text-primary"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm line-clamp-2">
                      {article.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[article.author, article.category]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <p className="p-4 text-sm text-muted-foreground">
                {query
                  ? "검색 결과가 없습니다."
                  : "검색어를 입력하거나 목록에서 아티클을 추가하세요."}
              </p>
            )}
          </div>
        </div>

        {/* Selected articles in order */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            선택한 아티클{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {selectedArticles.length}
            </span>
          </h2>
          {selectedArticles.length > 0 ? (
            <ol className="space-y-2">
              {selectedArticles.map((article, index) => (
                <li
                  key={article.id}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <span className="text-sm font-semibold text-muted-foreground mt-0.5 w-5 flex-shrink-0">
                    {index + 1}.
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm line-clamp-2">
                      {article.title}
                    </p>
                    {article.author && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {article.author}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-label="위로"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === selectedArticles.length - 1}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-label="아래로"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeArticle(article.id)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                      aria-label="제거"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              왼쪽에서 아티클을 검색해 추가하세요.
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 border-t pt-6">
        <Button
          variant="outline"
          onClick={() => router.push("/my-learning")}
          disabled={isSaving}
        >
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? "생성 중..." : "커리큘럼 만들기"}
        </Button>
      </div>
    </div>
  );
}
