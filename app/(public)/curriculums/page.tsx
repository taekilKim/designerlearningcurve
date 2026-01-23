import { createClient } from "@/lib/supabase/server";
import { CategorySidebar } from "@/components/shared/category-sidebar";
import { CurriculumCard } from "@/components/curriculums/curriculum-card";

export const dynamic = 'force-dynamic';

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
    .order("created_at", { ascending: false });

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

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curriculums?.map((curriculum: any) => (
                <CurriculumCard key={curriculum.id} curriculum={curriculum} />
              ))}
            </div>

            {(!curriculums || curriculums.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {category
                    ? "이 카테고리에 커리큘럼이 없습니다."
                    : "아직 등록된 커리큘럼이 없습니다."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
