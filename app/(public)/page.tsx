import { createClient } from "@/lib/supabase/server";
import { CategorySidebar } from "@/components/shared/category-sidebar";
import { ArticleListInfinite } from "@/components/home/article-list-infinite";

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 12;

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = await createClient();
  const { category } = await searchParams;

  // Build article query
  let articlesQuery = supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (category) {
    articlesQuery = articlesQuery.eq("category", category);
  }

  // Fetch articles and categories in parallel
  const [
    { data: articles, error: articlesError },
    { data: categories }
  ] = await Promise.all([
    articlesQuery,
    supabase
      .from("categories")
      .select("*")
      .eq("for_articles", true)
      .order("display_order", { ascending: true })
  ]);

  if (articlesError) {
    console.error("Error fetching articles:", articlesError);
  }

  return (
    <div className="w-full">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <CategorySidebar type="articles" categories={categories || []} />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">아티클 큐레이션</h1>
              <p className="text-muted-foreground">
                디자이너를 위한 엄선된 아티클을 탐색해보세요
              </p>
            </div>

            {/* Infinite Scroll Article List */}
            <ArticleListInfinite
              initialArticles={articles || []}
              category={category}
              categories={categories || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
