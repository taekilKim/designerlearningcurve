"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, ChevronDown, FileEdit } from "lucide-react";
import { useState } from "react";
import { toggleCompletionAction } from "./actions";
import { toast } from "sonner";
import { NoteEditor } from "./note-editor";

interface LearningAccordionProps {
  enrollments: any[];
}

export function LearningAccordion({ enrollments }: LearningAccordionProps) {
  const [localEnrollments, setLocalEnrollments] = useState(enrollments);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleToggleCompletion = async (
    enrollmentId: string,
    curriculumItemId: string,
    isCompleted: boolean
  ) => {
    // Optimistically update UI
    setLocalEnrollments((prev) =>
      prev.map((enrollment) => {
        if (enrollment.id !== enrollmentId) return enrollment;

        const updatedItems = enrollment.curriculum.curriculum_items.map(
          (item: any) => {
            if (item.id !== curriculumItemId) return item;

            return {
              ...item,
              completed_items: isCompleted
                ? [{ id: "temp", completed_at: new Date().toISOString() }]
                : [],
            };
          }
        );

        const totalItems = updatedItems.length;
        const completedItems = updatedItems.filter(
          (item: any) => item.completed_items && item.completed_items.length > 0
        ).length;
        const progressPercentage =
          totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

        return {
          ...enrollment,
          curriculum: {
            ...enrollment.curriculum,
            curriculum_items: updatedItems,
          },
          stats: {
            totalItems,
            completedItems,
            progressPercentage,
          },
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
        setLocalEnrollments(enrollments);
        toast.error("저장 중 오류가 발생했습니다.");
      }
    } catch (error) {
      // Revert optimistic update on error
      setLocalEnrollments(enrollments);
      toast.error("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {localEnrollments.map((enrollment) => (
        <AccordionItem
          key={enrollment.id}
          value={enrollment.id}
          className="border rounded-lg px-6 py-2"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex-1 text-left pr-4">
              <h3 className="text-xl font-semibold mb-2">
                {enrollment.curriculum?.title}
              </h3>
              <div className="flex items-center gap-4">
                <Progress
                  value={enrollment.stats.progressPercentage}
                  className="flex-1 max-w-xs"
                />
                <span className="text-sm text-muted-foreground">
                  {enrollment.stats.completedItems} / {enrollment.stats.totalItems}
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-4">
              {enrollment.curriculum?.curriculum_items?.map(
                (item: any, index: number) => {
                  const isCompleted =
                    item.completed_items && item.completed_items.length > 0;
                  const itemKey = `${enrollment.id}-${item.id}`;
                  const isExpanded = expandedItem === itemKey;
                  const note = item.learning_notes?.[0];

                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border bg-card"
                    >
                      {/* Item header - always visible */}
                      <div
                        className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-accent/5 transition-colors ${
                          isExpanded ? "border-b" : ""
                        }`}
                        onClick={() =>
                          setExpandedItem(isExpanded ? null : itemKey)
                        }
                      >
                        <Checkbox
                          id={`item-${item.id}`}
                          checked={isCompleted}
                          onCheckedChange={(checked) => {
                            handleToggleCompletion(
                              enrollment.id,
                              item.id,
                              checked as boolean
                            );
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
                          {!isExpanded && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                              <FileEdit className="h-4 w-4" />
                              <span>학습 노트 작성하기</span>
                              <ChevronDown className="h-4 w-4 ml-auto" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expanded content - article info + note editor */}
                      {isExpanded && (
                        <div className="p-4 space-y-6">
                          {/* Article info */}
                          <div className="space-y-4">
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
                          </div>

                          {/* Note editor - full width on mobile */}
                          <div className="border-t pt-6">
                            <NoteEditor
                              enrollmentId={enrollment.id}
                              curriculumItemId={item.id}
                              initialContent={note?.content || ""}
                            />
                          </div>

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
                }
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
