"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { bulkUpdateArticlesMetadataAction } from "./actions";
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

export function BulkUpdateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleBulkUpdate = async () => {
    setIsUpdating(true);

    try {
      toast.info("메타데이터 일괄 업데이트를 시작합니다...");

      const result = await bulkUpdateArticlesMetadataAction();

      if (result.success) {
        const { updated = 0, skipped = 0, failed = 0, total = 0 } = result;

        toast.success("일괄 업데이트 완료!", {
          description: (
            <div className="text-sm space-y-1 mt-2">
              <p>✅ 업데이트: {updated}개</p>
              <p>⏭️ 건너뜀: {skipped}개</p>
              {failed > 0 && <p>❌ 실패: {failed}개</p>}
              <p className="font-semibold pt-1">전체: {total}개</p>
            </div>
          ),
          duration: 6000,
        });

        setIsOpen(false);
      } else {
        toast.error(result.error || "일괄 업데이트 실패");
      }
    } catch (error) {
      toast.error("일괄 업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={() => setIsOpen(true)}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        메타데이터 일괄 업데이트
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>메타데이터 일괄 업데이트</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                모든 아티클의 URL에서 메타데이터(제목, 설명, 썸네일, 저자)를 자동으로 추출하여 업데이트합니다.
              </p>
              <p className="text-sm">
                • 비어있는 필드만 업데이트됩니다 (기존 데이터는 유지)<br />
                • 아티클 개수에 따라 몇 분이 소요될 수 있습니다<br />
                • 일부 사이트는 메타데이터 추출이 불가능할 수 있습니다
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? "업데이트 중..." : "시작"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
