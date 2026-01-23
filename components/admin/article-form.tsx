"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createArticleAction, updateArticleAction, extractMetadataAction } from "./actions";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

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
  { id: "prototyping", label: "프로토타이핑" },
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
  const [isExtracting, setIsExtracting] = useState(false);

  // Form state
  const [title, setTitle] = useState(article?.title || "");
  const [description, setDescription] = useState(article?.description || "");
  const [url, setUrl] = useState(article?.url || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(article?.thumbnail_url || "");
  const [author, setAuthor] = useState(article?.author || "");
  const [publishedAt, setPublishedAt] = useState(
    article?.published_at
      ? new Date(article.published_at).toISOString().split("T")[0]
      : ""
  );
  const [category, setCategory] = useState<string>(article?.category || "");

  const handleExtractMetadata = async () => {
    if (!url) {
      toast.error("URL을 먼저 입력해주세요.");
      return;
    }

    setIsExtracting(true);
    try {
      const result = await extractMetadataAction(url);
      if (result.success && result.data) {
        // Auto-fill form fields with extracted metadata
        if (result.data.title && !title) {
          setTitle(result.data.title);
        }
        if (result.data.description && !description) {
          setDescription(result.data.description);
        }
        if (result.data.thumbnail_url) {
          setThumbnailUrl(result.data.thumbnail_url);
        }
        if (result.data.author && !author) {
          setAuthor(result.data.author);
        }
        toast.success("메타데이터를 성공적으로 추출했습니다.");
      } else {
        toast.error(result.error || "메타데이터 추출에 실패했습니다.");
      }
    } catch (error) {
      toast.error("메타데이터 추출 중 오류가 발생했습니다.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      title,
      description,
      url,
      thumbnail_url: thumbnailUrl,
      author,
      published_at: publishedAt,
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
            <Label htmlFor="url">
              URL <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="url"
                name="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="https://example.com/article"
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleExtractMetadata}
                disabled={!url || isExtracting}
                className="whitespace-nowrap"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isExtracting ? "추출 중..." : "자동 추출"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              URL을 입력한 후 자동 추출을 클릭하면 메타데이터를 자동으로 가져옵니다.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              제목 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="아티클 제목을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="아티클에 대한 간단한 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">썸네일 URL</Label>
            <Input
              id="thumbnail_url"
              name="thumbnail_url"
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">저자</Label>
            <Input
              id="author"
              name="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
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
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
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
