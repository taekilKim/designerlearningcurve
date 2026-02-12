import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { SourceManagement } from "@/components/admin/source-management";

export default async function SourcesPage() {
  const adminStatus = await isAdmin();
  if (!adminStatus) redirect("/");

  const supabase = await createClient();
  const { data: sources } = await supabase
    .from("article_sources")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">수집 소스 관리</h1>
        <p className="text-muted-foreground mt-2">
          아티클 수집에 사용하는 RSS/Atom 소스를 추가, 삭제, 활성화할 수 있습니다.
        </p>
      </div>

      <SourceManagement initialSources={sources || []} />
    </div>
  );
}
