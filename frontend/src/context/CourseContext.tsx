import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { modules as friendModules } from "../features/module-kit/data/modules";
import { API_URL } from "../services/api";

export type ModuleActivity = {
  id: string;
  title: string;
  type:
    | "INTRO"
    | "QUESTION"
    | "QUIZ"
    | "READING"
    | "REFLECTION"
    | "SCENARIO";
  description?: string;
  duration?: number;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  completed?: boolean;
};

export type CourseModule = {
  id: string;
  title: string;
  code?: string;
  description?: string;
  duration?: number;
  category?: "Basics" | "Advanced" | "Compliance";
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "NEEDS_REVIEW";
  icon?: string;
  progress?: number;
  activities?: ModuleActivity[];
};

export type CourseChapter = {
  id: string;
  title: string;
  modules: CourseModule[];
  icon?: string;
  tone?: string;
};

export type Course = {
  id: string;
  title: string;
  generatedAt?: string;
  chapters: CourseChapter[];
};

export type QuizAnswerDetail = {
  questionId: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
};

export type QuizResult = {
  answers: QuizAnswerDetail[];
  correct: number;
  incorrect: number;
  total: number;
  accuracy: number;
};

export type SelectedPdf = {
  name: string;
  uri: string;
  size?: number;
  mimeType?: string;
};

export type RecentBook = SelectedPdf & {
  id: string;
  uploadedAt: string;
};

export type Textbook = {
  id: string;
  title: string;
  original_name: string;
  status: string;
  created_at: string;
  progress: number;
  completed_modules: number;
  total_modules: number;
};

const FRIEND_DEMO_COURSE: Course = {
  id: "friend-cyberguard-course",
  title: "Cybersecurity Learning Modules",
  generatedAt: "Friend module library",
  chapters: [
    {
      id: "chapter-1",
      title: "Cybersecurity Fundamentals",
      icon: "shield-checkmark-outline",
      tone: "#4DA3FF",
      modules: friendModules,
    },
  ],
};

