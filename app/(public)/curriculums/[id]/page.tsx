import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, BookOpen, ExternalLink } from "lucide-react";
import { EnrollButton } from "@/components/curriculum/enroll-button";
import { notFound } from "next/navigation";
import Image from "next/image";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

const difficultyLabels = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

export default async function CurriculumDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch curriculum details
  const { data: curriculum, error: curriculumError } = await supabase
    .from("curriculums")
    .select("*")
    .eq("id", id)
    .single();

  if (curriculumError || !curriculum) {
    notFound();
  }

  // Fetch curriculum items with articles
  const { data: items, error: itemsError } = await supabase
    .from("curriculum_items")
    .select(`
      *,
      article:articles(*)
    `)
    .eq("curriculum_id", id)
    .order("sequence", { ascending: true });

  if (itemsError) {
    console.error("Error fetching curriculum items:", itemsError);
  }

  // Check if user is enrolled
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isEnrolled = false;
  if (user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("curriculum_id", id)
      .single();

    isEnrolled = !!enrollment;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold">{curriculum.title}</h1>
          <Badge
            className={difficultyColors[curriculum.difficulty as keyof typeof difficultyColors]}
            variant="secondary"
          >
            {difficultyLabels[curriculum.difficulty as keyof typeof difficultyLabels]}
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground mb-6">
          {curriculum.description}
        </p>

        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>{items?.length || 0}개 아티클</span>
          </div>
          {curriculum.estimated_hours && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>약 {curriculum.estimated_hours}시간</span>
            </div>
          )}
        </div>

        <EnrollButton
          curriculumId={id}
          isEnrolled={isEnrolled}
          isLoggedIn={!!user}
        />
      </div>

      <Separator className="my-8" />

      <div>
        <h2 className="text-2xl font-bold mb-6">학습 내용</h2>
        <div className="space-y-4">
          {items?.map((item: any, index: number) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-start justify-between gap-2 mb-2">
                      <span>{item.article?.title}</span>
                      <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    </CardTitle>
                    {item.article?.description && (
                      <CardDescription className="mb-3">
                        {item.article.description}
                      </CardDescription>
                    )}
                    {item.curator_note && (
                      <div className="mt-3 p-3 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground">
                          💡 <span className="font-medium">큐레이터 노트:</span>{" "}
                          {item.curator_note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              {item.article?.author && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    by {item.article.author}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {(!items || items.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              이 커리큘럼에는 아직 아티클이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
