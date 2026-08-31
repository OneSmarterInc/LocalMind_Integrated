import React, { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { useCourse } from "../src/context/CourseContext";
import LocalMindShell from "../src/components/navigation/LocalMindShell";
import DoubtScreen from "../src/features/learning-kit/screens/DoubtScreen";
import { findCourseModule, toFriendModule } from "../src/features/learning-kit/adapter";

export default function DoubtPage() {
  const { course } = useCourse();
  const { moduleId } =
    useLocalSearchParams<{ moduleId?: string }>();

  const module = useMemo(
    () =>
      course
        ? findCourseModule(course.chapters, moduleId)
        : null,
    [course, moduleId]
  );

  const item = module ? toFriendModule(module) : null;

  return (
    <LocalMindShell
      active="Learning"
      title="Doubts"
      subtitle="Ask questions while you learn."
    >
      <DoubtScreen
        module={item}
        onBackToLearning={
          moduleId
            ? () =>
                router.push({
                  pathname: "/learning",
                  params: { moduleId: String(moduleId) },
                })
            : undefined
        }
        onBackToModules={() => router.push("/modules")}
      />
    </LocalMindShell>
  );
}
