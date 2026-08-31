import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import LocalMindShell from "../src/components/navigation/LocalMindShell";
import { useCourse } from "../src/context/CourseContext";

const C = {
  bg: "#0B1114",
  panel: "#101A27",
  panel2: "#132235",
  border: "#263747",
  borderSoft: "#1D3042",
  teal: "#38D9B0",
  tealDark: "#0D6B5A",
  text: "#F4F7F8",
  muted: "#A7B2BA",
  blue: "#4DA3FF",
  gold: "#E7B52E",
  red: "#FF6B6B",
};

type ScoreTone = "excellent" | "good" | "average" | "needs";

type FeedbackRow = {
  score: number;
  tone: ScoreTone;
};

function getTone(score: number): ScoreTone {
  if (score >= 90) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "average";
  return "needs";
}

function getToneLabel(tone: ScoreTone) {
  if (tone === "excellent") return "Excellent";
  if (tone === "good") return "Good";
  if (tone === "average") return "Average";
  return "Needs Improvement";
}

function getToneColor(tone: ScoreTone) {
  if (tone === "excellent") return C.teal;
  if (tone === "good") return "#2FC89D";
  if (tone === "average") return C.gold;
  return C.red;
}

function getModuleScore(
  moduleId: string,
  feedbackScores: Record<string, number>,
  progress?: number,
  activities?: { completed?: boolean }[],
) {
  // A completed quiz result is the source of truth for feedback.
  if (typeof feedbackScores[moduleId] === "number") {
    return feedbackScores[moduleId];
  }

  // If a generated course already supplies progress/activity completion,
  // use it as a fallback until the module quiz is attempted.
  const total = activities?.length ?? 0;
  const completed = activities?.filter((item) => item.completed).length ?? 0;

  if (total > 0 && completed > 0) {
    return Math.round((completed / total) * 100);
  }

  if (typeof progress === "number" && progress > 0) {
    return Math.round(progress);
  }

  return 0;
}

function ChapterItem({
  title,
  subtitle,
  active,
  index,
  onPress,
}: {
  title: string;
  subtitle?: string;
  active: boolean;
  index: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chapterItem,
        active && styles.chapterItemActive,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.chapterNumber, active && styles.chapterNumberActive]}>
        {active ? (
          <Ionicons name="checkmark" size={13} color={C.bg} />
        ) : (
          <Text style={styles.chapterNumberText}>{index + 1}</Text>
        )}
      </View>

      <View style={styles.chapterText}>
        <Text style={styles.chapterTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.chapterSubtitle} numberOfLines={1}>
          {subtitle || "Learning chapter"}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={15}
        color={active ? C.teal : C.muted}
      />
    </Pressable>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const tone = getTone(score);
  const color = getToneColor(tone);

  return (
    <View style={styles.scoreWrap}>
      <View
        style={[
          styles.scoreBadge,
          {
            borderColor: color,
            backgroundColor: `${color}14`,
          },
        ]}
      >
        <Text style={[styles.scoreText, { color }]}>{score}%</Text>
      </View>
      <Text style={[styles.scoreLabel, { color }]}>
        {score === 0 ? "Not Attempted" : getToneLabel(tone)}
      </Text>
    </View>
  );
}

function ModuleRow({
  index,
  title,
  description,
  score,
  onPress,
}: {
  index: number;
  title: string;
  description?: string;
  score: number;
  onPress: () => void;
}) {
  const tone = getTone(score);
  const color = getToneColor(tone);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.moduleRow, pressed && styles.pressed]}
    >
      <View style={[styles.statusCircle, { backgroundColor: `${color}20` }]}>
        <Ionicons
          name={score >= 70 ? "checkmark" : score >= 50 ? "remove" : "close"}
          size={14}
          color={color}
        />
      </View>

      <View style={styles.moduleInfo}>
        <Text style={styles.moduleTitle}>Module {index + 1}</Text>
      </View>

      <View style={styles.topicInfo}>
        <Text style={styles.topicText} numberOfLines={1}>
          {title}
        </Text>
        {description ? (
          <Text style={styles.topicDescription} numberOfLines={1}>
            {description}
          </Text>
        ) : null}
      </View>

      <ScoreBadge score={score} />

      <Ionicons name="chevron-forward" size={17} color={C.muted} />
    </Pressable>
  );
}

