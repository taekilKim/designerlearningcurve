import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EnrollmentCard } from "@/components/learning/enrollment-card";
import Link from "next/link";
import {
  hydrateEnrollment,
  type LearningEnrollment,
  type RawLearningEnrollment,
} from "@/lib/learning";

export const dynamic = 'force-dynamic';

export default async function MyLearningPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch user's enrollments with curriculum details and learning notes
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
      ),
      learning_notes(
        id,
        content,
        updated_at
      )
    `)
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("Error fetching enrollments:", error);
  }

  // Process enrollments to include completion data
  const processedEnrollments: LearningEnrollment[] = (enrollments ?? []).map(
    (enrollment) => hydrateEnrollment(enrollment as RawLearningEnrollment)
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl mb-20 md:mb-0">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">내 학습</h1>
        <p className="text-base md:text-lg text-muted-foreground">
          등록한 커리큘럼의 학습 진행 상황을 확인하고 학습노트를 작성해보세요
        </p>
      </div>

      {processedEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedEnrollments.map((enrollment) => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            아직 등록한 커리큘럼이 없습니다.
          </p>
          <Link
            href="/curriculums"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            커리큘럼 둘러보기
          </Link>
        </div>
      )}
    </div>
  );
}
