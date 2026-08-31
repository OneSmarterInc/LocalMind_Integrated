import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import LocalMindShell from "../src/components/navigation/LocalMindShell";
import { useCourse } from "../src/context/CourseContext";

const C = {
  bg: "#0B1114",
  panel: "#101A27",
  panel2: "#132235",
  border: "#263747",
  teal: "#38D9B0",
  blue: "#4DA3FF",
  gold: "#E7B52E",
  red: "#FF6B6B",
  text: "#F4F7F8",
  muted: "#A7B2BA",
};

function getTone(score: number) {
  if (score >= 90) return { color: C.teal, label: "Excellent" };
  if (score >= 70) return { color: "#2FC89D", label: "Good" };
  if (score >= 50) return { color: C.gold, label: "Average" };
  return { color: C.red, label: "Needs Improvement" };
}

function getActivities(module: any) {
  return Array.isArray(module.activities) ? module.activities : [];
}

function getTopics(module: any) {
  const activities = getActivities(module);
  const titles = activities
    .map((item: any) => item?.title)
    .filter((title: any) => typeof title === "string" && title.trim());
  return titles.length ? titles : [module.title];
}

function getFeedback(score: number, topics: string[]) {
  if (score === 0) {
    return {
      strengths: [],
      workOn: topics.slice(0, Math.min(3, topics.length)),
      message: "Complete this module quiz to generate feedback from your result.",
    };
  }

  if (score >= 90) {
    return {
      strengths: topics.slice(0, Math.min(3, topics.length)),
      workOn: topics.slice(Math.max(0, topics.length - 1)),
      message: "Excellent understanding. Keep reviewing the module to retain the concepts.",
    };
  }

  if (score >= 70) {
    return {
      strengths: topics.slice(0, Math.min(2, topics.length)),
      workOn: topics.slice(Math.max(0, topics.length - Math.min(2, topics.length))),
      message: "Good progress. Review the highlighted topics and try the quiz again if you want to improve your score.",
    };
  }

  return {
    strengths: topics.slice(0, Math.min(1, topics.length)),
    workOn: topics.slice(Math.max(0, Math.floor(topics.length / 2))),
    message: "Review the topics below before attempting the module quiz again.",
  };
}

