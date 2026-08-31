import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';

import type {
  ModuleActivity,
  ModuleItem,
} from '../types/module';

import { colors } from '../theme/colors';
import { theme } from '../theme/theme';

type LearningScreenProps = {
  module: ModuleItem | null;
};

export default function LearningScreen({
  module,
}: LearningScreenProps) {
  const [currentActivity, setCurrentActivity] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [reflection, setReflection] =
    useState('');

  /*
   * Dynamic activities.
   *
   * Activities come directly from the selected
   * module instead of being hardcoded here.
   */
  const activities: ModuleActivity[] =
    module?.activities ?? [];

  const totalActivities = activities.length;

  const activity =
    activities[currentActivity];

  /*
   * Empty state
   */
  if (!module) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          No Module Selected
        </Text>

        <Text style={styles.emptyDescription}>
          Return to the Module Library and select
          a module to begin learning.
        </Text>
      </View>
    );
  }

  if (totalActivities === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
      >
        <Text style={styles.emptyTitle}>
          {module.title}
        </Text>

        <Text style={styles.emptyDescription}>
          Activities for this module are not
          available yet.
        </Text>
      </ScrollView>
    );
  }

  /*
   * Dynamic progress
   */
  const progress =
    totalActivities > 0
      ? ((currentActivity + 1) /
          totalActivities) *
        100
      : 0;

  const isLastActivity =
    currentActivity ===
    totalActivities - 1;

  /*
   * Activity type helpers
   */
  const isQuestion =
    activity?.type === 'QUESTION' ||
    activity?.type === 'QUIZ';

  const isReading =
    activity?.type === 'READING';

  const isReflection =
    activity?.type === 'REFLECTION';

  const isScenario =
    activity?.type === 'SCENARIO';

  const isIntro =
    activity?.type === 'INTRO';

  /*
   * Question correctness
   */
  const isCorrect =
    selectedAnswer !== null &&
    selectedAnswer ===
      activity?.correctAnswer;

  /*
   * Next activity
   */
  const handleNext = () => {
    if (currentActivity < totalActivities - 1) {
      setCurrentActivity(
        previous => previous + 1,
      );

      setSelectedAnswer(null);
      setReflection('');

      return;
    }

    console.log(
      'Module completed:',
      module.id,
    );
  };

  /*
   * Previous activity
   */
  const handlePrevious = () => {
    if (currentActivity === 0) {
      return;
    }

    setCurrentActivity(
      previous => previous - 1,
    );

    setSelectedAnswer(null);
    setReflection('');
  };

  /*
   * Select answer
   */
  const handleAnswerSelect = (
    option: string,
  ) => {
    setSelectedAnswer(option);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        styles.scrollContent
      }
    >
      {/* Module Header */}

      <View style={styles.moduleHeader}>
        <View style={styles.moduleHeaderText}>
          <Text style={styles.moduleCode}>
            {module.code}
          </Text>

          <Text style={styles.moduleTitle}>
            {module.title}
          </Text>

          <Text style={styles.moduleDescription}>
            {module.description}
          </Text>
        </View>

        <View style={styles.moduleMeta}>
          <Text style={styles.metaValue}>
            {module.duration} min
          </Text>

          <Text style={styles.metaLabel}>
            EST. DURATION
          </Text>
        </View>
      </View>

      {/* Progress */}

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            MODULE PROGRESS
          </Text>

          <Text style={styles.progressCount}>
            {currentActivity + 1} /{' '}
            {totalActivities}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.progressPercentage}>
          {Math.round(progress)}% complete
        </Text>
      </View>

      {/* Current Activity */}

      <View style={styles.activityCard}>
        <View style={styles.activityTopRow}>
          <View style={styles.activityNumber}>
            <Text style={styles.activityNumberText}>
              {String(
                currentActivity + 1,
              ).padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.activityTypeBadge}>
            <Text style={styles.activityTypeText}>
              {activity.type}
            </Text>
          </View>

          {activity.duration !== undefined && (
            <Text style={styles.activityDuration}>
              {activity.duration} min
            </Text>
          )}
        </View>

        <Text style={styles.activityTitle}>
          {activity.title}
        </Text>

        {!!activity.description && (
          <Text style={styles.activityDescription}>
            {activity.description}
          </Text>
        )}

        {/* INTRO */}

        {isIntro && (
          <View style={styles.introBox}>
            <Text style={styles.introLabel}>
              INTRODUCTION
            </Text>

            <Text style={styles.introText}>
              {activity.description}
            </Text>
          </View>
        )}

        {/* QUESTION / QUIZ */}

        {isQuestion &&
          !!activity.question && (
            <View style={styles.questionSection}>
              <Text style={styles.questionLabel}>
                {activity.type}
              </Text>

              <Text style={styles.question}>
                {activity.question}
              </Text>

              <View style={styles.options}>
                {(
                  activity.options ?? []
                ).map((option, index) => {
                  const selected =
                    selectedAnswer === option;

                  const correct =
                    selected &&
                    option ===
                      activity.correctAnswer;

                  return (
                    <Pressable
                      key={`${option}-${index}`}
                      onPress={() =>
                        handleAnswerSelect(
                          option,
                        )
                      }
                      style={[
                        styles.option,
                        selected &&
                          styles.optionSelected,
                        correct &&
                          styles.optionCorrect,
                      ]}
                    >
                      <View
                        style={[
                          styles.optionIndicator,
                          selected &&
                            styles.optionIndicatorSelected,
                        ]}
                      />

                      <Text
                        style={[
                          styles.optionText,
                          selected &&
                            styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {selectedAnswer !== null && (
                <View
                  style={[
                    styles.feedback,
                    isCorrect
                      ? styles.feedbackCorrect
                      : styles.feedbackIncorrect,
                  ]}
                >
                  <Text
                    style={
                      styles.feedbackTitle
                    }
                  >
                    {isCorrect
                      ? 'Correct'
                      : 'Review your answer'}
                  </Text>

                  {!!activity.explanation && (
                    <Text
                      style={
                        styles.feedbackText
                      }
                    >
                      {activity.explanation}
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}

        {/* READING */}

        {isReading && (
          <View style={styles.readingBox}>
            <Text style={styles.readingLabel}>
              LEARNING CONTENT
            </Text>

            <Text style={styles.readingText}>
              {activity.description}
            </Text>
          </View>
        )}

        {/* REFLECTION */}

        {isReflection && (
          <View style={styles.reflectionBox}>
            <Text style={styles.questionLabel}>
              REFLECTION
            </Text>

            <Text style={styles.reflectionPrompt}>
              {activity.question ??
                activity.description}
            </Text>

            <TextInput
              value={reflection}
              onChangeText={setReflection}
              placeholder="Write your reflection here..."
              placeholderTextColor={
                colors.textSecondary
              }
              multiline
              textAlignVertical="top"
              style={styles.reflectionInput}
            />
          </View>
        )}

        {/* SCENARIO */}

        {isScenario && (
          <View style={styles.scenarioBox}>
            <Text style={styles.questionLabel}>
              SCENARIO
            </Text>

            <Text style={styles.scenarioText}>
              {activity.question ??
                activity.description}
            </Text>

            {!!activity.explanation && (
              <Text
                style={styles.scenarioExplanation}
              >
                {activity.explanation}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Navigation */}

      <View style={styles.navigation}>
        <Pressable
          onPress={handlePrevious}
          disabled={currentActivity === 0}
          style={[
            styles.previousButton,
            currentActivity === 0 &&
              styles.disabledButton,
          ]}
        >
          <Text style={styles.previousText}>
            Previous
          </Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          style={styles.nextButton}
        >
          <Text style={styles.nextText}>
            {isLastActivity
              ? 'Complete Module'
              : 'Next Activity'}
          </Text>

          {!isLastActivity && (
            <Text style={styles.nextArrow}>
              →
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 28,
    paddingBottom: 60,
  },

  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 28,
  },

  moduleHeaderText: {
    flex: 1,
  },

  moduleCode: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  moduleTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },

  moduleDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    maxWidth: 720,
  },

  moduleMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  metaValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },

  metaLabel: {
    color: colors.textSecondary,
    fontSize: 8,
    letterSpacing: 1,
    marginTop: 4,
  },

  progressSection: {
    marginBottom: 24,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  progressLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },

  progressCount: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },

  progressTrack: {
    height: 6,
    borderRadius: 10,
    backgroundColor:
      colors.surfaceElevated,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  progressPercentage: {
    color: colors.textSecondary,
    fontSize: 9,
    marginTop: 6,
  },

  activityCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.card,
    padding: 28,
  },

  activityTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },

  activityNumber: {
    width: 42,
    height: 32,
    borderRadius: 8,
    backgroundColor:
      colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityNumberText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },

  activityTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor:
      'rgba(69, 224, 178, 0.08)',
  },

  activityTypeText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  activityDuration: {
    color: colors.textSecondary,
    fontSize: 9,
    marginLeft: 'auto',
  },

  activityTitle: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '700',
    marginBottom: 12,
  },

  activityDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 24,
  },

  introBox: {
    padding: 20,
    borderRadius: 10,
    backgroundColor:
      colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },

  introLabel: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },

  introText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
  },

  questionSection: {
    marginTop: 8,
  },

  questionLabel: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },

  question: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 18,
  },

  options: {
    gap: 10,
  },

  option: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.surfaceElevated,
  },

  optionSelected: {
    borderColor: colors.primary,
    backgroundColor:
      'rgba(69, 224, 178, 0.08)',
  },

  optionCorrect: {
    borderColor: colors.primary,
  },

  optionIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    marginRight: 12,
  },

  optionIndicatorSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  optionText: {
    color: colors.textSecondary,
    fontSize: 12,
    flex: 1,
  },

  optionTextSelected: {
    color: colors.text,
    fontWeight: '600',
  },

  feedback: {
    marginTop: 18,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },

  feedbackCorrect: {
    borderColor: colors.primary,
    backgroundColor:
      'rgba(69, 224, 178, 0.06)',
  },

  feedbackIncorrect: {
    borderColor: colors.border,
    backgroundColor:
      colors.surfaceElevated,
  },

  feedbackTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 5,
  },

  feedbackText: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 18,
  },

  readingBox: {
    padding: 20,
    borderRadius: 10,
    backgroundColor:
      colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },

  readingLabel: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },

  readingText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
  },

  reflectionBox: {
    padding: 20,
    borderRadius: 10,
    backgroundColor:
      colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },

  reflectionPrompt: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },

  reflectionInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    color: colors.text,
    fontSize: 12,
  },

  scenarioBox: {
    padding: 20,
    borderRadius: 10,
    backgroundColor:
      colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },

  scenarioText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
  },

  scenarioExplanation: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 16,
  },

  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  previousButton: {
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.35,
  },

  previousText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },

  nextButton: {
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  nextText: {
    color: '#06100D',
    fontSize: 11,
    fontWeight: '700',
  },

  nextArrow: {
    color: '#06100D',
    fontSize: 15,
    fontWeight: '700',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },

  emptyDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 500,
  },
});