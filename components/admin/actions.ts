"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin";
import * as cheerio from "cheerio";

// Metadata Extraction

export async function extractMetadataAction(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MetadataBot/1.0)",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP 오류: ${response.status}`,
      };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract og:image, og:title, og:description
    const ogImage =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="og:image"]').attr("content") ||
      $('meta[property="twitter:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    const ogTitle =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="og:title"]').attr("content") ||
      $("title").text() ||
      "";

    const ogDescription =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    const ogAuthor =
      $('meta[property="og:site_name"]').attr("content") ||
      $('meta[name="author"]').attr("content") ||
      "";

    return {
      success: true,
      data: {
        title: ogTitle.trim(),
        description: ogDescription.trim(),
        thumbnail_url: ogImage.trim(),
        author: ogAuthor.trim(),
      },
    };
  } catch (error) {
    console.error("Error extracting metadata:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "메타데이터 추출 실패",
    };
  }
}

// Bulk Metadata Update

export async function bulkUpdateArticlesMetadataAction() {
  // Check admin status
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  try {
    // Fetch all articles
    const { data: articles, error: fetchError } = await supabase
      .from("articles")
      .select("id, url, title, description, thumbnail_url, author");

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    if (!articles || articles.length === 0) {
      return { success: true, updated: 0, skipped: 0, failed: 0 };
    }

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    // Process each article
    for (const article of articles) {
      try {
        // Skip if article has no URL
        if (!article.url) {
          skipped++;
          continue;
        }

        // Extract metadata
        const metadataResult = await extractMetadataAction(article.url);

        if (!metadataResult.success || !metadataResult.data) {
          failed++;
          continue;
        }

        const { data: metadata } = metadataResult;

        // Prepare update data (only update empty fields)
        const updateData: any = {};

        if (!article.title && metadata.title) {
          updateData.title = metadata.title;
        }
        if (!article.description && metadata.description) {
          updateData.description = metadata.description;
        }
        if (!article.thumbnail_url && metadata.thumbnail_url) {
          updateData.thumbnail_url = metadata.thumbnail_url;
        }
        if (!article.author && metadata.author) {
          updateData.author = metadata.author;
        }

        // Skip if nothing to update
        if (Object.keys(updateData).length === 0) {
          skipped++;
          continue;
        }

        // Update article
        const { error: updateError } = await supabase
          .from("articles")
          .update(updateData)
          .eq("id", article.id);

        if (updateError) {
          console.error(`Failed to update article ${article.id}:`, updateError);
          failed++;
        } else {
          updated++;
        }

        // Add small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error processing article ${article.id}:`, error);
        failed++;
      }
    }

    revalidatePath("/admin/articles");
    revalidatePath("/");

    return {
      success: true,
      updated,
      skipped,
      failed,
      total: articles.length,
    };
  } catch (error) {
    console.error("Error in bulk update:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "일괄 업데이트 실패",
    };
  }
}

// Article Actions

export async function createArticleAction(formData: {
  title: string;
  description?: string;
  url: string;
  thumbnail_url?: string;
  author?: string;
  published_at?: string;
  category?: string | null;
}) {
  // Check admin status
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();
  const normalizedUrl = normalizeArticleUrl(formData.url);

  const { data: existingArticle } = await supabase
    .from("articles")
    .select("id")
    .eq("url", normalizedUrl)
    .maybeSingle();

  if (existingArticle) {
    return {
      success: false,
      error: "이미 수집된 아티클입니다. 중복 URL은 저장할 수 없습니다.",
    };
  }

  const { error } = await supabase.from("articles").insert({
    title: formData.title,
    description: formData.description || null,
    url: normalizedUrl,
    thumbnail_url: formData.thumbnail_url || null,
    author: formData.author || null,
    published_at: formData.published_at || null,
    category: formData.category || null,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "이미 수집된 아티클입니다. 중복 URL은 저장할 수 없습니다.",
      };
    }
    console.error("Error creating article:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/");
  return { success: true };
}

