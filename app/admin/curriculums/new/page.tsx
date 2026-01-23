import { createClient } from "@/lib/supabase/server";
import { CurriculumForm } from "@/components/admin/curriculum-form";

export default async function NewCurriculumPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("for_curriculums", true)
    .order("display_order", { ascending: true});

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">새 커리큘럼 추가</h1>
        <p className="text-muted-foreground">
          새로운 커리큘럼을 생성하고 아티클을 추가하세요
        </p>
      </div>

      <CurriculumForm mode="create" categories={categories || []} />
    </div>
  );
}
