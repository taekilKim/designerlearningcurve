import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LearningAccordion } from "@/components/learning/learning-accordion";

export const dynamic = 'force-dynamic';

export default async function MyLearningPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch user's enrollments with curriculum details
  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select(`
      *,
      curriculum:curriculums(
        *,
        curriculum_items(
          *,
          article:articles(*),
          completed_items(
            id,
            completed_at
          )
        )
      )
    `)
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("Error fetching enrollments:", error);
  }

  // Process enrollments to include completion data
  const processedEnrollments = enrollments?.map((enrollment: any) => {
    const items = enrollment.curriculum?.curriculum_items || [];

    // Sort items by sequence
    const sortedItems = [...items].sort((a, b) => a.sequence - b.sequence);

    // Calculate progress
    const totalItems = sortedItems.length;
    const completedItems = sortedItems.filter(
      (item: any) => item.completed_items && item.completed_items.length > 0
    ).length;

    const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    return {
      ...enrollment,
      curriculum: {
        ...enrollment.curriculum,
        curriculum_items: sortedItems,
      },
      stats: {
        totalItems,
        completedItems,
        progressPercentage,
      },
    };
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">내 학습</h1>
        <p className="text-lg text-muted-foreground">
          등록한 커리큘럼의 학습 진행 상황을 확인하고 계속 학습해보세요
        </p>
      </div>

      {processedEnrollments && processedEnrollments.length > 0 ? (
        <LearningAccordion enrollments={processedEnrollments} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            아직 등록한 커리큘럼이 없습니다.
          </p>
          <a
            href="/curriculums"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            커리큘럼 둘러보기
          </a>
        </div>
      )}
    </div>
  );
}