export default function FeedbackPage() {
  const { width, height } = useWindowDimensions();
  const mobile = width < 760;
  const { course, feedbackScores } = useCourse();

  const chapters = course?.chapters ?? [];

  const [selectedChapterId, setSelectedChapterId] = useState(
    chapters[0]?.id ?? "",
  );

  // Keep the selected chapter synchronized when a newly generated course
  // replaces the current course in CourseContext.
  useEffect(() => {
    if (!chapters.some((chapter) => chapter.id === selectedChapterId)) {
      setSelectedChapterId(chapters[0]?.id ?? "");
    }
  }, [chapters, selectedChapterId]);

  const selectedChapter = useMemo(
    () =>
      chapters.find((chapter) => chapter.id === selectedChapterId) ??
      chapters[0],
    [chapters, selectedChapterId],
  );

  const modules = selectedChapter?.modules ?? [];

  const scores = modules
    .map((module) => getModuleScore(module.id, feedbackScores, module.progress, module.activities))
    .filter((score) => score > 0);

  const average =
    scores.length > 0
      ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length)
      : 0;

  return (
    <LocalMindShell
      active="Feedback"
      title="Feedback"
      subtitle="View feedback for each module to track your understanding."
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          mobile && styles.contentMobile,
          !mobile && { minHeight: Math.max(height - 88, 620) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Course Feedback Overview</Text>
            <Text style={styles.pageSubtitle}>
              Select a chapter and view feedback for its modules.
            </Text>
          </View>

          {selectedChapter && (
            <View style={styles.averagePill}>
              <Text style={styles.averageLabel}>Chapter average</Text>
              <Text style={styles.averageValue}>{average}%</Text>
            </View>
          )}
        </View>

        {chapters.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="chatbubble-ellipses-outline" size={26} color={C.teal} />
            </View>
            <Text style={styles.emptyTitle}>No Feedback Yet</Text>
            <Text style={styles.emptyText}>
              Generate a course and complete module questions to see feedback
              here.
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push("/" as never)}
            >
              <Text style={styles.primaryButtonText}>Upload Book</Text>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.layout, mobile && styles.layoutMobile]}>
            <View style={[styles.chapterPanel, mobile && styles.chapterPanelMobile]}>
              <Text style={styles.sectionTitle}>Chapters</Text>

              <View style={styles.chapterList}>
                {chapters.map((chapter, index) => (
                  <ChapterItem
                    key={chapter.id}
                    index={index}
                    title={chapter.title}
                    subtitle={`${chapter.modules.length} ${
                      chapter.modules.length === 1 ? "Module" : "Modules"
                    }`}
                    active={chapter.id === selectedChapter?.id}
                    onPress={() => setSelectedChapterId(chapter.id)}
                  />
                ))}
              </View>

              <View style={styles.guideCard}>
                <Text style={styles.guideTitle}>Feedback Score Guide</Text>

                {[
                  ["90–100%", "Excellent", C.teal],
                  ["70–89%", "Good", "#2FC89D"],
                  ["50–69%", "Average", C.gold],
                  ["0–49%", "Needs Improvement", C.red],
                ].map(([range, label, color]) => (
                  <View key={label} style={styles.guideRow}>
                    <View
                      style={[styles.guideDot, { backgroundColor: color }]}
                    />
                    <Text style={styles.guideRange}>{range}</Text>
                    <Text style={styles.guideLabel}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.modulePanel}>
              <View style={styles.modulePanelHeader}>
                <View style={styles.moduleHeading}>
                  <Text style={styles.modulePanelTitle}>
                    {selectedChapter?.title}
                  </Text>
                  <Text style={styles.modulePanelSubtitle}>
                    {modules.length}{" "}
                    {modules.length === 1 ? "Module" : "Modules"}
                  </Text>
                </View>
              </View>

              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeading, styles.moduleCol]}>
                  Module
                </Text>
                <Text style={[styles.tableHeading, styles.topicCol]}>
                  Topic
                </Text>
                <Text style={[styles.tableHeading, styles.scoreCol]}>
                  Feedback Score
                </Text>
                <View style={styles.arrowCol} />
              </View>

              {modules.map((module, index) => {
                const score = getModuleScore(
                  module.id,
                  feedbackScores,
                  module.progress,
                  module.activities,
                );

                return (
                  <ModuleRow
                    key={module.id}
                    index={index}
                    title={module.title}
                    description={module.description}
                    score={score}
                    onPress={() =>
                      router.push({
                        pathname: "/module-feedback",
                        params: { moduleId: module.id },
                      })
                    }
                  />
                );
              })}

              {modules.length === 0 && (
                <View style={styles.noModules}>
                  <Text style={styles.noModulesText}>
                    No modules are available in this chapter yet.
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </LocalMindShell>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 24,
    paddingBottom: 35,
  },
  contentMobile: {
    paddingHorizontal: 15,
    paddingTop: 18,
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 15,
  },
  pageTitle: {
    color: C.text,
    fontSize: 20,
    fontWeight: "800",
  },
  pageSubtitle: {
    color: C.muted,
    fontSize: 11,
    marginTop: 5,
  },
  averagePill: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.panel,
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 8,
    alignItems: "center",
  },
  averageLabel: {
    color: C.muted,
    fontSize: 8,
    fontWeight: "700",
  },
  averageValue: {
    color: C.teal,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 2,
  },
  layout: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
    minHeight: 430,
  },
  layoutMobile: {
    flex: 0,
    flexDirection: "column",
    minHeight: 0,
  },
  chapterPanel: {
    width: 250,
    minHeight: 430,
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 10,
  },
  chapterPanelMobile: {
    width: "100%",
    minHeight: 0,
  },
  sectionTitle: {
    color: C.text,
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 3,
    paddingVertical: 7,
  },
  chapterList: {
    gap: 6,
  },
  chapterItem: {
    minHeight: 57,
    borderWidth: 1,
    borderColor: C.borderSoft,
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chapterItemActive: {
    borderColor: C.teal,
    backgroundColor: "#0D2A2A",
  },
  chapterNumber: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#18293A",
    alignItems: "center",
    justifyContent: "center",
  },
  chapterNumberActive: {
    backgroundColor: C.teal,
  },
  chapterNumberText: {
    color: C.muted,
    fontSize: 9,
    fontWeight: "800",
  },
  chapterText: {
    flex: 1,
    minWidth: 0,
  },
  chapterTitle: {
    color: C.text,
    fontSize: 9,
    fontWeight: "800",
  },
  chapterSubtitle: {
    color: C.muted,
    fontSize: 7.5,
    marginTop: 3,
  },
  guideCard: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.borderSoft,
    paddingTop: 11,
    paddingHorizontal: 3,
  },
  guideTitle: {
    color: C.text,
    fontSize: 9,
    fontWeight: "800",
    marginBottom: 8,
  },
  guideRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  guideDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },
  guideRange: {
    color: C.muted,
    fontSize: 7,
    width: 55,
  },
  guideLabel: {
    color: C.text,
    fontSize: 7,
    flex: 1,
  },
  modulePanel: {
    flex: 1,
    minHeight: 430,
    minWidth: 0,
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  modulePanelHeader: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: "#111E2C",
  },
  moduleHeading: {
    flex: 1,
  },
  modulePanelTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: "900",
  },
  modulePanelSubtitle: {
    color: C.muted,
    fontSize: 8,
    marginTop: 4,
  },
  tableHeader: {
    minHeight: 34,
    backgroundColor: C.panel2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  tableHeading: {
    color: C.muted,
    fontSize: 7.5,
    fontWeight: "800",
  },
  moduleCol: {
    width: 120,
  },
  topicCol: {
    flex: 1,
  },
  scoreCol: {
    width: 160,
  },
  arrowCol: {
    width: 18,
  },
  moduleRow: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: C.borderSoft,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 9,
  },
  statusCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  moduleInfo: {
    width: 95,
  },
  moduleTitle: {
    color: C.text,
    fontSize: 9,
    fontWeight: "800",
  },
  topicInfo: {
    flex: 1,
    minWidth: 0,
  },
  topicText: {
    color: C.text,
    fontSize: 8.5,
    fontWeight: "600",
  },
  topicDescription: {
    color: C.muted,
    fontSize: 7,
    marginTop: 3,
  },
  scoreWrap: {
    width: 160,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  scoreBadge: {
    minWidth: 47,
    height: 28,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 9,
    fontWeight: "900",
  },
  scoreLabel: {
    fontSize: 7.5,
    fontWeight: "700",
  },
  noModules: {
    padding: 30,
    alignItems: "center",
  },
  noModulesText: {
    color: C.muted,
    fontSize: 9,
  },
  emptyCard: {
    minHeight: 330,
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0D2A2A",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    color: C.text,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 12,
  },
  emptyText: {
    color: C.muted,
    fontSize: 9,
    lineHeight: 15,
    textAlign: "center",
    maxWidth: 420,
    marginTop: 7,
  },
  primaryButton: {
    backgroundColor: C.teal,
    borderRadius: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 16,
  },
  primaryButtonText: {
    color: C.bg,
    fontSize: 9,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.75,
  },
});
