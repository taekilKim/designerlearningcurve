"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Plus, Trash2, GripVertical, ExternalLink } from "lucide-react";
import {
  addCurriculumItemAction,
  deleteCurriculumItemAction,
  updateCurriculumItemAction,
} from "./actions";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  description?: string | null;
  url?: string;
  author?: string | null;
}

interface CurriculumItem {
  id: string;
  curriculum_id: string;
  article_id: string;
  sequence: number;
  curator_note: string | null;
  articles: Article;
}

interface CurriculumItemsManagerProps {
  curriculumId: string;
  curriculumItems: CurriculumItem[];
  allArticles: { id: string; title: string; author: string | null }[];
}

export function CurriculumItemsManager({
  curriculumId,
  curriculumItems: initialItems,
  allArticles,
}: CurriculumItemsManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [selectedArticleId, setSelectedArticleId] = useState<string>("");
  const [curatorNote, setCuratorNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState("");

  // Filter out already added articles
  const availableArticles = allArticles.filter(
    (article) => !items.some((item) => item.article_id === article.id)
  );

  const handleAddItem = async () => {
    if (!selectedArticleId) {
      toast.error("아티클을 선택해주세요.");
      return;
    }

    setIsAdding(true);
    try {
      const nextSequence = items.length + 1;
      const result = await addCurriculumItemAction(
        curriculumId,
        selectedArticleId,
        nextSequence,
        curatorNote
      );

      if (result.success) {
        toast.success("아티클이 추가되었습니다.");
        setSelectedArticleId("");
        setCuratorNote("");
        // Refresh page to get updated items
        window.location.reload();
      } else {
        toast.error(result.error || "추가 중 오류가 발생했습니다.");
      }
    } catch {
      toast.error("추가 중 오류가 발생했습니다.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteCurriculumItemAction(itemId, curriculumId);

      if (result.success) {
        toast.success("아티클이 제거되었습니다.");
        setDeleteId(null);
        // Refresh page to get updated items
        window.location.reload();
      } else {
        toast.error(result.error || "제거 중 오류가 발생했습니다.");
      }
    } catch {
      toast.error("제거 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateNote = async (itemId: string) => {
    try {
      const result = await updateCurriculumItemAction(itemId, curriculumId, {
        curator_note: editingNote,
      });

      if (result.success) {
        toast.success("큐레이터 노트가 수정되었습니다.");
        setEditingNoteId(null);
        // Update local state
        setItems(
          items.map((item) =>
            item.id === itemId ? { ...item, curator_note: editingNote } : item
          )
        );
      } else {
        toast.error(result.error || "수정 중 오류가 발생했습니다.");
      }
    } catch {
      toast.error("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">커리큘럼 아티클 관리</h2>

      {/* Add new article */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>아티클 추가</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>아티클 선택</Label>
            <Select value={selectedArticleId} onValueChange={setSelectedArticleId}>
              <SelectTrigger>
                <SelectValue placeholder="아티클을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {availableArticles.map((article) => (
                  <SelectItem key={article.id} value={article.id}>
                    {article.title}
                    {article.author && ` - by ${article.author}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableArticles.length === 0 && (
              <p className="text-sm text-muted-foreground">
                모든 아티클이 이미 추가되었습니다.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>큐레이터 노트 (선택사항)</Label>
            <Textarea
              value={curatorNote}
              onChange={(e) => setCuratorNote(e.target.value)}
              placeholder="이 아티클에 대한 학습 가이드나 팁을 작성하세요"
              rows={3}
            />
          </div>

          <Button
            onClick={handleAddItem}
            disabled={!selectedArticleId || isAdding}
          >
            <Plus className="mr-2 h-4 w-4" />
            {isAdding ? "추가 중..." : "아티클 추가"}
          </Button>
        </CardContent>
      </Card>

      {/* List of curriculum items */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          커리큘럼 아티클 ({items.length}개)
        </h3>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              아직 추가된 아티클이 없습니다.
            </CardContent>
          </Card>
        ) : (
          items.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {item.articles.title}
                        </h4>
                        {item.articles.author && (
                          <p className="text-sm text-muted-foreground">
                            by {item.articles.author}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {item.articles.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={item.articles.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteId(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4">
                      {editingNoteId === item.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editingNote}
                            onChange={(e) => setEditingNote(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateNote(item.id)}
                            >
                              저장
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingNoteId(null)}
                            >
                              취소
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>큐레이터 노트</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingNoteId(item.id);
                                setEditingNote(item.curator_note || "");
                              }}
                            >
                              수정
                            </Button>
                          </div>
                          {item.curator_note ? (
                            <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                              {item.curator_note}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              큐레이터 노트가 없습니다.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>아티클을 제거하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              커리큘럼에서 이 아티클이 제거됩니다. 아티클 자체는 삭제되지 않습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDeleteItem(deleteId)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "제거 중..." : "제거"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
