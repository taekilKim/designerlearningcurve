import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "@/components/admin/article-form";

export default async function NewArticlePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("for_articles", true)
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">새 아티클 추가</h1>
        <p className="text-muted-foreground">
          새로운 아티클 정보를 입력하세요
        </p>
      </div>

      <ArticleForm mode="create" categories={categories || []} />
    </div>
  );
}
