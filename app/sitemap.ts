import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = "https://designpath.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // 커리큘럼 동적 페이지
  const { data: curriculums } = await supabase
    .from("curriculums")
    .select("id, updated_at");

  const curriculumEntries: MetadataRoute.Sitemap = (curriculums || []).map((c) => ({
    url: `${SITE_URL}/curriculums/${c.id}`,
    lastModified: c.updated_at || new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/curriculums`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...curriculumEntries,
  ];
}
