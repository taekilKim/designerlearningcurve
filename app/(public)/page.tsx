import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CategorySidebar } from "@/components/shared/category-sidebar";
import { ArticleListInfinite } from "@/components/home/article-list-infinite";
import { buildMixedArticleFeed } from "@/lib/article-feed";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "아티클 큐레이션",
  description: "UX/UI 디자이너를 위한 엄선된 국내 디자인 아티클을 카테고리별로 탐색해보세요.",
  openGraph: {
    title: "아티클 큐레이션 | Designer Learning Curve",
    description: "UX/UI 디자이너를 위한 엄선된 국내 디자인 아티클을 카테고리별로 탐색해보세요.",
  },
};

const PAGE_SIZE = 12;
const MAX_FEED_CANDIDATES = 500;

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
    .order("created_at", { ascending: false })
    .limit(MAX_FEED_CANDIDATES);

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Designer Learning Curve",
    url: "https://designpath.vercel.app",
    description: "UX/UI 디자이너를 위한 엄선된 국내 디자인 아티클을 카테고리별로 탐색해보세요.",
  };
  const initialArticles = buildMixedArticleFeed(articles || []).slice(0, PAGE_SIZE);

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              initialArticles={initialArticles}
              category={category}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
