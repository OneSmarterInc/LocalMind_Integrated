import type { ModuleItem } from "./types/module";
import type { CourseModule } from "../../context/CourseContext";

export function toFriendModule(module: CourseModule): ModuleItem {
  return {
    id: module.id,
    code: module.code ?? "MODULE",
    title: module.title,
    description: module.description ?? "Learning content generated from the selected textbook.",
    duration: module.duration ?? 5,
    category: module.category ?? "Basics",
    difficulty: module.difficulty ?? "Beginner",
    status: module.status ?? "NOT_STARTED",
    icon: module.icon ?? "book-open-page-variant-outline",
    progress: module.progress ?? 0,
    activities: module.activities,
  };
}

export function findCourseModule(chapters: { modules: CourseModule[] }[], moduleId?: string) {
  if (!moduleId) return null;
  for (const chapter of chapters) {
    const found = chapter.modules.find((module) => module.id === moduleId);
    if (found) return found;
  }
  return null;
}