export async function updateArticleAction(
  id: string,
  formData: {
    title?: string;
    description?: string;
    url?: string;
    thumbnail_url?: string;
    author?: string;
    published_at?: string;
    category?: string | null;
  }
) {
  // Check admin status
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();
  const normalizedUrl = normalizeArticleUrl(formData.url);

  const { data: existingArticle } = await supabase
    .from("articles")
    .select("id")
    .eq("url", normalizedUrl)
    .neq("id", id)
    .maybeSingle();

  if (existingArticle) {
    return {
      success: false,
      error: "이미 수집된 아티클입니다. 중복 URL은 저장할 수 없습니다.",
    };
  }

  // Build update object with only provided fields
  const updateData: any = {};
  if (formData.title !== undefined) updateData.title = formData.title;
  if (formData.description !== undefined) updateData.description = formData.description || null;
  if (formData.url !== undefined) updateData.url = formData.url;
  if (formData.thumbnail_url !== undefined) updateData.thumbnail_url = formData.thumbnail_url || null;
  if (formData.author !== undefined) updateData.author = formData.author || null;
  if (formData.published_at !== undefined) updateData.published_at = formData.published_at || null;
  if (formData.category !== undefined) updateData.category = formData.category || null;

  const { error } = await supabase
    .from("articles")
    .update(updateData)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "이미 수집된 아티클입니다. 중복 URL은 저장할 수 없습니다.",
      };
    }
    console.error("Error updating article:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${id}/edit`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteArticleAction(id: string) {
  // Check admin status
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    console.error("Error deleting article:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/");
  return { success: true };
}

// Curriculum Actions

