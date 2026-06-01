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

    // Sync enrollment completion status: mark as completed when every
    // curriculum item is done, otherwise clear the completion timestamp.
    const justCompleted = await syncEnrollmentCompletion(supabase, enrollmentId);

    revalidatePath("/my-learning");
    return { success: true, justCompleted };
  } catch (error) {
    console.error("Error toggling completion:", error);
    return { success: false, error: "Unknown error" };
  }
}

// Recalculates whether all curriculum items are completed and updates
// enrollments.completed_at accordingly. Returns true when the enrollment
// transitions from in-progress to completed (for celebration UX).
async function syncEnrollmentCompletion(
  supabase: Awaited<ReturnType<typeof createClient>>,
  enrollmentId: string
): Promise<boolean> {
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("curriculum_id, completed_at")
    .eq("id", enrollmentId)
    .single();

  if (!enrollment?.curriculum_id) {
    return false;
  }

  const [{ count: totalItems }, { count: completedCount }] = await Promise.all([
    supabase
      .from("curriculum_items")
      .select("id", { count: "exact", head: true })
      .eq("curriculum_id", enrollment.curriculum_id),
    supabase
      .from("completed_items")
      .select("id", { count: "exact", head: true })
      .eq("enrollment_id", enrollmentId),
  ]);

  const total = totalItems ?? 0;
  const completed = completedCount ?? 0;
  const isAllCompleted = total > 0 && completed >= total;
  const wasCompleted = Boolean(enrollment.completed_at);

  if (isAllCompleted && !wasCompleted) {
    await supabase
      .from("enrollments")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", enrollmentId);
    return true;
  }

  if (!isAllCompleted && wasCompleted) {
    await supabase
      .from("enrollments")
      .update({ completed_at: null })
      .eq("id", enrollmentId);
  }

  return false;
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
    // First get the curriculum_id from enrollment
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("curriculum_id")
      .eq("id", enrollmentId)
      .single();

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

    // Revalidate both the detail page and the my-learning page
    if (enrollment?.curriculum_id) {
      revalidatePath(`/my-learning/${enrollment.curriculum_id}`);
    }
    revalidatePath('/my-learning');

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
