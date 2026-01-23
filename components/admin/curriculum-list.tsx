"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, BookOpen } from "lucide-react";
import { deleteCurriculumAction, updateCurriculumAction } from "./actions";
import { toast } from "sonner";

interface Curriculum {
  id: string;
  title: string;
  description: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_hours: number | null;
  category: string | null;
  created_at: string;
  curriculum_items: { count: number }[];
}

interface Category {
  id: string;
  name: string;
  label: string;
  icon: string;
}

interface CurriculumListProps {
  curriculums: Curriculum[];
  categories: Category[];
}

const difficultyLabels = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

export function CurriculumList({ curriculums, categories }: CurriculumListProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleCategoryChange = async (curriculumId: string, newCategory: string) => {
    setUpdatingId(curriculumId);
    try {
      const result = await updateCurriculumAction(curriculumId, {
        category: newCategory === "none" ? null : newCategory,
      });

      if (result.success) {
        toast.success("카테고리가 변경되었습니다.");
        router.refresh();
      } else {
        toast.error(result.error || "카테고리 변경에 실패했습니다.");
      }
    } catch (error) {
      toast.error("카테고리 변경 중 오류가 발생했습니다.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDifficultyChange = async (
    curriculumId: string,
    newDifficulty: "beginner" | "intermediate" | "advanced"
  ) => {
    setUpdatingId(curriculumId);
    try {
      const result = await updateCurriculumAction(curriculumId, {
        difficulty: newDifficulty,
      });

      if (result.success) {
        toast.success("난이도가 변경되었습니다.");
        router.refresh();
      } else {
        toast.error(result.error || "난이도 변경에 실패했습니다.");
      }
    } catch (error) {
      toast.error("난이도 변경 중 오류가 발생했습니다.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteCurriculumAction(id);
      if (result.success) {
        toast.success("커리큘럼이 삭제되었습니다.");
        setDeleteId(null);
        router.refresh();
      } else {
        toast.error(result.error || "삭제 중 오류가 발생했습니다.");
      }
    } catch (error) {
      toast.error("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRowClick = (curriculumId: string, e: React.MouseEvent) => {
    // Ignore clicks on buttons, links, and select elements
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("[role='combobox']") ||
      target.closest(".select-trigger")
    ) {
      return;
    }
    router.push(`/admin/curriculums/${curriculumId}/edit`);
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">제목</TableHead>
              <TableHead className="w-[120px]">아티클</TableHead>
              <TableHead className="w-[150px]">난이도</TableHead>
              <TableHead className="w-[180px]">카테고리</TableHead>
              <TableHead className="w-[120px]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {curriculums.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  등록된 커리큘럼이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              curriculums.map((curriculum) => {
                const itemCount = curriculum.curriculum_items?.[0]?.count || 0;
                return (
                  <TableRow
                    key={curriculum.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={(e) => handleRowClick(curriculum.id, e)}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium line-clamp-1">
                          {curriculum.title}
                        </div>
                        {curriculum.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {curriculum.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <BookOpen className="h-4 w-4" />
                        {itemCount}개
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={curriculum.difficulty}
                        onValueChange={(value) =>
                          handleDifficultyChange(
                            curriculum.id,
                            value as "beginner" | "intermediate" | "advanced"
                          )
                        }
                        disabled={updatingId === curriculum.id}
                      >
                        <SelectTrigger className="select-trigger w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">초급</SelectItem>
                          <SelectItem value="intermediate">중급</SelectItem>
                          <SelectItem value="advanced">고급</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={curriculum.category || "none"}
                        onValueChange={(value) => handleCategoryChange(curriculum.id, value)}
                        disabled={updatingId === curriculum.id}
                      >
                        <SelectTrigger className="select-trigger w-[160px]">
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">없음</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.icon} {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/curriculums/${curriculum.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(curriculum.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>커리큘럼을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 커리큘럼과 연결된 모든 학습 데이터가 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
