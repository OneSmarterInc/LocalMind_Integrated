import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import type { ModuleItem } from '../types/module';
import type { QuizResult } from '../../../context/CourseContext';
import { colors } from '../theme/colors';
import { theme } from '../theme/theme';
import { useIsFocused } from '@react-navigation/native';
import { API_URL } from '../../../services/api';

type QuizScreenProps = {
  module: ModuleItem | null;
  onComplete: (result: QuizResult) => void;
};

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};

export default function QuizScreen({
  module,
  onComplete,
}: QuizScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [answers, setAnswers] = useState<
    Record<string, string>
  >({});

  // Prevent the completion callback from firing twice because of a rapid double tap.
  const completionSent = useRef(false);

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [apiQuestions, setApiQuestions] = useState<QuizQuestion[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!module?.id || !isFocused) return;
    let active = true;

    const loadAssessment = async () => {
      setLoading(true);
      setErrorText(null);
      setAssessmentId(null);
      setApiQuestions([]);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setAnswers({});
      completionSent.current = false;

      try {
        const response = await fetch(`${API_URL}/learning/assessment/generate/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            micro_module_id: module.id,
            num_mcqs: 6,
            num_subjective: 0,
            pass_percentage: 65
          })
        });

        if (!response.ok) throw new Error("Failed to load textbook quiz.");
        const data = await response.json();

        if (active) {
          setAssessmentId(data.id);
          const formatted = (data.questions_for_student || []).map((q: any) => ({
            id: q.id,
            question: q.question,
            options: (q.options || []).map((opt: any) => opt.text),
            correctAnswer: "",
            explanation: ""
          }));
          setApiQuestions(formatted);
        }
      } catch (err: any) {
        console.error("Quiz load error:", err);
        if (active) {
          setErrorText(err.message || "Could not retrieve assessment details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAssessment();

    return () => {
      active = false;
    };
  }, [module?.id, isFocused]);

  const questions = apiQuestions;

  /*
   * No module.
   */
  if (!module) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          No Module Selected
        </Text>

        <Text style={styles.emptyText}>
          Please select a module before starting the quiz.
        </Text>
      </View>
    );
  }

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 12 }} />
        <Text style={styles.loadingText}>Generating your personalized quiz...</Text>
      </View>
    );
  }

  /*
   * No questions.
   */
  if (questions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          No Quiz Available
        </Text>

        <Text style={styles.emptyText}>
          This module does not currently contain quiz
          questions.
        </Text>

        <Pressable
          onPress={() => onComplete({
            answers: [],
            correct: 0,
            incorrect: 0,
            total: 0,
            accuracy: 0,
          })}
          style={styles.completeButton}
        >
          <Text style={styles.completeButtonText}>
            Complete Quiz
          </Text>
        </Pressable>
      </View>
    );
  }

  const currentQuestion =
    questions[currentQuestionIndex];

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isEndOfFirstSet = currentQuestionIndex === 2 && questions.length > 3;
  const currentSet = currentQuestionIndex < 3 ? 1 : 2;

  const quizProgress =
    ((currentQuestionIndex + 1) /
      questions.length) *
    100;

  /*
   * Select answer.
   */
  const handleSelectAnswer = (
    answer: string,
  ) => {
    setSelectedAnswer(answer);

    setAnswers(previous => ({
      ...previous,
      [currentQuestion.id]: answer,
    }));
  };

  /*
   * NEXT / CONTINUE / COMPLETE QUIZ
   */
  const handleNext = async () => {
    if (!selectedAnswer) {
      return;
    }

    if (isEndOfFirstSet) {
      setCurrentQuestionIndex(3);
      setSelectedAnswer(answers[questions[3]?.id] ?? null);
      return;
    }

    if (isLastQuestion) {
      const finalAnswers = {
        ...answers,
        [currentQuestion.id]: selectedAnswer,
      };

      const formattedAnswers: Record<string, string> = {};
      questions.forEach((q) => {
        const selected = finalAnswers[q.id] || "";
        const idx = q.options.indexOf(selected);
        const key = idx >= 0 ? ["A", "B", "C", "D"][idx] : "";
        formattedAnswers[q.id] = key;
      });

      if (completionSent.current) {
        return;
      }
      completionSent.current = true;
      setLoading(true);

      try {
        const submitResponse = await fetch(`${API_URL}/learning/assessment/${assessmentId}/submit/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submitted_answers: formattedAnswers })
        });

        if (!submitResponse.ok) throw new Error("Failed to submit answers to server.");
        const attempt = await submitResponse.json();

        const result: QuizResult = {
          answers: (attempt.detailed_results || []).map((res: any) => ({
            questionId: res.question_id,
            question: res.question,
            selectedAnswer: res.selected_option,
            correctAnswer: res.correct_option,
            isCorrect: res.is_correct,
            explanation: res.explanation || ""
          })),
          correct: attempt.score,
          incorrect: attempt.total_questions - attempt.score,
          total: attempt.total_questions,
          accuracy: Math.round(attempt.percentage),
        };

        console.log('Quiz completed via API:', module.id, result);
        onComplete(result);
      } catch (err) {
        console.error("Submission failed:", err);
        completionSent.current = false;
      } finally {
        setLoading(false);
      }
      return;
    }

    setCurrentQuestionIndex((previous) => previous + 1);
    setSelectedAnswer(answers[questions[currentQuestionIndex + 1]?.id] ?? null);
  };

  /*
   * PREVIOUS
   */
  const handlePrevious = () => {
    if (currentQuestionIndex === 0) {
      return;
    }

    const previousIndex =
      currentQuestionIndex - 1;

    const previousQuestion =
      questions[previousIndex];

    setCurrentQuestionIndex(
      previousIndex,
    );

    setSelectedAnswer(
      answers[previousQuestion.id] ?? null,
    );
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptyText, { marginTop: 15 }]}>Generating textbook assessment via local AI...</Text>
        </View>
      </View>
    );
  }

  if (errorText) {
    return (
      <View style={styles.screen}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Assessment Unavailable</Text>
          <Text style={styles.emptyText}>{errorText}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            MODULE QUIZ
          </Text>

          <Text style={styles.title}>
            {module.title}
          </Text>

          <Text style={styles.description}>
            Test your understanding of the concepts
            covered in this module.
          </Text>
        </View>

        {/* PROGRESS */}

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              QUIZ PROGRESS
            </Text>

            <Text style={styles.progressCount}>
              {currentQuestionIndex + 1} /{' '}
              {questions.length}
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${quizProgress}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.setLabel}>
            {currentSet === 1 ? 'QUIZ SET 1 • QUESTIONS 1–3' : 'QUIZ SET 2 • QUESTIONS 4–6'}
          </Text>
        </View>

        {/* QUESTION CARD */}

        <View style={styles.questionCard}>
          <View style={styles.questionMeta}>
            <View style={styles.questionNumber}>
              <Text style={styles.questionNumberText}>
                {String(
                  currentQuestionIndex + 1,
                ).padStart(2, '0')}
              </Text>
            </View>

            <View>
              <Text style={styles.questionLabel}>
                QUESTION
              </Text>

              <Text style={styles.questionCount}>
                {currentQuestionIndex + 1} of{' '}
                {questions.length}
              </Text>
            </View>
          </View>

          <Text style={styles.question}>
            {currentQuestion.question}
          </Text>

          {/* OPTIONS */}

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map(
              (
                option,
                index,
              ) => {
                const isSelected =
                  selectedAnswer === option;

                return (
                  <Pressable
                    key={`${option}-${index}`}
                    onPress={() =>
                      handleSelectAnswer(
                        option,
                      )
                    }
                    style={[
                      styles.option,
                      isSelected &&
                        styles.optionSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.optionCircle,
                        isSelected &&
                          styles.optionCircleSelected,
                      ]}
                    >
                      {isSelected && (
                        <View
                          style={
                            styles.optionDot
                          }
                        />
                      )}
                    </View>

                    <Text
                      style={[
                        styles.optionText,
                        isSelected &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </View>

          {/* ANSWER STATUS */}

          {!selectedAnswer && (
            <Text style={styles.answerHint}>
              Select an answer to continue.
            </Text>
          )}

          {selectedAnswer && (
            <View style={styles.selectedStatus}>
              <Text
                style={
                  styles.selectedStatusText
                }
              >
                Answer selected
              </Text>
            </View>
          )}
        </View>

        {/* NAVIGATION */}

        <View style={styles.navigationRow}>
          <Pressable
            onPress={handlePrevious}
            disabled={
              currentQuestionIndex === 0
            }
            style={[
              styles.previousButton,
              currentQuestionIndex === 0 &&
                styles.disabledButton,
            ]}
          >
            <Text style={styles.previousText}>
              ← Previous
            </Text>
          </Pressable>

          <Pressable
            onPress={handleNext}
            disabled={!selectedAnswer}
            style={[
              styles.nextButton,
              !selectedAnswer &&
                styles.disabledButton,
            ]}
          >
            <Text style={styles.nextText}>
              {isLastQuestion ? 'Complete Quiz' : isEndOfFirstSet ? 'Continue →' : 'Next →'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

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

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 14,
    maxWidth: 500,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 500,
  },

  completeButton: {
    marginTop: 22,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
  },

  completeButtonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '900',
  },

  header: {
    marginBottom: 28,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 7,
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
  },

  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },

  progressSection: {
    marginBottom: 24,
  },

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

  progressCount: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
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
    borderRadius: 10,
    backgroundColor: colors.primary,
  },

  setLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 9,
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
    backgroundColor:
      colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },

  questionNumberText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },

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

  optionsContainer: {
    gap: 10,
  },

  option: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor:
      colors.surfaceElevated,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  optionSelected: {
    borderColor: colors.primary,
  },

  optionCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionCircleSelected: {
    borderColor: colors.primary,
  },

  optionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  optionText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  optionTextSelected: {
    color: colors.text,
    fontWeight: '700',
  },

  answerHint: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 16,
  },

  selectedStatus: {
    marginTop: 16,
  },

  selectedStatusText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },

  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
  },

  previousButton: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  previousText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
  },

  nextButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '900',
  },

  disabledButton: {
    opacity: 0.35,
  },
});