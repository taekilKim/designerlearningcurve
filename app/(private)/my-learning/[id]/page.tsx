import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ArticleList } from "@/components/learning/article-list";
import { NoteEditor } from "@/components/learning/note-editor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CurriculumDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch enrollment with curriculum details
  const { data: enrollment, error } = await supabase
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
    .eq("curriculum_id", id)
    .single();

  if (error || !enrollment) {
    console.error("Error fetching enrollment:", error);
    notFound();
  }

  // Handle learning_notes - can be array or object depending on query
  const learningNotesContent = Array.isArray(enrollment.learning_notes)
    ? enrollment.learning_notes?.[0]?.content || ""
    : enrollment.learning_notes?.content || "";

  console.log('[Curriculum Detail] Enrollment data:', {
    enrollmentId: enrollment.id,
    curriculumId: enrollment.curriculum_id,
    learningNotes: enrollment.learning_notes,
    isArray: Array.isArray(enrollment.learning_notes),
    initialContent: learningNotesContent
  });

  // Sort curriculum items by sequence
  const sortedItems = [...(enrollment.curriculum?.curriculum_items || [])].sort(
    (a, b) => a.sequence - b.sequence
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/my-learning"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            내 학습으로 돌아가기
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">
            {enrollment.curriculum?.title}
          </h1>
          {enrollment.curriculum?.description && (
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              {enrollment.curriculum.description}
            </p>
          )}
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="container mx-auto px-4 py-6 mb-20 md:mb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Articles */}
          <div className="lg:sticky lg:top-[180px] lg:self-start">
            <ArticleList
              enrollmentId={enrollment.id}
              items={sortedItems}
            />
          </div>

          {/* Right Column - Note Editor */}
          <div className="lg:sticky lg:top-[180px] lg:self-start">
            <div className="rounded-lg border bg-card p-6">
              <NoteEditor
                enrollmentId={enrollment.id}
                initialContent={learningNotesContent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
