import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  CurriculumBuilder,
  type BuilderArticle,
} from "@/components/learning/curriculum-builder";

export const dynamic = "force-dynamic";

export default async function CreateCurriculumPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Load published articles for the builder's search/pick list
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, author, category")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const builderArticles: BuilderArticle[] = (articles ?? []).map((a) => ({
    id: a.id,
    title: a.title,
    author: a.author,
    category: a.category,
  }));

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl mb-20 md:mb-0">
      <Link
        href="/my-learning"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        내 학습으로 돌아가기
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          나만의 커리큘럼 만들기
        </h1>
        <p className="text-base text-muted-foreground">
          관심 있는 아티클을 골라 순서대로 배치해 나만의 짧은 학습 코스를
          기획하세요.
        </p>
      </div>

      <CurriculumBuilder articles={builderArticles} />
    </div>
  );
}
