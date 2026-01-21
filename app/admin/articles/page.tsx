import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ArticleList } from "@/components/admin/article-list";

export default async function ArticlesPage() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">아티클 관리</h1>
          <p className="text-muted-foreground">
            모든 아티클을 관리하고 새로운 아티클을 추가하세요
          </p>
        </div>
        <Link href="/admin/articles/new">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            새 아티클 추가
          </Button>
        </Link>
      </div>

      {articles && articles.length > 0 ? (
        <ArticleList articles={articles} />
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">
            아직 등록된 아티클이 없습니다.
          </p>
          <Link href="/admin/articles/new">
            <Button>첫 아티클 추가하기</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
