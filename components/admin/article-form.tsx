"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createArticleAction, updateArticleAction } from "./actions";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail_url: string | null;
  author: string | null;
  published_at: string | null;
  category: string | null;
}

const CATEGORIES = [
  { id: "research", label: "리서치 및 방법론" },
  { id: "ui-design", label: "UI 디자인" },
  { id: "ux-design", label: "UX 설계" },
  { id: "design-system", label: "디자인 시스템" },
  { id: "design-principle", label: "디자인 원칙 및 철학" },
  { id: "collaboration", label: "협업과 소프트스킬" },
  { id: "career", label: "디자인 커리어" },
];

interface ArticleFormProps {
  article?: Article;
  mode: "create" | "edit";
}

export function ArticleForm({ article, mode }: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<string>(article?.category || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      url: formData.get("url") as string,
      thumbnail_url: formData.get("thumbnail_url") as string,
      author: formData.get("author") as string,
      published_at: formData.get("published_at") as string,
      category: category || null,
    };

    try {
      const result =
        mode === "create"
          ? await createArticleAction(data)
          : await updateArticleAction(article!.id, data);

      if (result.success) {
        toast.success(
          mode === "create"
            ? "아티클이 생성되었습니다."
            : "아티클이 수정되었습니다."
        );
        router.push("/admin/articles");
      } else {
        toast.error(result.error || "오류가 발생했습니다.");
      }
    } catch (error) {
      toast.error("오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "새 아티클 추가" : "아티클 수정"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">
              제목 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={article?.title}
              required
              placeholder="아티클 제목을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={article?.description || ""}
              placeholder="아티클에 대한 간단한 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">
              URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="url"
              name="url"
              type="url"
              defaultValue={article?.url}
              required
              placeholder="https://example.com/article"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">썸네일 URL</Label>
            <Input
              id="thumbnail_url"
              name="thumbnail_url"
              type="url"
              defaultValue={article?.thumbnail_url || ""}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">저자</Label>
            <Input
              id="author"
              name="author"
              defaultValue={article?.author || ""}
              placeholder="저자명을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="published_at">발행일</Label>
            <Input
              id="published_at"
              name="published_at"
              type="date"
              defaultValue={
                article?.published_at
                  ? new Date(article.published_at).toISOString().split("T")[0]
                  : ""
              }
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting
                ? mode === "create"
                  ? "생성 중..."
                  : "수정 중..."
                : mode === "create"
                ? "아티클 생성"
                : "변경사항 저장"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