export default function ModuleFeedbackPage() {
  const { course, feedbackScores, quizResults } = useCourse();
  const { moduleId } = useLocalSearchParams<{ moduleId?: string }>();

  const result = useMemo(() => {
    if (!course || !moduleId) return null;
    for (const chapter of course.chapters) {
      const module = chapter.modules.find((item) => item.id === moduleId);
      if (module) return { chapter, module };
    }
    return null;
  }, [course, moduleId]);


  if (!result) {
    return (
      <LocalMindShell active="Feedback" title="Feedback" subtitle="View feedback for each module to track your understanding.">
        <View style={styles.empty}>
          <Ionicons name="chatbubble-ellipses-outline" size={42} color={C.teal} />
          <Text style={styles.emptyTitle}>Module feedback not found</Text>
          <Text style={styles.emptyText}>Select a module from the Feedback page to view its detailed feedback.</Text>
          <Pressable style={styles.primary} onPress={() => router.replace("/feedback")}>
            <Text style={styles.primaryText}>Back to Feedback</Text>
          </Pressable>
        </View>
      </LocalMindShell>
    );
  }

  const { chapter, module } = result;
  const quizDetail = quizResults[module.id];
  const score = quizDetail ? quizDetail.accuracy : (feedbackScores[module.id] ?? 0);
  const info = getTone(score);
  const activities = getActivities(module);
  const topics = getTopics(module);
  const completed = quizDetail ? quizDetail.total : activities.filter((a: any) => a?.completed).length;
  const feedback = getFeedback(score, topics);

  return (
    <LocalMindShell active="Feedback" title="Feedback" subtitle="Detailed feedback for the selected module.">
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.back} onPress={() => router.replace("/feedback")}>
          <Ionicons name="arrow-back" size={17} color={C.muted} />
          <Text style={styles.backText}>Back to all modules</Text>
        </Pressable>

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>{chapter.title}</Text>
            <Text style={styles.title}>{module.title}</Text>
            <Text style={styles.subtitle}>{module.description || "Review your understanding of this module."}</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreCaption}>Your Score</Text>
            <Text style={[styles.bigScore, { color: info.color }]}>{score}%</Text>
            <Text style={[styles.scoreStatus, { color: info.color }]}>{score === 0 ? "Not Attempted" : info.label}</Text>
          </View>
        </View>

        <View style={styles.topGrid}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Performance Overview</Text>
            <View style={styles.performanceRow}>
              <View style={[styles.scoreRing, { borderColor: info.color }]}>
                <Text style={[styles.ringScore, { color: info.color }]}>{score}%</Text>
                <Text style={styles.ringLabel}>{score === 0 ? "Pending" : info.label}</Text>
              </View>
              <View style={styles.stats}>
                <Stat label="Module Score" value={`${score}%`} color={info.color} />
                <Stat label="Topics" value={`${topics.length}`} />
                <Stat label="Activities Completed" value={`${completed}/${activities.length || 0}`} />
                <Stat label="Status" value={score > 0 ? "Attempted" : "Not Attempted"} />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>What You Did Well</Text>
            {feedback.strengths.length ? feedback.strengths.map((topic) => (
              <Bullet key={topic} icon="checkmark-circle" color={C.teal} text={topic} />
            )) : <Text style={styles.mutedBody}>Your strengths will appear after you complete the quiz.</Text>}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Topics to Work On</Text>
            {feedback.workOn.map((topic) => (
              <Bullet key={topic} icon="alert-circle" color={C.red} text={topic} />
            ))}
          </View>
        </View>

        <View style={styles.lowerGrid}>
          <View style={[styles.card, styles.topicCard]}>
            <Text style={styles.cardTitle}>Topic-wise Feedback</Text>
            <Text style={styles.cardSubtitle}>Review the learning topics included in this module.</Text>
            {topics.map((topic: string, index: number) => {
               const needsWork = feedback.workOn.includes(topic);

               return (
                 <View
                   key={`${topic}-${index}`}
                   style={styles.topicRow}
                 >
                  <View
                    style={[
                        styles.topicNumber,
                        needsWork && styles.topicNumberWeak,
                    ]}
                  >
                     <Text style={styles.topicNumberText}>
                       {index + 1}
                     </Text>
                   </View>

                   <View style={styles.topicBody}>
                     <Text style={styles.topicName}>
                       {topic}
                     </Text>

                     <Text style={styles.topicDescription}>
                       {needsWork
                         ? 'Review this topic and practice again.'
                         : 'Good understanding of this topic.'}
                     </Text>
                   </View>
                 </View>
               );
             })}
          </View>

          <View style={[styles.card, styles.recommendCard]}>
            <Text style={styles.cardTitle}>Recommended Next Steps</Text>
            <Recommendation icon="book-outline" text={`Review the learning content for ${module.title}.`} />
            <Recommendation icon="bulb-outline" text={feedback.message} />
            <Recommendation icon="refresh-outline" text="Retake the quiz after reviewing the topics to improve your score." />
          </View>
        </View>

        {quizDetail && (
          <View style={[styles.card, { marginTop: 12, flex: undefined, width: "100%" }]}>
            <Text style={styles.cardTitle}>Detailed Question Review</Text>
            {quizDetail.answers.map((ans: any, idx: number) => (
              <View key={idx} style={styles.reviewRow}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons 
                    name={ans.isCorrect ? "checkmark-circle-outline" : "close-circle-outline"} 
                    size={16} 
                    color={ans.isCorrect ? C.teal : C.red} 
                  />
                  <Text style={styles.reviewQuestionNum}>Question {idx + 1}</Text>
                </View>
                <Text style={styles.reviewText}>{ans.question}</Text>
                <View style={styles.reviewAnswersGrid}>
                  <Text style={styles.reviewAnswerLabel}>
                    Selected Option: <Text style={{ color: ans.isCorrect ? C.teal : C.red, fontWeight: "700" }}>{ans.selectedAnswer}</Text>
                  </Text>
                  {!ans.isCorrect && (
                    <Text style={styles.reviewAnswerLabel}>
                      Correct Option: <Text style={{ color: C.teal, fontWeight: "700" }}>{ans.correctAnswer}</Text>
                    </Text>
                  )}
                </View>
                {!!ans.explanation && (
                  <Text style={styles.reviewExplanation}>
                    Explanation: {ans.explanation}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomBar}>
          <View style={styles.bottomIcon}><Ionicons name="bulb-outline" size={21} color={C.teal} /></View>
          <View style={styles.bottomText}>
            <Text style={styles.bottomTitle}>{score >= 70 ? "Keep Going!" : "Focus on These Topics"}</Text>
            <Text style={styles.bottomBody}>{feedback.message}</Text>
          </View>
          <Pressable style={styles.primary} onPress={() => router.push({ pathname: "/quiz", params: { moduleId: module.id } })}>
            <Text style={styles.primaryText}>{score === 0 ? "Take Quiz" : "Retake Quiz"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LocalMindShell>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return <View style={styles.statRow}><Text style={styles.statLabel}>{label}</Text><Text style={[styles.statValue, color ? { color } : null]}>{value}</Text></View>;
}

function Bullet({ icon, color, text }: { icon: any; color: string; text: string }) {
  return <View style={styles.bullet}><Ionicons name={icon} size={14} color={color} /><Text style={styles.bulletText}>{text}</Text></View>;
}

function Recommendation({ icon, text }: { icon: any; text: string }) {
  return <View style={styles.recommendation}><Ionicons name={icon} size={18} color={C.teal} /><Text style={styles.recommendText}>{text}</Text><Ionicons name="chevron-forward" size={15} color={C.muted} /></View>;
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 30, paddingTop: 18, paddingBottom: 30, minHeight: "100%" },
  back: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  backText: { color: C.muted, fontSize: 10, fontWeight: "700" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 18, marginBottom: 16 },
  headerText: { flex: 1 },
  eyebrow: { color: C.teal, fontSize: 9, fontWeight: "800", marginBottom: 4 },
  title: { color: C.text, fontSize: 22, fontWeight: "900" },
  subtitle: { color: C.muted, fontSize: 10, marginTop: 5, lineHeight: 15 },
  scoreCard: { width: 140, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderRadius: 9, padding: 12, alignItems: "center" },
  scoreCaption: { color: C.muted, fontSize: 8, fontWeight: "700" },
  bigScore: { fontSize: 25, fontWeight: "900", marginTop: 2 },
  scoreStatus: { fontSize: 8, fontWeight: "800" },
  topGrid: { flexDirection: "row", gap: 12 },
  card: { flex: 1, minWidth: 0, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 14 },
  cardTitle: { color: C.text, fontSize: 11, fontWeight: "900", marginBottom: 11 },
  cardSubtitle: { color: C.muted, fontSize: 8, marginTop: -5, marginBottom: 10 },
  performanceRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  scoreRing: { width: 108, height: 108, borderRadius: 54, borderWidth: 9, alignItems: "center", justifyContent: "center", backgroundColor: "#0C151E" },
  ringScore: { fontSize: 22, fontWeight: "900" },
  ringLabel: { color: C.muted, fontSize: 8, marginTop: 2 },
  stats: { flex: 1 },
  statRow: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: C.border, paddingVertical: 7 },
  statLabel: { color: C.muted, fontSize: 8 },
  statValue: { color: C.text, fontSize: 8, fontWeight: "800" },
  bullet: { flexDirection: "row", alignItems: "flex-start", gap: 9, marginBottom: 11 },
  bulletText: { flex: 1, color: C.text, fontSize: 8.5, lineHeight: 13 },
  mutedBody: { color: C.muted, fontSize: 8.5, lineHeight: 14 },
  lowerGrid: { flexDirection: "row", gap: 12, marginTop: 12 },
  topicCard: { flex: 1.35 },
  recommendCard: { flex: 1 },
  topicRow: { flexDirection: "row", alignItems: "center", paddingVertical: 9, borderTopWidth: 1, borderTopColor: C.border },
  topicNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#16283A", alignItems: "center", justifyContent: "center", marginRight: 9 },
  topicNumberWeak: { backgroundColor: "#321C25" },
  topicNumberText: { color: C.teal, fontSize: 8, fontWeight: "900" },
  topicBody: { flex: 1 },
  topicName: { color: C.text, fontSize: 8.5, fontWeight: "700" },
  topicDescription: {
  color: C.muted,
  fontSize: 7,
  lineHeight: 10,
  marginTop: 3,
  },
  topicStatus: { fontSize: 7, marginTop: 2, fontWeight: "700" },
  recommendation: { minHeight: 50, borderWidth: 1, borderColor: "#1D3042", borderRadius: 7, paddingHorizontal: 11, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 8, backgroundColor: C.panel2 },
  recommendText: { flex: 1, color: C.text, fontSize: 8, lineHeight: 12 },
  bottomBar: { marginTop: 12, minHeight: 68, backgroundColor: "#0D2929", borderWidth: 1, borderColor: "#185D52", borderRadius: 8, padding: 11, flexDirection: "row", alignItems: "center", gap: 10 },
  bottomIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: "#123D3A", alignItems: "center", justifyContent: "center" },
  bottomText: { flex: 1 },
  bottomTitle: { color: C.teal, fontSize: 10, fontWeight: "900" },
  bottomBody: { color: C.muted, fontSize: 8, marginTop: 3 },
  primary: { backgroundColor: C.teal, borderRadius: 6, minHeight: 35, paddingHorizontal: 15, alignItems: "center", justifyContent: "center" },
  primaryText: { color: C.bg, fontSize: 8.5, fontWeight: "900" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: C.bg, padding: 30 },
  emptyTitle: { color: C.text, fontSize: 18, fontWeight: "900", marginTop: 12 },
  emptyText: { color: C.muted, fontSize: 10, textAlign: "center", marginTop: 7, marginBottom: 15 },
  reviewRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  reviewQuestionNum: { color: C.text, fontSize: 10, fontWeight: "800" },
  reviewText: { color: C.text, fontSize: 9.5, marginTop: 5, lineHeight: 14 },
  reviewAnswersGrid: { flexDirection: "row", gap: 14, marginTop: 6 },
  reviewAnswerLabel: { color: C.muted, fontSize: 8 },
  reviewExplanation: { color: C.teal, fontSize: 8, marginTop: 6, lineHeight: 12, fontStyle: "italic" as const },
});
