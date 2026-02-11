import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { CategoryManagement } from "@/components/admin/category-management";

export default async function CategoriesPage() {
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    redirect("/");
  }

  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">카테고리 관리</h1>
        <p className="text-muted-foreground mt-2">
          아티클 및 커리큘럼 카테고리를 관리합니다.
        </p>
      </div>

      <CategoryManagement initialCategories={categories || []} />
    </div>
  );
}
