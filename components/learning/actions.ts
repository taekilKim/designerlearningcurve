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

export async function saveNoteAction(
  enrollmentId: string,
  content: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Upsert note (insert or update)
    const { error } = await supabase
      .from("learning_notes")
      .upsert(
        {
          enrollment_id: enrollmentId,
          content,
        },
        {
          onConflict: "enrollment_id",
        }
      );

    if (error) {
      console.error("Error saving note:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving note:", error);
    return { success: false, error: "Unknown error" };
  }
}

export async function deleteNoteAction(
  enrollmentId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const { error } = await supabase
      .from("learning_notes")
      .delete()
      .eq("enrollment_id", enrollmentId);

    if (error) {
      console.error("Error deleting note:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/my-learning");
    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, error: "Unknown error" };
  }
}

export async function deleteEnrollmentAction(enrollmentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Delete enrollment (cascade will delete related completed_items and learning_notes)
    const { error } = await supabase
      .from("enrollments")
      .delete()
      .eq("id", enrollmentId)
      .eq("user_id", user.id); // Ensure user can only delete their own enrollments

    if (error) {
      console.error("Error deleting enrollment:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/my-learning");
    return { success: true };
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return { success: false, error: "Unknown error" };
  }
}
