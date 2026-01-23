"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "./actions";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  label: string;
  icon: string;
  for_articles: boolean;
  for_curriculums: boolean;
  display_order: number;
}

interface CategoryManagementProps {
  initialCategories: Category[];
}

export function CategoryManagement({
  initialCategories,
}: CategoryManagementProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New category form state
  const [newCategory, setNewCategory] = useState({
    name: "",
    label: "",
    icon: "📁",
    forArticles: true,
    forCurriculums: true,
  });

  // Editing state
  const [editData, setEditData] = useState<Partial<Category>>({});

  const handleCreate = async () => {
    if (!newCategory.name || !newCategory.label) {
      toast.error("이름과 라벨을 모두 입력해주세요.");
      return;
    }

    const result = await createCategoryAction({
      name: newCategory.name,
      label: newCategory.label,
      icon: newCategory.icon,
      forArticles: newCategory.forArticles,
      forCurriculums: newCategory.forCurriculums,
    });

    if (result.success && result.category) {
      setCategories([...categories, result.category]);
      setIsCreateDialogOpen(false);
      setNewCategory({
        name: "",
        label: "",
        icon: "📁",
        forArticles: true,
        forCurriculums: true,
      });
      toast.success("카테고리가 생성되었습니다.");
    } else {
      toast.error(result.error || "카테고리 생성에 실패했습니다.");
    }
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditData({
      name: category.name,
      label: category.label,
      icon: category.icon,
      for_articles: category.for_articles,
      for_curriculums: category.for_curriculums,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async (id: string) => {
    const result = await updateCategoryAction(id, {
      name: editData.name,
      label: editData.label,
      icon: editData.icon,
      forArticles: editData.for_articles,
      forCurriculums: editData.for_curriculums,
    });

    if (result.success && result.category) {
      setCategories(
        categories.map((cat) => (cat.id === id ? result.category : cat))
      );
      setEditingId(null);
      setEditData({});
      toast.success("카테고리가 수정되었습니다.");
    } else {
      toast.error(result.error || "카테고리 수정에 실패했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteCategoryAction(id);

    if (result.success) {
      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success("카테고리가 삭제되었습니다.");
    } else {
      toast.error(result.error || "카테고리 삭제에 실패했습니다.");
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      {/* Create Button */}
      <div className="flex justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              새 카테고리 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 카테고리 추가</DialogTitle>
              <DialogDescription>
                아티클 및 커리큘럼에 사용할 새 카테고리를 만듭니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">영문 이름 (ID)</Label>
                <Input
                  id="name"
                  placeholder="ui-design"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">국문 이름</Label>
                <Input
                  id="label"
                  placeholder="UI 디자인"
                  value={newCategory.label}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, label: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">아이콘 (이모지)</Label>
                <Input
                  id="icon"
                  placeholder="🎨"
                  value={newCategory.icon}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, icon: e.target.value })
                  }
                />
              </div>
              <div className="space-y-3">
                <Label>사용 범위</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="for-articles"
                    checked={newCategory.forArticles}
                    onCheckedChange={(checked) =>
                      setNewCategory({
                        ...newCategory,
                        forArticles: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="for-articles" className="font-normal">
                    아티클 카테고리
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="for-curriculums"
                    checked={newCategory.forCurriculums}
                    onCheckedChange={(checked) =>
                      setNewCategory({
                        ...newCategory,
                        forCurriculums: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="for-curriculums" className="font-normal">
                    커리큘럼 카테고리
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleCreate}>생성</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">아이콘</TableHead>
              <TableHead>영문 이름 (ID)</TableHead>
              <TableHead>국문 이름</TableHead>
              <TableHead className="text-center">아티클</TableHead>
              <TableHead className="text-center">커리큘럼</TableHead>
              <TableHead className="w-[100px]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  등록된 카테고리가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => {
                const isEditing = editingId === category.id;
                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editData.icon || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, icon: e.target.value })
                          }
                          className="w-16"
                        />
                      ) : (
                        <span className="text-2xl">{category.icon}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editData.name || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                        />
                      ) : (
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {category.name}
                        </code>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editData.label || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, label: e.target.value })
                          }
                        />
                      ) : (
                        category.label
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {isEditing ? (
                        <Checkbox
                          checked={editData.for_articles}
                          onCheckedChange={(checked) =>
                            setEditData({
                              ...editData,
                              for_articles: checked as boolean,
                            })
                          }
                        />
                      ) : (
                        <Checkbox checked={category.for_articles} disabled />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {isEditing ? (
                        <Checkbox
                          checked={editData.for_curriculums}
                          onCheckedChange={(checked) =>
                            setEditData({
                              ...editData,
                              for_curriculums: checked as boolean,
                            })
                          }
                        />
                      ) : (
                        <Checkbox checked={category.for_curriculums} disabled />
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleSaveEdit(category.id)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            취소
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartEdit(category)}
                          >
                            수정
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteConfirm(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirm !== null}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>카테고리를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 카테고리를 사용 중인 아티클이나
              커리큘럼이 있으면 삭제할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
