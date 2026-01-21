import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, Users } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch statistics
  const [
    { count: articlesCount },
    { count: curriculumsCount },
    { count: usersCount }
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("curriculums").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true })
  ]);

  const stats = [
    {
      title: "총 아티클",
      value: articlesCount || 0,
      icon: FileText,
      description: "등록된 아티클 수",
    },
    {
      title: "총 커리큘럼",
      value: curriculumsCount || 0,
      icon: BookOpen,
      description: "생성된 커리큘럼 수",
    },
    {
      title: "총 사용자",
      value: usersCount || 0,
      icon: Users,
      description: "등록된 사용자 수",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
        <p className="text-muted-foreground">
          디자이너 학습 플랫폼의 콘텐츠를 관리하세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">시작하기</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>아티클 관리</CardTitle>
              <CardDescription>
                새로운 아티클을 추가하거나 기존 아티클을 수정하세요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>커리큘럼 관리</CardTitle>
              <CardDescription>
                학습 경로를 생성하고 아티클을 연결하세요
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
