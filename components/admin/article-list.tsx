"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { deleteArticleAction, updateArticleAction } from "./actions";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail_url: string | null;
  author: string | null;
  published_at: string | null;
  category: string | null;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  label: string;
  icon: string;
}

interface ArticleListProps {
  articles: Article[];
  categories: Category[];
}

export function ArticleList({ articles, categories }: ArticleListProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState<string | null>(null);

  const handleCategoryChange = async (articleId: string, newCategory: string) => {
    setUpdatingCategory(articleId);
    try {
      const result = await updateArticleAction(articleId, {
        category: newCategory,
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
      setUpdatingCategory(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteArticleAction(id);
      if (result.success) {
        toast.success("아티클이 삭제되었습니다.");
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

  const handleRowClick = (articleId: string, e: React.MouseEvent) => {
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
    router.push(`/admin/articles/${articleId}/edit`);
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">제목</TableHead>
              <TableHead className="w-[150px]">작성자</TableHead>
              <TableHead className="w-[180px]">카테고리</TableHead>
              <TableHead className="w-[180px]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  등록된 아티클이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow
                  key={article.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={(e) => handleRowClick(article.id, e)}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium line-clamp-1">
                        {article.title}
                      </div>
                      {article.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {article.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {article.author || "-"}
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={article.category || ""}
                      onValueChange={(value) => handleCategoryChange(article.id, value)}
                      disabled={updatingCategory === article.id}
                    >
                      <SelectTrigger className="select-trigger w-[160px]">
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">없음</SelectItem>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link href={`/admin/articles/${article.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(article.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
            <AlertDialogTitle>아티클을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 아티클이 포함된 커리큘럼에서도 제거됩니다.
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
