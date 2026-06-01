"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, ChevronDown } from "lucide-react";
import { toggleCompletionAction } from "./actions";
import { toast } from "sonner";
import {
  isCurriculumItemCompleted,
  type LearningCurriculumItem,
} from "@/lib/learning";

interface ArticleListProps {
  enrollmentId: string;
  items: LearningCurriculumItem[];
}

export function ArticleList({ enrollmentId, items }: ArticleListProps) {
  const [localItems, setLocalItems] = useState(items);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const toggleExpandedItem = (itemId: string) => {
    setExpandedItem((currentItemId) => (currentItemId === itemId ? null : itemId));
  };

  const handleToggleCompletion = async (
    curriculumItemId: string,
    isCompleted: boolean
  ) => {
    // Optimistically update UI
    setLocalItems((prev) =>
      prev.map((item) => {
        if (item.id !== curriculumItemId) return item;

        return {
          ...item,
          completed_items: isCompleted
            ? [{ id: "temp", completed_at: new Date().toISOString() }]
            : [],
        };
      })
    );

    // Call server action
    try {
      const result = await toggleCompletionAction(
        enrollmentId,
        curriculumItemId,
        isCompleted
      );

      if (!result.success) {
        // Revert optimistic update on error
        setLocalItems(items);
        toast.error("저장 중 오류가 발생했습니다.");
      } else if (result.justCompleted) {
        toast.success("🎉 커리큘럼을 수료했습니다! 수고하셨어요.");
      }
    } catch {
      // Revert optimistic update on error
      setLocalItems(items);
      toast.error("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold mb-4">아티클 목록</h2>
      {localItems.map((item, index) => {
        const isCompleted = isCurriculumItemCompleted(item);
        const isExpanded = expandedItem === item.id;

        return (
          <div
            key={item.id}
            className="rounded-lg border bg-card transition-all"
          >
            {/* Item header - always visible */}
            <div
              className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-accent/5 transition-colors ${
                isExpanded ? "border-b" : ""
              }`}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              onClick={() => toggleExpandedItem(item.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleExpandedItem(item.id);
                }
              }}
            >
                <Checkbox
                  id={`item-${item.id}`}
                  checked={isCompleted}
                  onCheckedChange={(checked) => {
                    handleToggleCompletion(item.id, checked === true);
                  }}
                onClick={(e) => e.stopPropagation()}
                className="mt-1 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-muted-foreground flex-shrink-0">
                      {index + 1}.
                    </span>
                    <h4
                      className={`font-medium ${
                        isCompleted
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {item.article?.title}
                    </h4>
                  </div>
                  <a
                    href={item.article?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                {item.curator_note && !isExpanded && (
                  <div className="mt-2 p-3 bg-muted rounded-md text-sm text-muted-foreground">
                    💡 {item.curator_note}
                  </div>
                )}
              </div>
            </div>

            {/* Expanded content - article info */}
            {isExpanded && (
              <div className="p-4 space-y-4">
                <div>
                  <h5 className="font-semibold mb-2 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    아티클 정보
                  </h5>
                  {item.article?.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.article.description}
                    </p>
                  )}
                  {item.article?.author && (
                    <p className="text-sm text-muted-foreground mb-3">
                      작성자: {item.article.author}
                    </p>
                  )}
                  <a
                    href={item.article?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                    아티클 읽으러 가기
                  </a>
                </div>

                {item.curator_note && (
                  <div>
                    <h5 className="font-semibold mb-2">💡 큐레이터 노트</h5>
                    <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground whitespace-pre-wrap">
                      {item.curator_note}
                    </div>
                  </div>
                )}

                {/* Close button for mobile */}
                <button
                  onClick={() => setExpandedItem(null)}
                  className="w-full md:hidden flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown className="h-4 w-4 rotate-180" />
                  접기
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
