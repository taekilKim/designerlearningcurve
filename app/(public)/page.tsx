import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArticleCard } from "@/components/home/article-card";
import { CategorySidebar } from "@/components/shared/category-sidebar";

export const dynamic = 'force-dynamic';

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  author: string;
  published_at: string;
  category?: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = await createClient();
  const { category } = await searchParams;

  let query = supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });

  // Filter by category if specified
  if (category) {
    query = query.eq("category", category);
  }

  const { data: articles, error } = await query;

  if (error) {
    console.error("Error fetching articles:", error);
  }

  return (
    <div className="w-full">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <CategorySidebar type="articles" />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">아티클 큐레이션</h1>
              <p className="text-muted-foreground">
                디자이너를 위한 엄선된 아티클을 탐색해보세요
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles?.map((article: Article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {(!articles || articles.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {category
                    ? "이 카테고리에 아티클이 없습니다."
                    : "아직 등록된 아티클이 없습니다."}
                </p>
              </div>
            )}

            <div className="mt-16 text-center">
              <Link
                href="/curriculums"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
              >
                커리큘럼 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
