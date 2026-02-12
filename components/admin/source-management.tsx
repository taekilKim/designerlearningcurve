"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { toast } from "sonner";
import {
  createArticleSourceAction,
  deleteArticleSourceAction,
  previewArticleSourceAction,
  updateArticleSourceAction,
} from "./actions";
import { Trash2 } from "lucide-react";

interface Source {
  id: string;
  name: string;
  url: string;
  category: string;
  is_active: boolean;
  source_type: string;
  created_at: string;
}

interface SourceManagementProps {
  initialSources: Source[];
}

interface PreviewData {
  feedTitle: string;
  feedDescription: string;
  detectedType: "rss" | "atom" | "unknown";
  sampleItems: string[];
}

export function SourceManagement({ initialSources }: SourceManagementProps) {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [form, setForm] = useState({
    name: "",
    url: "",
    category: "프로덕트 디자인",
  });

  const handlePreview = async () => {
    if (!form.url.trim()) {
      toast.error("URL을 입력해주세요.");
      return;
    }

    setPreviewLoading(true);
    try {
      const result = await previewArticleSourceAction(form.url.trim());
      if (!result.success || !result.data) {
        toast.error(result.error || "메타데이터를 불러오지 못했습니다.");
        return;
      }
      setPreview(result.data);
      if (!form.name.trim() && result.data.feedTitle) {
        setForm((prev) => ({ ...prev, name: result.data.feedTitle.trim() }));
      }
      toast.success("소스 메타데이터를 확인했습니다.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.url.trim()) {
      toast.error("이름과 URL을 입력해주세요.");
      return;
    }

    const result = await createArticleSourceAction({
      name: form.name.trim(),
      url: form.url.trim(),
      category: form.category.trim() || "프로덕트 디자인",
      is_active: true,
    });

    if (!result.success) {
      toast.error(result.error || "소스 추가에 실패했습니다.");
      return;
    }

    if ("source" in result && result.source) {
      setSources((prev) => [result.source, ...prev]);
    }
    setForm({ name: "", url: "", category: "프로덕트 디자인" });
    setPreview(null);
    toast.success("소스가 추가되었습니다.");
  };

  const handleToggleActive = async (source: Source) => {
    setLoadingId(source.id);
    try {
      const next = !source.is_active;
      const result = await updateArticleSourceAction(source.id, { is_active: next });
      if (!result.success) {
        toast.error(result.error || "활성 상태 변경에 실패했습니다.");
        return;
      }
      setSources((prev) =>
        prev.map((item) =>
          item.id === source.id ? { ...item, is_active: next } : item
        )
      );
      toast.success(next ? "소스가 활성화되었습니다." : "소스가 비활성화되었습니다.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoadingId(deleteId);
    try {
      const result = await deleteArticleSourceAction(deleteId);
      if (!result.success) {
        toast.error(result.error || "소스 삭제에 실패했습니다.");
        return;
      }
      setSources((prev) => prev.filter((item) => item.id !== deleteId));
      toast.success("소스가 삭제되었습니다.");
    } finally {
      setDeleteId(null);
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4 space-y-3">
        <h2 className="text-lg font-semibold">새 수집 소스 추가</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            placeholder="소스 이름"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="카테고리 (예: UX 디자인)"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          />
          <Input
            placeholder="피드 URL (RSS/Atom)"
            value={form.url}
            onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview} disabled={previewLoading}>
            {previewLoading ? "확인 중..." : "메타데이터 확인"}
          </Button>
          <Button onClick={handleCreate}>소스 추가</Button>
        </div>

        {preview && (
          <div className="rounded-md bg-muted p-3 text-sm">
            <p><strong>피드 제목:</strong> {preview.feedTitle || "-"}</p>
            <p><strong>피드 타입:</strong> {preview.detectedType}</p>
            <p><strong>설명:</strong> {preview.feedDescription || "-"}</p>
            <p><strong>샘플 아티클:</strong></p>
            <ul className="list-disc pl-5">
              {preview.sampleItems.length > 0 ? (
                preview.sampleItems.map((title) => <li key={title}>{title}</li>)
              ) : (
                <li>샘플 아티클을 찾지 못했습니다.</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>활성</TableHead>
              <TableHead>타입</TableHead>
              <TableHead className="w-[80px]">삭제</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  등록된 소스가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              sources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell>{source.name}</TableCell>
                  <TableCell className="max-w-[420px] truncate">{source.url}</TableCell>
                  <TableCell>{source.category}</TableCell>
                  <TableCell>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={source.is_active}
                      disabled={loadingId === source.id}
                      onClick={() => handleToggleActive(source)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        source.is_active ? "bg-primary" : "bg-muted-foreground/40"
                      } ${loadingId === source.id ? "opacity-50" : ""}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          source.is_active ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </TableCell>
                  <TableCell>{source.source_type}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(source.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>소스를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              삭제하면 다음 수집부터 이 URL은 사용되지 않습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!loadingId}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={!!loadingId}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
