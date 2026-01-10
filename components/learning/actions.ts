"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleCompletionAction(
  enrollmentId: string,
  curriculumItemId: string,
  isCompleted: boolean
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    if (isCompleted) {
      // Add completion record
      const { error } = await supabase.from("completed_items").insert({
        enrollment_id: enrollmentId,
        curriculum_item_id: curriculumItemId,
      });

      if (error) {
        console.error("Error adding completion:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Remove completion record
      const { error } = await supabase
        .from("completed_items")
        .delete()
        .eq("enrollment_id", enrollmentId)
        .eq("curriculum_item_id", curriculumItemId);

      if (error) {
        console.error("Error removing completion:", error);
        return { success: false, error: error.message };
      }
    }

    revalidatePath("/my-learning");
    return { success: true };
  } catch (error) {
    console.error("Error toggling completion:", error);
    return { success: false, error: "Unknown error" };
  }
}
