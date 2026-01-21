import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "@/components/admin/article-form";
import { notFound } from "next/navigation";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">아티클 수정</h1>
        <p className="text-muted-foreground">
          아티클 정보를 수정하세요
        </p>
      </div>

      <ArticleForm article={article} mode="edit" />
    </div>
  );
}
