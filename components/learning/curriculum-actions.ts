"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateUserCurriculumInput {
  title: string;
  description?: string;
  articleIds: string[];
}

// Lets a learner plan their own short curriculum by picking articles in order.
// The creator is auto-enrolled so it immediately appears in "내 학습".
export async function createUserCurriculumAction(
  input: CreateUserCurriculumInput
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const title = input.title.trim();
  const description = input.description?.trim() || null;
  const articleIds = input.articleIds.filter(Boolean);

  if (!title) {
    return { success: false, error: "제목을 입력해주세요." };
  }
  if (articleIds.length === 0) {
    return { success: false, error: "아티클을 1개 이상 선택해주세요." };
  }

  try {
    // Create the curriculum owned by this user (private by default)
    const { data: curriculum, error: curriculumError } = await supabase
      .from("curriculums")
      .insert({
        title,
        description,
        creator_id: user.id,
        visibility: "private",
      })
      .select("id")
      .single();

    if (curriculumError || !curriculum) {
      console.error("Error creating curriculum:", curriculumError);
      return { success: false, error: curriculumError?.message ?? "생성 실패" };
    }

    // Add the selected articles as ordered items
    const items = articleIds.map((articleId, index) => ({
      curriculum_id: curriculum.id,
      article_id: articleId,
      sequence: index + 1,
    }));

    const { error: itemsError } = await supabase
      .from("curriculum_items")
      .insert(items);

    if (itemsError) {
      console.error("Error adding curriculum items:", itemsError);
      // Roll back the curriculum so we don't leave an empty shell
      await supabase.from("curriculums").delete().eq("id", curriculum.id);
      return { success: false, error: itemsError.message };
    }

    // Auto-enroll the creator
    const { error: enrollError } = await supabase.from("enrollments").insert({
      user_id: user.id,
      curriculum_id: curriculum.id,
    });

    if (enrollError) {
      console.error("Error auto-enrolling creator:", enrollError);
      // Items/curriculum still exist; surface the error but keep curriculum
      return { success: false, error: enrollError.message };
    }

    revalidatePath("/my-learning");
    return { success: true, curriculumId: curriculum.id };
  } catch (error) {
    console.error("Error creating user curriculum:", error);
    return { success: false, error: "Unknown error" };
  }
}
