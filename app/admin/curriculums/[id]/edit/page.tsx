import { createClient } from "@/lib/supabase/server";
import { CurriculumForm } from "@/components/admin/curriculum-form";
import { CurriculumItemsManager } from "@/components/admin/curriculum-items-manager";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";

interface EditCurriculumPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCurriculumPage({
  params,
}: EditCurriculumPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch curriculum
  const { data: curriculum, error: curriculumError } = await supabase
    .from("curriculums")
    .select("*")
    .eq("id", id)
    .single();

  if (curriculumError || !curriculum) {
    notFound();
  }

  // Fetch curriculum items with article details
  const { data: curriculumItems, error: itemsError } = await supabase
    .from("curriculum_items")
    .select(
      `
      *,
      articles (
        id,
        title,
        description,
        url,
        author
      )
    `
    )
    .eq("curriculum_id", id)
    .order("sequence", { ascending: true });

  // Fetch all articles for adding new items
  const { data: allArticles, error: articlesError } = await supabase
    .from("articles")
    .select("id, title, author")
    .order("title", { ascending: true });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">커리큘럼 수정</h1>
        <p className="text-muted-foreground">
          커리큘럼 정보를 수정하고 아티클을 관리하세요
        </p>
      </div>

      <div className="space-y-8">
        <CurriculumForm curriculum={curriculum} mode="edit" />

        <Separator />

        <CurriculumItemsManager
          curriculumId={id}
          curriculumItems={curriculumItems || []}
          allArticles={allArticles || []}
        />
      </div>
    </div>
  );
}
