"use client";

import { useState, useEffect } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveNoteAction } from "./actions";
import { toast } from "sonner";
import { FileEdit, Check, Save } from "lucide-react";

interface NoteEditorProps {
  enrollmentId: string;
  initialContent: string;
}

export function NoteEditor({
  enrollmentId,
  initialContent,
}: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Update content when initialContent changes (e.g., after data fetch)
  useEffect(() => {
    if (initialContent && content === "") {
      console.log('[Note Editor] Loading initial content:', { enrollmentId, contentLength: initialContent.length });
      setContent(initialContent);
    }
  }, [initialContent, enrollmentId]);

  // Track if content has changed
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsDirty(newContent !== initialContent);
  };

  // Manual save function
  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('[Note Editor] Saving note...', { enrollmentId, contentLength: content.length });

      const result = await saveNoteAction(
        enrollmentId,
        content
      );

      console.log('[Note Editor] Save result:', result);

      if (result.success) {
        setLastSaved(new Date());
        setIsDirty(false);
        toast.success("노트가 저장되었습니다.");
      } else {
        const errorMessage = result.error || "알 수 없는 오류";
        toast.error(`노트 저장 중 오류가 발생했습니다: ${errorMessage}`);
        console.error('[Note Editor] Save failed:', result.error);
      }
    } catch (error) {
      console.error('[Note Editor] Exception:', error);
      toast.error(`노트 저장 중 오류가 발생했습니다: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

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
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <FileEdit className="h-4 w-4" />
        학습 노트
      </Label>
      <RichTextEditor
        content={content}
        onChange={handleContentChange}
        placeholder="이 커리큘럼에 대한 학습 내용, 생각, 질문 등을 자유롭게 작성하세요..."
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          텍스트 포맷팅을 사용할 수 있습니다.
        </p>
        <div className="flex items-center gap-3">
          {lastSaved && !isDirty && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Check className="h-3 w-3" />
              {getTimeAgo(lastSaved)} 저장됨
            </span>
          )}
          {isDirty && (
            <span className="text-xs text-amber-600">
              저장되지 않은 변경사항
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            size="sm"
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </div>
  );
}
