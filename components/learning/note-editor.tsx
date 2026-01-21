"use client";

import { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { saveNoteAction } from "./actions";
import { toast } from "sonner";
import { FileEdit, Check } from "lucide-react";

interface NoteEditorProps {
  enrollmentId: string;
  curriculumItemId: string;
  initialContent: string;
}

export function NoteEditor({
  enrollmentId,
  curriculumItemId,
  initialContent,
}: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Debounced save function
  useEffect(() => {
    // Don't save on initial render if content hasn't changed
    if (content === initialContent) return;

    const timeoutId = setTimeout(async () => {
      setIsSaving(true);
      try {
        const result = await saveNoteAction(
          enrollmentId,
          curriculumItemId,
          content
        );

        if (result.success) {
          setLastSaved(new Date());
        } else {
          toast.error("노트 저장 중 오류가 발생했습니다.");
        }
      } catch (error) {
        toast.error("노트 저장 중 오류가 발생했습니다.");
      } finally {
        setIsSaving(false);
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [content, enrollmentId, curriculumItemId, initialContent]);

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return "방금 전";
    if (seconds < 60) return `${seconds}초 전`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    return "하루 전";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <FileEdit className="h-4 w-4" />
          학습 노트
        </Label>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isSaving ? (
            <span>저장 중...</span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              {getTimeAgo(lastSaved)} 저장됨
            </span>
          ) : null}
        </div>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="이 아티클에 대한 학습 내용, 생각, 질문 등을 자유롭게 작성하세요..."
        className="min-h-[300px] resize-y font-mono text-sm"
      />
      <p className="text-xs text-muted-foreground">
        노트는 자동으로 저장됩니다.
      </p>
    </div>
  );
}
