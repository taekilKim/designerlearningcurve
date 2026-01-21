"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Trash2, BookOpen } from "lucide-react";
import { deleteCurriculumAction } from "./actions";
import { toast } from "sonner";
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

interface Curriculum {
  id: string;
  title: string;
  description: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_hours: number | null;
  created_at: string;
  curriculum_items: { count: number }[];
}

interface CurriculumListProps {
  curriculums: Curriculum[];
}

const difficultyLabels = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

export function CurriculumList({ curriculums }: CurriculumListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteCurriculumAction(id);
      if (result.success) {
        toast.success("커리큘럼이 삭제되었습니다.");
        setDeleteId(null);
      } else {
        toast.error(result.error || "삭제 중 오류가 발생했습니다.");
      }
    } catch (error) {
      toast.error("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {curriculums.map((curriculum) => {
          const itemCount = curriculum.curriculum_items?.[0]?.count || 0;

          return (
            <Card key={curriculum.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{curriculum.title}</CardTitle>
                      <Badge variant="secondary">
                        {difficultyLabels[curriculum.difficulty]}
                      </Badge>
                    </div>
                    {curriculum.description && (
                      <CardDescription>{curriculum.description}</CardDescription>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {itemCount}개 아티클
                      </span>
                      {curriculum.estimated_hours && (
                        <span>{curriculum.estimated_hours}시간</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/curriculums/${curriculum.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(curriculum.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
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
