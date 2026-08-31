import React, { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import LocalMindShell from "../src/components/navigation/LocalMindShell";
import ModuleCompleteScreen from "../src/features/learning-kit/screens/ModuleCompleteScreen";

import { useCourse } from "../src/context/CourseContext";
import { findCourseModule, toFriendModule } from "../src/features/learning-kit/adapter";

export default function ModuleCompletePage() {
  const { course, quizResults, setModuleQuizResult } = useCourse();

  const params = useLocalSearchParams<{
    moduleId?: string;
    correct?: string;
    incorrect?: string;
    total?: string;
    accuracy?: string;
  }>();

  // Find the actual module dynamically
  const module = useMemo(
    () =>
      course
        ? findCourseModule(course.chapters, params.moduleId)
        : null,
    [course, params.moduleId]
  );

  // Convert it to the format used by ModuleCompleteScreen
  const item = module ? toFriendModule(module) : null;

  // Get quiz results dynamically from route parameters
  const correct = Number(params.correct ?? 0);

  const incorrect = Number(params.incorrect ?? 0);

  const total = Number(params.total ?? 0);

  const result = params.moduleId ? quizResults[String(params.moduleId)] : undefined;

  const resultCorrect = result?.correct ?? Number(params.correct ?? 0);
  const resultIncorrect = result?.incorrect ?? Number(params.incorrect ?? 0);
  const resultTotal = result?.total ?? Number(params.total ?? 0);
  const resultAccuracy = result?.accuracy ?? Number(params.accuracy ?? (resultTotal > 0 ? Math.round((resultCorrect / resultTotal) * 100) : 0));

  // If module cannot be found
  if (!item) {
    return (
      <LocalMindShell
        active="Learning"
        title="Module Completed"
        subtitle="Your module result"
      >
        <View style={styles.empty}>
          <Text style={styles.title}>
            Module Result Not Found
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => router.push("/modules")}
          >
            <Text style={styles.buttonText}>
              Back to My Courses
            </Text>
          </Pressable>
        </View>
      </LocalMindShell>
    );
  }

  const failed = resultAccuracy < 65;

  return (
    <LocalMindShell
      active="Learning"
      title={failed ? "Remedial Study Required" : "Module Completed"}
      subtitle={failed ? "Revisit the lesson contents to try again." : "Nice work. Your quiz results are ready."}
    >
      <ModuleCompleteScreen
        module={item}
        correctAnswers={resultCorrect}
        incorrect={resultIncorrect}
        total={resultTotal}
        accuracy={resultAccuracy}
        quizResult={result}
        failed={failed}
        onReviewModule={() => {
          if (failed) {
            setModuleQuizResult(item.id, null);
            router.replace({
              pathname: "/learning",
              params: {
                moduleId: item.id,
              },
            });
          } else {
            router.push({
              pathname: "/module-overview",
              params: {
                moduleId: item.id,
              },
            });
          }
        }}
        onBackToModules={() =>
          router.push("/modules")
        }
      />
    </LocalMindShell>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  title: {
    color: "#F4F7F8",
    fontSize: 24,
    fontWeight: "800",
  },

  button: {
    backgroundColor: "#38D9B0",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 7,
    marginTop: 20,
  },

  buttonText: {
    color: "#0B1114",
    fontWeight: "800",
  },
});