import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import type { ModuleItem } from '../types/module';
import { colors } from '../theme/colors';
import { theme } from '../theme/theme';
import { API_URL } from '../../../services/api';

type LearningScreenProps = {
  module: ModuleItem | null;
  onComplete: () => void;
  onOpenDoubt: () => void;
};



/**
 * Module flow:
 * 1. Introduction / explanation page
 * 2. Learner starts the dedicated 6-question quiz
 * 3. Questions 1-3 -> Continue -> Questions 4-6
 * 4. Complete Quiz appears only after question 6
 *
 * Activity question/reflection pages are intentionally not shown.
 */
export default function LearningScreen({
  module,
  onComplete,
  onOpenDoubt,
}: LearningScreenProps) {
  const [loading, setLoading] = useState(false);
  const [lessonContent, setLessonContent] = useState<any>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (!module?.id) return;
    
    let active = true;
    const fetchLesson = async () => {
      setLoading(true);
      setErrorText(null);
      try {
        const sourceText = module.activities?.[0]?.description || "";
        const response = await fetch(`${API_URL}/tutor/teach/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            micro_module: {
              id: module.id,
              title: module.title,
              source_text: sourceText
            }
          })
        });
        if (!response.ok) throw new Error("Failed to load lesson content");
        const data = await response.json();
        if (active) {
          setLessonContent(data);
        }
      } catch (err: any) {
        console.error("Error fetching lesson content:", err);
        if (active) {
          setErrorText("Could not load textbook explanation. Using local content.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchLesson();

    return () => {
      active = false;
    };
  }, [module?.id]);

  if (!module) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Module Selected</Text>
        <Text style={styles.emptyText}>
          Please select a module before starting the lesson.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.introHeader}>
          <Text style={styles.eyebrow}>{module.code ?? 'MODULE'}</Text>
          <Text style={styles.introTitle}>{module.title}</Text>
          <Text style={styles.introSubtitle}>
            Read the module explanation before starting the test.
          </Text>
        </View>

        <View style={styles.introProgressSection}>
          <View style={styles.introProgressHeader}>
            <Text style={styles.progressLabel}>MODULE INTRODUCTION</Text>
            <Text style={styles.progressCount}>1 / 2</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
        </View>

        <View style={styles.introCard}>
          <View style={styles.introMetaRow}>
            <View style={styles.introIcon}>
              <Text style={styles.introIconText}>i</Text>
            </View>
            <View style={styles.introMetaTextWrap}>
              <Text style={styles.introMetaLabel}>MODULE EXPLANATION</Text>
              <Text style={styles.introMetaValue}>
                {module.duration ? `${module.duration} min` : 'Learning module'}
              </Text>
            </View>
          </View>

          {loading ? (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.spinnerText}>Simplifying textbook content via Local AI...</Text>
            </View>
          ) : lessonContent ? (
            <View>
              <Text style={styles.explanationTitle}>Introduction</Text>
              <Text style={styles.explanationText}>
                {lessonContent.introduction}
              </Text>

              {(lessonContent.explanation || []).map((section: any, idx: number) => (
                <View key={idx} style={{ marginTop: 22 }}>
                  <Text style={styles.sectionHeading}>{section.heading}</Text>
                  <Text style={styles.explanationText}>{section.content}</Text>
                </View>
              ))}

              {!!lessonContent.application && (
                <View style={{ marginTop: 22 }}>
                  <Text style={styles.sectionHeading}>Application</Text>
                  <Text style={styles.explanationText}>{lessonContent.application}</Text>
                </View>
              )}

              {Array.isArray(lessonContent.key_takeaways) && lessonContent.key_takeaways.length > 0 && (
                <View style={styles.takeawaysCard}>
                  <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
                  {lessonContent.key_takeaways.map((point: string, idx: number) => (
                    <View key={idx} style={styles.takeawayRow}>
                      <View style={styles.takeawayDot} />
                      <Text style={styles.takeawayText}>{point}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View>
              {!!errorText && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{errorText}</Text>
                </View>
              )}
              <Text style={styles.explanationTitle}>About This Module</Text>
              <Text style={styles.explanationText}>
                {module.description ||
                  'This module contains learning content generated from the selected textbook.'}
              </Text>
            </View>
          )}

          <View style={styles.detailsRow}>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>CATEGORY</Text>
              <Text style={styles.detailValue}>{module.category ?? 'Basics'}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>DIFFICULTY</Text>
              <Text style={styles.detailValue}>{module.difficulty ?? 'Beginner'}</Text>
            </View>
          </View>

          <View style={styles.readyBox}>
            <Text style={styles.readyTitle}>Ready to test your learning?</Text>
            <Text style={styles.readyText}>
              Once you finish reading the explanation, start the quiz to check your understanding of this module.
            </Text>
          </View>
        </View>

        <View style={styles.introNavigationRow}>
          <Pressable onPress={onOpenDoubt} style={styles.doubtButton}>
            <View style={styles.doubtIcon}>
              <Text style={styles.doubtIconText}>?</Text>
            </View>
            <Text style={styles.doubtText}>Doubt</Text>
          </Pressable>

          <Pressable
            onPress={onComplete}
            style={styles.nextButton}
          >
            <Text style={styles.nextText}>Start Quiz →</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: {
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
    padding: 28,
    paddingBottom: 70,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyTitle: { color: colors.text, fontSize: 22, fontWeight: '800' },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  introHeader: { marginBottom: 25 },
  introTitle: { color: colors.text, fontSize: 30, fontWeight: '800' },
  introSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },
  introProgressSection: { marginBottom: 25 },
  introProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  introCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.radius.card,
    padding: 28,
  },
  introMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  introIcon: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  introIconText: { color: colors.primary, fontSize: 20, fontWeight: '900' },
  introMetaTextWrap: { flex: 1 },
  introMetaLabel: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  introMetaValue: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  explanationTitle: { color: colors.text, fontSize: 21, fontWeight: '800', marginBottom: 10 },
  explanationText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 24,
  },
  detailsRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  detailBox: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    padding: 14,
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  detailValue: { color: colors.text, fontSize: 12, fontWeight: '700', marginTop: 5 },
  readyBox: {
    marginTop: 24,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 14,
  },
  readyTitle: { color: colors.text, fontSize: 13, fontWeight: '800' },
  readyText: { color: colors.textSecondary, fontSize: 11, lineHeight: 18, marginTop: 5 },
  introNavigationRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  header: { marginBottom: 28 },
  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 7,
  },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },
  progressSection: { marginBottom: 24 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  progressCount: { color: colors.primary, fontSize: 10, fontWeight: '800' },
  progressTrack: {
    height: 6,
    borderRadius: 10,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.radius.card,
    padding: 26,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 22,
  },
  questionNumber: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumberText: { color: colors.primary, fontSize: 12, fontWeight: '900' },
  questionLabel: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  questionCount: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
  question: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  optionsContainer: { gap: 10 },
  option: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionSelected: { borderColor: colors.primary },
  optionCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCircleSelected: { borderColor: colors.primary },
  optionDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  optionText: { flex: 1, color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  optionTextSelected: { color: colors.text, fontWeight: '700' },
  answerHint: { color: colors.textSecondary, fontSize: 11, marginTop: 16 },
  navigationRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  leftNavigation: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  previousButton: {
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previousText: { color: colors.text, fontSize: 11, fontWeight: '700' },
  doubtButton: {
    height: 42,
    paddingHorizontal: 13,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  doubtIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doubtIconText: { color: colors.primary, fontSize: 11, fontWeight: '900' },
  doubtText: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  nextButton: {
    height: 42,
    paddingHorizontal: 17,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: { color: '#06100D', fontSize: 11, fontWeight: '800' },
  disabledButton: { opacity: 0.35 },
  spinnerContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 15,
  },
  sectionHeading: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  takeawaysCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    padding: 18,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  takeawaysTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginBottom: 10,
  },
  takeawayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  takeawayText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  errorBanner: {
    backgroundColor: '#3D1C23',
    borderColor: '#FF6B6B',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 11,
    lineHeight: 16,
  },
});
