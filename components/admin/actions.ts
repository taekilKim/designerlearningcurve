"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin";

// Article Actions

export async function createArticleAction(formData: {
  title: string;
  description?: string;
  url: string;
  thumbnail_url?: string;
  author?: string;
  published_at?: string;
}) {
  // Check admin status
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("articles").insert({
    title: formData.title,
    description: formData.description || null,
    url: formData.url,
    thumbnail_url: formData.thumbnail_url || null,
    author: formData.author || null,
    published_at: formData.published_at || null,
  });

  if (error) {
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
    title: string;
    description?: string;
    url: string;
    thumbnail_url?: string;
    author?: string;
    published_at?: string;
  }
) {
  // Check admin status
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("articles")
    .update({
      title: formData.title,
      description: formData.description || null,
      url: formData.url,
      thumbnail_url: formData.thumbnail_url || null,
      author: formData.author || null,
      published_at: formData.published_at || null,
    })
    .eq("id", id);

  if (error) {
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
    title: string;
    description?: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    estimated_hours?: number;
  }
) {
  // Check admin status
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: "권한이 없습니다." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("curriculums")
    .update({
      title: formData.title,
      description: formData.description || null,
      difficulty: formData.difficulty,
      estimated_hours: formData.estimated_hours || null,
    })
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
