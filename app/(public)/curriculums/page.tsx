import { createClient } from "@/lib/supabase/server";
import { CategorySidebar } from "@/components/shared/category-sidebar";
import { CurriculumListInfinite } from "@/components/curriculums/curriculum-list-infinite";

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 12;

export default async function CurriculumsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = await createClient();
  const { category } = await searchParams;

  // Build curriculum query
  let curriculumsQuery = supabase
    .from("curriculums")
    .select(`
      *,
      curriculum_items(count)
    `)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (category) {
    curriculumsQuery = curriculumsQuery.eq("category", category);
  }

  // Fetch curriculums and categories in parallel
  const [
    { data: curriculums, error: curriculumsError },
    { data: categories }
  ] = await Promise.all([
    curriculumsQuery,
    supabase
      .from("categories")
      .select("*")
      .eq("for_curriculums", true)
      .order("display_order", { ascending: true })
  ]);

  if (curriculumsError) {
    console.error("Error fetching curriculums:", curriculumsError);
  }

  return (
    <div className="w-full">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <CategorySidebar type="curriculums" categories={categories || []} />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">커리큘럼</h1>
              <p className="text-muted-foreground">
                체계적으로 구성된 학습 경로를 따라 디자인 역량을 키워보세요
              </p>
            </div>

            {/* Infinite Scroll Curriculum List */}
            <CurriculumListInfinite
              initialCurriculums={curriculums || []}
              category={category}
              categories={categories || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
