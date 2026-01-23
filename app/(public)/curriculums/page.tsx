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

  let query = supabase
    .from("curriculums")
    .select(`
      *,
      curriculum_items(count)
    `)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  // Filter by category if specified
  if (category) {
    query = query.eq("category", category);
  }

  const { data: curriculums, error } = await query;

  if (error) {
    console.error("Error fetching curriculums:", error);
  }

  return (
    <div className="w-full">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <CategorySidebar type="curriculums" />

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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
