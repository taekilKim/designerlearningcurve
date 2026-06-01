"use client";

import Link from "next/link";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsThree, Trash, SealCheck } from "@phosphor-icons/react";
import { useState } from "react";
import { deleteEnrollmentAction } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { LearningEnrollment } from "@/lib/learning";

interface EnrollmentCardProps {
  enrollment: LearningEnrollment;
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const isCompleted =
    enrollment.stats.totalItems > 0 &&
    enrollment.stats.completedItems >= enrollment.stats.totalItems;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("정말로 이 커리큘럼 등록을 취소하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteEnrollmentAction(enrollment.id);
      if (result.success) {
        toast.success("커리큘럼 등록이 취소되었습니다.");
        router.refresh();
      } else {
        toast.error("삭제 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Link
      href={`/my-learning/${enrollment.curriculum_id}`}
      className="group relative block rounded-lg border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
    >
      {/* Thumbnail */}
      <div className="aspect-video w-full bg-muted relative overflow-hidden">
        {isCompleted && (
          <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
            <SealCheck size={14} weight="fill" />
            수료 완료
          </div>
        )}
        {enrollment.curriculum.thumbnail_url ? (
          <Image
            src={enrollment.curriculum.thumbnail_url}
            alt={enrollment.curriculum.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="text-sm">썸네일 없음</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-lg font-semibold line-clamp-2 flex-1">
            {enrollment.curriculum.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent flex-shrink-0"
                disabled={isDeleting}
              >
                <DotsThree size={20} weight="bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive cursor-pointer"
                disabled={isDeleting}
              >
                <Trash size={16} className="mr-2" />
                {isDeleting ? "삭제 중..." : "등록 취소"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {enrollment.curriculum.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {enrollment.curriculum.description}
          </p>
        )}

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {isCompleted ? "모든 아티클 완료 🎉" : "학습 진행률"}
            </span>
            <span className="font-medium">
              {enrollment.stats.completedItems} / {enrollment.stats.totalItems}
            </span>
          </div>
          <Progress value={enrollment.stats.progressPercentage} className="h-2" />
        </div>
      </div>
    </Link>
  );
}
