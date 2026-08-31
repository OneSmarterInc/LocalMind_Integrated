import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import type { ModuleItem } from '../types/module';
import type { QuizResult } from '../../../context/CourseContext';
import { colors } from '../theme/colors';
import { theme } from '../theme/theme';

interface ModuleCompletionScreenProps {
  module: ModuleItem | null;
  correctAnswers: number;
  incorrect: number;
  total: number;
  accuracy: number;
  quizResult?: QuizResult;
  onReviewModule: () => void;
  onBackToModules: () => void;
  failed?: boolean;
}

export default function ModuleCompletionScreen({
  module,
  correctAnswers,
  incorrect,
  total,
  accuracy,
  quizResult,
  onReviewModule,
  onBackToModules,
  failed,
}: ModuleCompletionScreenProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const answers = quizResult?.answers ?? [];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.successIcon, failed && { borderColor: '#FF6B6B' }]}><Text style={[styles.check, failed && { color: '#FF6B6B' }]}>{failed ? '!' : '✓'}</Text></View>
      <Text style={[styles.eyebrow, failed && { color: '#FF6B6B' }]}>{failed ? 'REMEDIAL STUDY REQUIRED' : 'MODULE COMPLETED'}</Text>
      <Text style={styles.title}>{failed ? 'Keep Practicing!' : 'Well done!'}</Text>

      {module && <>
        <Text style={styles.moduleCode}>{module.code}</Text>
        <Text style={styles.moduleTitle}>{module.title}</Text>
      </>}

      <Text style={styles.description}>
        {failed
          ? "You scored less than 65% on the quiz. Please revisit the lesson content to review the material, then try the quiz again."
          : "You have completed the quiz. Review your answers below to see what you got right and what you should revise."}
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>YOUR QUIZ PERFORMANCE</Text>
        <View style={styles.statsRow}>
          <Stat value={String(correctAnswers)} label="Correct Answers" tone="success" />
          <Stat value={String(incorrect)} label="Incorrect Answers" tone="error" />
          <Stat value={String(total)} label="Total Questions" tone="info" />
        </View>
        <View style={styles.accuracyRow}>
          <View style={styles.accuracyTextWrap}>
            <Text style={styles.accuracyLabel}>ACCURACY</Text>
            <Text style={styles.accuracyValue}>{accuracy}%</Text>
          </View>
          <View style={styles.accuracyTrack}>
            <View style={[styles.accuracyFill, { width: `${Math.max(0, Math.min(100, accuracy))}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View>
            <Text style={styles.reviewTitle}>QUESTION REVIEW</Text>
            <Text style={styles.reviewSubtitle}>Tap a question to see your answer, the correct answer and the explanation.</Text>
          </View>
          <Text style={styles.reviewCount}>{answers.length}</Text>
        </View>

        {answers.length === 0 ? (
          <Text style={styles.noReview}>Detailed answer data is not available for this attempt.</Text>
        ) : (
          answers.map((answer, index) => {
            const expanded = expandedQuestion === answer.questionId;
            return (
              <View key={answer.questionId} style={styles.questionReview}>
                <Pressable
                  onPress={() => setExpandedQuestion(expanded ? null : answer.questionId)}
                  style={styles.questionHeader}
                >
                  <View style={[styles.resultIcon, answer.isCorrect ? styles.correctIcon : styles.incorrectIcon]}>
                    <Text style={styles.resultIconText}>{answer.isCorrect ? '✓' : '×'}</Text>
                  </View>
                  <View style={styles.questionHeaderText}>
                    <Text style={styles.questionNumber}>Question {index + 1}</Text>
                    <Text style={styles.questionPreview} numberOfLines={2}>{answer.question}</Text>
                  </View>
                  <View style={styles.statusWrap}>
                    <Text style={[styles.statusText, answer.isCorrect ? styles.correctText : styles.incorrectText]}>
                      {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </Text>
                    <Text style={styles.chevron}>{expanded ? '⌃' : '⌄'}</Text>
                  </View>
                </Pressable>

                {expanded && (
                  <View style={styles.answerDetails}>
                    <View style={styles.detailBlock}>
                      <Text style={styles.detailLabel}>YOUR ANSWER</Text>
                      <Text style={[styles.detailValue, answer.isCorrect ? styles.correctText : styles.incorrectText]}>
                        {answer.selectedAnswer || 'No answer selected'}
                      </Text>
                    </View>

                    {!answer.isCorrect && (
                      <View style={styles.detailBlock}>
                        <Text style={styles.detailLabel}>CORRECT ANSWER</Text>
                        <Text style={[styles.detailValue, styles.correctText]}>{answer.correctAnswer}</Text>
                      </View>
                    )}

                    {answer.explanation && (
                      <View style={styles.explanationBlock}>
                        <Text style={styles.detailLabel}>EXPLANATION</Text>
                        <Text style={styles.explanationText}>{answer.explanation}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onReviewModule} style={[styles.secondaryButton, failed && styles.relearnButton]}>
          <Text style={[styles.secondaryText, failed && styles.relearnText]}>
            {failed ? "Re-learn & Re-take Quiz" : "Review Module"}
          </Text>
        </Pressable>
        <Pressable onPress={onBackToModules} style={styles.primaryButton}>
          <Text style={styles.primaryText}>Back to Modules →</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Stat({ value, label, tone }: { value: string; label: string; tone: 'success' | 'error' | 'info' }) {
  const color = tone === 'success' ? colors.primary : tone === 'error' ? '#FF6B6B' : '#4DA3FF';
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { width: '100%', maxWidth: 900, alignSelf: 'center', alignItems: 'center', padding: 28, paddingBottom: 60 },
  successIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.surfaceElevated, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  check: { color: colors.primary, fontSize: 38, fontWeight: '900' },
  eyebrow: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', marginBottom: 10 },
  moduleCode: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 5 },
  moduleTitle: { color: colors.text, fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  description: { maxWidth: 650, color: colors.textSecondary, fontSize: 12, lineHeight: 19, textAlign: 'center', marginBottom: 22 },
  summaryCard: { width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: theme.radius.card, padding: 20 },
  summaryTitle: { color: colors.textSecondary, fontSize: 9, fontWeight: '900', letterSpacing: 1.3, marginBottom: 16 },
  statsRow: { flexDirection: 'row', width: '100%', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 16, marginBottom: 15 },
  stat: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: colors.border },
  statValue: { fontSize: 24, fontWeight: '900' },
  statLabel: { color: colors.textSecondary, fontSize: 8, fontWeight: '700', marginTop: 3, textAlign: 'center' },
  accuracyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  accuracyTextWrap: { width: 80 },
  accuracyLabel: { color: colors.textSecondary, fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  accuracyValue: { color: colors.primary, fontSize: 24, fontWeight: '900', marginTop: 2 },
  accuracyTrack: { flex: 1, height: 7, borderRadius: 10, backgroundColor: colors.surfaceElevated, overflow: 'hidden' },
  accuracyFill: { height: '100%', borderRadius: 10, backgroundColor: colors.primary },
  reviewCard: { width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: theme.radius.card, padding: 20, marginTop: 14 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  reviewTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  reviewSubtitle: { color: colors.textSecondary, fontSize: 9, lineHeight: 14, marginTop: 3, maxWidth: 650 },
  reviewCount: { color: colors.primary, fontSize: 12, fontWeight: '900' },
  questionReview: { borderTopWidth: 1, borderTopColor: colors.border },
  questionHeader: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 10 },
  resultIcon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  correctIcon: { backgroundColor: '#123B34' },
  incorrectIcon: { backgroundColor: '#3A1D26' },
  resultIconText: { color: colors.text, fontSize: 16, fontWeight: '900' },
  questionHeaderText: { flex: 1 },
  questionNumber: { color: colors.textSecondary, fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  questionPreview: { color: colors.text, fontSize: 10, lineHeight: 15, fontWeight: '700', marginTop: 3 },
  statusWrap: { minWidth: 72, alignItems: 'flex-end' },
  statusText: { fontSize: 9, fontWeight: '900' },
  correctText: { color: colors.primary },
  incorrectText: { color: '#FF6B6B' },
  chevron: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },
  answerDetails: { backgroundColor: colors.surfaceElevated, borderRadius: 9, padding: 14, marginBottom: 12 },
  detailBlock: { marginBottom: 12 },
  detailLabel: { color: colors.textSecondary, fontSize: 8, fontWeight: '900', letterSpacing: 1, marginBottom: 5 },
  detailValue: { fontSize: 11, lineHeight: 17, fontWeight: '700' },
  explanationBlock: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 11 },
  explanationText: { color: colors.textSecondary, fontSize: 10, lineHeight: 16 },
  noReview: { color: colors.textSecondary, fontSize: 10, paddingVertical: 14 },
  actions: { width: '100%', flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 18 },
  secondaryButton: { minHeight: 42, paddingHorizontal: 17, borderRadius: 9, borderWidth: 1, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  secondaryText: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  primaryButton: { minHeight: 42, paddingHorizontal: 18, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#06100D', fontSize: 10, fontWeight: '900' },
  relearnButton: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
  },
  relearnText: {
    color: colors.primary,
  },
});
