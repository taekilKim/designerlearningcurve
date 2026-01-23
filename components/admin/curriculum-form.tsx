"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCurriculumAction, updateCurriculumAction } from "./actions";
import { toast } from "sonner";

interface Curriculum {
  id: string;
  title: string;
  description: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_hours: number | null;
  category: string | null;
}

interface CurriculumFormProps {
  curriculum?: Curriculum;
  mode: "create" | "edit";
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

export function CurriculumForm({ curriculum, mode }: CurriculumFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >(curriculum?.difficulty || "beginner");
  const [category, setCategory] = useState<string>(curriculum?.category || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      difficulty,
      category: category || null,
      estimated_hours: formData.get("estimated_hours")
        ? parseInt(formData.get("estimated_hours") as string)
        : undefined,
    };

    try {
      const result =
        mode === "create"
          ? await createCurriculumAction(data)
          : await updateCurriculumAction(curriculum!.id, data);

      if (result.success) {
        toast.success(
          mode === "create"
            ? "커리큘럼이 생성되었습니다."
            : "커리큘럼이 수정되었습니다."
        );

        if (mode === "create" && "data" in result && result.data) {
          // Redirect to edit page to add articles
          router.push(`/admin/curriculums/${(result.data as { id: string }).id}/edit`);
        } else {
          router.push("/admin/curriculums");
        }
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
            {mode === "create" ? "새 커리큘럼 추가" : "커리큘럼 수정"}
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
              defaultValue={curriculum?.title}
              required
              placeholder="커리큘럼 제목을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={curriculum?.description || ""}
              placeholder="커리큘럼에 대한 설명을 입력하세요"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">
              난이도 <span className="text-destructive">*</span>
            </Label>
            <Select
              value={difficulty}
              onValueChange={(value) =>
                setDifficulty(value as "beginner" | "intermediate" | "advanced")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="난이도를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">초급</SelectItem>
                <SelectItem value="intermediate">중급</SelectItem>
                <SelectItem value="advanced">고급</SelectItem>
              </SelectContent>
            </Select>
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
            <Label htmlFor="estimated_hours">예상 학습 시간 (시간)</Label>
            <Input
              id="estimated_hours"
              name="estimated_hours"
              type="number"
              min="1"
              defaultValue={curriculum?.estimated_hours || ""}
              placeholder="예: 10"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting
                ? mode === "create"
                  ? "생성 중..."
                  : "수정 중..."
                : mode === "create"
                ? "커리큘럼 생성 후 아티클 추가"
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