type CourseContextType = {
  selectedPdf: SelectedPdf | null;
  course: Course | null;
  setSelectedPdf: (pdf: SelectedPdf | null) => void;
  setCourse: (course: Course | null) => void;
  clearCourse: () => void;
  feedbackScores: Record<string, number>;
  setModuleFeedbackScore: (moduleId: string, score: number) => void;
  updateModuleProgress: (moduleId: string, progress: number, customStatus?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "NEEDS_REVIEW") => void;
  quizResults: Record<string, QuizResult>;
  setModuleQuizResult: (moduleId: string, result: QuizResult | null) => void;
  recentBooks: RecentBook[];
  addRecentBook: (book: SelectedPdf) => void;
  clearRecentBooks: () => void;
  uploadedBooks: Textbook[];
  fetchUploadedBooks: () => Promise<void>;
  switchCourse: (documentId: string) => Promise<boolean>;
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);
  const [course, setCourse] = useState<Course | null>(FRIEND_DEMO_COURSE);
  const [feedbackScores, setFeedbackScores] = useState<Record<string, number>>({});
  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>({});
  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([]);
  const [uploadedBooks, setUploadedBooks] = useState<Textbook[]>([]);

  const fetchUploadedBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/documents/`);
      if (!response.ok) throw new Error("Failed to fetch documents");
      const data = await response.json();
      setUploadedBooks(data);
    } catch (err) {
      console.error("Error fetching uploaded books:", err);
    }
  };

  const switchCourse = async (documentId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/documents/${documentId}/chapters/`);
      if (!response.ok) throw new Error("Failed to fetch course chapters");
      const data = await response.json();

      const parsedCourse: Course = {
        id: data.document_id,
        title: data.title,
        chapters: data.chapters.map((ch: any, chIdx: number) => ({
          id: ch.id,
          title: ch.title,
          icon: "book-outline",
          tone: chIdx % 2 === 0 ? "#4DA3FF" : "#38D9B0",
          modules: ch.modules.map((m: any, mIdx: number) => {
            const statusVal = (m.status || "NOT_STARTED").toUpperCase() as "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "NEEDS_REVIEW";
            return {
              id: m.id,
              title: m.title,
              code: `MOD-${ch.order}-${m.order}`,
              description: m.source_text ? (m.source_text.substring(0, 180) + "...") : "Learning content generated from textbook.",
              duration: 10,
              category: "Basics",
              difficulty: "Beginner",
              status: statusVal,
              progress: statusVal === "COMPLETED" ? 100 : statusVal === "NEEDS_REVIEW" ? 50 : statusVal === "IN_PROGRESS" ? 25 : 0,
              activities: [
                {
                  id: `act-intro-${m.id}`,
                  title: "Lesson Explanation",
                  description: m.source_text || "Read lesson details.",
                  type: "INTRO" as const,
                  completed: statusVal === "COMPLETED"
                }
              ]
            };
          })
        }))
      };

      setCourse(parsedCourse);
      return true;
    } catch (err) {
      console.error("Error switching course:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchUploadedBooks();
  }, []);

  const setModuleFeedbackScore = (moduleId: string, score: number) => {
    const safeScore = Math.max(0, Math.min(100, Math.round(score)));
    setFeedbackScores((previous) => ({ ...previous, [moduleId]: safeScore }));
  };

  const setModuleQuizResult = (moduleId: string, result: QuizResult | null) => {
    setQuizResults((previous) => {
      const next = { ...previous };
      if (result === null) {
        delete next[moduleId];
      } else {
        next[moduleId] = result;
      }
      return next;
    });
  };

  const updateModuleProgress = async (moduleId: string, progress: number, customStatus?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "NEEDS_REVIEW") => {
    const safeProgress = Math.max(0, Math.min(100, Math.round(progress)));
    const statusVal: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "NEEDS_REVIEW" =
      customStatus
        ? customStatus
        : safeProgress >= 100
          ? "COMPLETED"
          : safeProgress > 0
            ? "IN_PROGRESS"
            : "NOT_STARTED";

    // Set locally first for immediate responsiveness
    setCourse((previous) => {
      if (!previous) return previous;
      const chapters = previous.chapters.map((chapter) => {
        const modules = chapter.modules.map((module) => {
          if (module.id !== moduleId) return module;
          return {
            ...module,
            progress: safeProgress,
            status: statusVal,
          };
        });
        return { ...chapter, modules };
      });
      return { ...previous, chapters };
    });

    // Update backend asynchronously
    try {
      await fetch(`${API_URL}/learning/micro-modules/${moduleId}/status/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusVal.toLowerCase() })
      });
      fetchUploadedBooks();
    } catch (err) {
      console.error("Error updating progress in backend:", err);
    }
  };

  const addRecentBook = (book: SelectedPdf) => {
    const now = new Date().toISOString();
    const entry: RecentBook = {
      ...book,
      id: `${book.uri}-${Date.now()}`,
      uploadedAt: now,
    };

    setRecentBooks((previous) => {
      const withoutDuplicate = previous.filter((item) => item.uri !== book.uri);
      return [entry, ...withoutDuplicate].slice(0, 10);
    });
  };

  const clearRecentBooks = () => setRecentBooks([]);

  const clearCourse = () => {
    setSelectedPdf(null);
    setCourse(null);
    setFeedbackScores({});
    setQuizResults({});
  };

  const value = useMemo(
    () => ({
      selectedPdf,
      course,
      setSelectedPdf,
      setCourse,
      clearCourse,
      feedbackScores,
      setModuleFeedbackScore,
      updateModuleProgress,
      quizResults,
      setModuleQuizResult,
      recentBooks,
      addRecentBook,
      clearRecentBooks,
      uploadedBooks,
      fetchUploadedBooks,
      switchCourse,
    }),
    [selectedPdf, course, feedbackScores, quizResults, recentBooks, uploadedBooks],
  );

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);

  if (!context) {
    throw new Error("useCourse must be used inside CourseProvider");
  }

  return context;
}

