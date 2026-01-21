import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CurriculumList } from "@/components/admin/curriculum-list";

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">커리큘럼 관리</h1>
          <p className="text-muted-foreground">
            모든 커리큘럼을 관리하고 새로운 커리큘럼을 추가하세요
          </p>
        </div>
        <Link href="/admin/curriculums/new">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            새 커리큘럼 추가
          </Button>
        </Link>
      </div>

      {curriculums && curriculums.length > 0 ? (
        <CurriculumList curriculums={curriculums} />
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">
            아직 등록된 커리큘럼이 없습니다.
          </p>
          <Link href="/admin/curriculums/new">
            <Button>첫 커리큘럼 추가하기</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