export async function createCurriculumAction(formData: {
  title: string;
  description?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_hours?: number;
  category?: string | null;
}) {
  // Check admin status
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("curriculums")
    .insert({
      title: formData.title,
      description: formData.description || null,
      difficulty: formData.difficulty,
      estimated_hours: formData.estimated_hours || null,
      category: formData.category || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating curriculum:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/curriculums");
  revalidatePath("/curriculums");
  return { success: true, data };
}

export async function updateCurriculumAction(
  id: string,
  formData: {
    title?: string;
    description?: string;
    difficulty?: "beginner" | "intermediate" | "advanced";
    estimated_hours?: number;
    category?: string | null;
  }
) {
  // Check admin status
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  // Build update object with only provided fields
  const updateData: any = {};
  if (formData.title !== undefined) updateData.title = formData.title;
  if (formData.description !== undefined) updateData.description = formData.description || null;
  if (formData.difficulty !== undefined) updateData.difficulty = formData.difficulty;
  if (formData.estimated_hours !== undefined) updateData.estimated_hours = formData.estimated_hours || null;
  if (formData.category !== undefined) updateData.category = formData.category || null;

  const { error } = await supabase
    .from("curriculums")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating curriculum:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/curriculums");
  revalidatePath(`/admin/curriculums/${id}/edit`);
  revalidatePath("/curriculums");
  revalidatePath(`/curriculums/${id}`);
  return { success: true };
}

export async function deleteCurriculumAction(id: string) {
  // Check admin status
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("curriculums").delete().eq("id", id);

  if (error) {
    console.error("Error deleting curriculum:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/curriculums");
  revalidatePath("/curriculums");
  return { success: true };
}

// Curriculum Items Actions

export async function addCurriculumItemAction(
  curriculumId: string,
  articleId: string,
  sequence: number,
  curatorNote?: string
) {
  // Check admin status
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("curriculum_items").insert({
    curriculum_id: curriculumId,
    article_id: articleId,
    sequence,
    curator_note: curatorNote || null,
  });

  if (error) {
    console.error("Error adding curriculum item:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/curriculums/${curriculumId}/edit`);
  revalidatePath(`/curriculums/${curriculumId}`);
  return { success: true };
}

export async function updateCurriculumItemAction(
  itemId: string,
  curriculumId: string,
  data: {
    sequence?: number;
    curator_note?: string;
  }
) {
  // Check admin status
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("curriculum_items")
    .update(data)
    .eq("id", itemId);

  if (error) {
    console.error("Error updating curriculum item:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/curriculums/${curriculumId}/edit`);
  revalidatePath(`/curriculums/${curriculumId}`);
  return { success: true };
}

export async function deleteCurriculumItemAction(
  itemId: string,
  curriculumId: string
) {
  // Check admin status
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("curriculum_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("Error deleting curriculum item:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/curriculums/${curriculumId}/edit`);
  revalidatePath(`/curriculums/${curriculumId}`);
  return { success: true };
}

// Public Actions - Load More Articles

export async function loadMoreArticlesAction(
  page: number,
  pageSize: number = 12,
  category?: string
) {
  const supabase = await createClient();
  const offset = page * pageSize;

  let query = supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (category) {
    query = query.eq("category", category);
  }

  const { data: articles, error } = await query;

  if (error) {
    console.error("Error loading more articles:", error);
    return { success: false, error: error.message, articles: [] };
  }

  return { success: true, articles: articles || [] };
}

export async function loadMoreCurriculumsAction(
  page: number,
  pageSize: number = 12,
  category?: string
) {
  const supabase = await createClient();
  const offset = page * pageSize;

  let query = supabase
    .from("curriculums")
    .select(`
      *,
      curriculum_items(count)
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (category) {
    query = query.eq("category", category);
  }

  const { data: curriculums, error } = await query;

  if (error) {
    console.error("Error loading more curriculums:", error);
    return { success: false, error: error.message, curriculums: [] };
  }

  return { success: true, curriculums: curriculums || [] };
}

// Category Management

export async function getCategoriesAction(filter?: {
  forArticles?: boolean;
  forCurriculums?: boolean;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (filter?.forArticles !== undefined) {
    query = query.eq("for_articles", filter.forArticles);
  }

  if (filter?.forCurriculums !== undefined) {
    query = query.eq("for_curriculums", filter.forCurriculums);
  }

  const { data: categories, error } = await query;

  if (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: error.message, categories: [] };
  }

  return { success: true, categories: categories || [] };
}

export async function createCategoryAction(data: {
  name: string;
  label: string;
  icon: string;
  forArticles: boolean;
  forCurriculums: boolean;
}) {
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  // Get max display_order
  const { data: maxOrder } = await supabase
    .from("categories")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const displayOrder = (maxOrder?.display_order || 0) + 1;

  const { data: category, error } = await supabase
    .from("categories")
    .insert({
      name: data.name,
      label: data.label,
      icon: data.icon,
      for_articles: data.forArticles,
      for_curriculums: data.forCurriculums,
      display_order: displayOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/curriculums");

  return { success: true, category };
}

export async function updateCategoryAction(
  id: string,
  data: {
    name?: string;
    label?: string;
    icon?: string;
    forArticles?: boolean;
    forCurriculums?: boolean;
  }
) {
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.label !== undefined) updateData.label = data.label;
  if (data.icon !== undefined) updateData.icon = data.icon;
  if (data.forArticles !== undefined)
    updateData.for_articles = data.forArticles;
  if (data.forCurriculums !== undefined)
    updateData.for_curriculums = data.forCurriculums;

  const { data: category, error } = await supabase
    .from("categories")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/curriculums");

  return { success: true, category };
}

export async function deleteCategoryAction(id: string) {
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  // Check if category is in use
  const { data: articlesCount } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("category", id);

  const { data: curriculumsCount } = await supabase
    .from("curriculums")
    .select("id", { count: "exact", head: true })
    .eq("category", id);

  if (
    (articlesCount && articlesCount.length > 0) ||
    (curriculumsCount && curriculumsCount.length > 0)
  ) {
    return {
      success: false,
      error: "이 카테고리를 사용 중인 아티클 또는 커리큘럼이 있습니다.",
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/curriculums");

  return { success: true };
}

export async function reorderCategoriesAction(categoryIds: string[]) {
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  // Update display_order for each category
  const updates = categoryIds.map((id, index) =>
    supabase
      .from("categories")
      .update({ display_order: index + 1 })
      .eq("id", id)
  );

  const results = await Promise.all(updates);

  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    console.error("Error reordering categories:", errors);
    return { success: false, error: "카테고리 순서 변경에 실패했습니다." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/curriculums");

  return { success: true };
}
