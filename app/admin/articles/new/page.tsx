import { ArticleForm } from "@/components/admin/article-form";

export default function NewArticlePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">새 아티클 추가</h1>
        <p className="text-muted-foreground">
          새로운 아티클 정보를 입력하세요
        </p>
      </div>

      <ArticleForm mode="create" />
    </div>
  );
}
