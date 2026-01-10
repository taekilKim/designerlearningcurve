import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, BookOpen } from "lucide-react";

export const dynamic = 'force-dynamic';

interface Curriculum {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_hours: number;
  created_at: string;
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

export default async function CurriculumsPage() {
  const supabase = await createClient();

  const { data: curriculums, error } = await supabase
    .from("curriculums")
    .select(`
      *,
      curriculum_items(count)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching curriculums:", error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">커리큘럼</h1>
        <p className="text-lg text-muted-foreground">
          체계적으로 구성된 학습 경로를 따라 디자인 역량을 키워보세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {curriculums?.map((curriculum: any) => (
          <Card key={curriculum.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-2">
                <CardTitle className="text-2xl">{curriculum.title}</CardTitle>
                <Badge
                  className={difficultyColors[curriculum.difficulty as keyof typeof difficultyColors]}
                  variant="secondary"
                >
                  {difficultyLabels[curriculum.difficulty as keyof typeof difficultyLabels]}
                </Badge>
              </div>
              <CardDescription className="text-base">
                {curriculum.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{curriculum.curriculum_items?.[0]?.count || 0}개 아티클</span>
                </div>
                {curriculum.estimated_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>약 {curriculum.estimated_hours}시간</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/curriculums/${curriculum.id}`} className="w-full">
                <Button className="w-full">자세히 보기</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!curriculums || curriculums.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            아직 등록된 커리큘럼이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
