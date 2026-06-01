export interface LearningCompletion {
  id: string;
  completed_at: string;
}

export interface LearningArticleSummary {
  id: string;
  title: string;
  description: string | null;
  url: string;
  author: string | null;
}

export interface LearningCurriculumItem {
  id: string;
  sequence: number;
  curator_note: string | null;
  article: LearningArticleSummary | null;
  completed_items: LearningCompletion[];
}

export interface LearningNote {
  id: string;
  content: string | null;
  updated_at: string;
}

export interface LearningCurriculum {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url?: string | null;
  creator_id?: string | null;
  curriculum_items: LearningCurriculumItem[];
}

export interface EnrollmentStats {
  totalItems: number;
  completedItems: number;
  progressPercentage: number;
}

export interface LearningEnrollment {
  id: string;
  curriculum_id: string;
  completed_at: string | null;
  curriculum: LearningCurriculum;
  learning_notes: LearningNote[];
  stats: EnrollmentStats;
}

export type RawLearningEnrollment = Omit<LearningEnrollment, "stats">;

export function isCurriculumItemCompleted(
  item: Pick<LearningCurriculumItem, "completed_items">
): boolean {
  return item.completed_items.length > 0;
}

export function sortCurriculumItems(
  items: LearningCurriculumItem[]
): LearningCurriculumItem[] {
  return [...items].sort((a, b) => a.sequence - b.sequence);
}

export function buildEnrollmentStats(
  items: LearningCurriculumItem[]
): EnrollmentStats {
  const totalItems = items.length;
  const completedItems = items.filter(isCurriculumItemCompleted).length;

  return {
    totalItems,
    completedItems,
    progressPercentage: totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
  };
}

export function hydrateEnrollment(
  enrollment: RawLearningEnrollment
): LearningEnrollment {
  const sortedItems = sortCurriculumItems(enrollment.curriculum.curriculum_items);

  return {
    ...enrollment,
    curriculum: {
      ...enrollment.curriculum,
      curriculum_items: sortedItems,
    },
    stats: buildEnrollmentStats(sortedItems),
  };
}
