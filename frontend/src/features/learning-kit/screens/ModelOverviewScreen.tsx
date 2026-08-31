import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { ModuleItem } from '../types/module';

import { colors } from '../theme/colors';
import { theme } from '../theme/theme';

interface ModelOverviewScreenProps {
  module: ModuleItem;
  onBack: () => void;
  onBeginLearning: (module: ModuleItem) => void;
}

export default function ModelOverviewScreen({
  module,
  onBack,
  onBeginLearning,
}: ModelOverviewScreenProps) {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const activities = module.activities ?? [];

  const completedActivities = activities.filter(
    activity => activity.completed === true,
  ).length;

  const activityCount = activities.length;

  const calculatedProgress =
    activityCount > 0
      ? Math.round(
          (completedActivities / activityCount) * 100,
        )
      : module.progress;

  const progress = Math.max(
    0,
    Math.min(100, calculatedProgress),
  );

  const statusLabel =
    module.status === 'COMPLETED'
      ? 'Completed'
      : module.status === 'IN_PROGRESS'
        ? 'In Progress'
        : 'Not Started';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.container,
        isMobile && styles.mobileContainer,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Back */}

      <Pressable
        onPress={onBack}
        style={styles.backButton}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={17}
          color={colors.textSecondary}
        />

        <Text style={styles.backText}>
          Back to Modules
        </Text>
      </Pressable>

      {/* Header */}

      <View
        style={[
          styles.header,
          isMobile && styles.mobileHeader,
        ]}
      >
        <View style={styles.iconBox}>
          <MaterialCommunityIcons
            name={module.icon as any}
            size={30}
            color={colors.primary}
          />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.code}>
            {module.code}
          </Text>

          <Text style={styles.title}>
            {module.title}
          </Text>

          <Text style={styles.description}>
            {module.description}
          </Text>
        </View>
      </View>

      {/* Metadata */}

      <View
        style={[
          styles.metaRow,
          isMobile && styles.mobileMetaRow,
        ]}
      >
        <MetaCard
          label="DIFFICULTY"
          value={module.difficulty}
        />

        <MetaCard
          label="DURATION"
          value={`${module.duration} min`}
        />

        <MetaCard
          label="CATEGORY"
          value={module.category}
        />

        <MetaCard
          label="PROGRESS"
          value={`${progress}%`}
        />
      </View>

      {/* Progress */}

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Module Progress
            </Text>

            <Text style={styles.progressStatus}>
              {statusLabel}
            </Text>
          </View>

          <Text style={styles.progressValue}>
            {progress}%
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` },
            ]}
          />
        </View>
      </View>

      {/* Overview */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Module Overview
        </Text>

        <Text style={styles.sectionText}>
          {module.description}
        </Text>
      </View>

      {/* Activities */}

      {activityCount > 0 && (
        <View style={styles.section}>
          <View style={styles.activityHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Learning Activities
              </Text>

              <Text style={styles.sectionText}>
                Complete the activities below to finish
                this module.
              </Text>
            </View>

            <Text style={styles.activityCount}>
              {completedActivities}/{activityCount}
            </Text>
          </View>

          <View style={styles.activityList}>
            {activities.map(
              (activity, index) => {
                const completed =
                  activity.completed === true;

                return (
                  <View
                    key={activity.id}
                    style={styles.activityRow}
                  >
                    <View
                      style={[
                        styles.activityNumber,
                        completed &&
                          styles.activityNumberCompleted,
                      ]}
                    >
                      {completed ? (
                        <MaterialCommunityIcons
                          name="check"
                          size={16}
                          color={colors.background}
                        />
                      ) : (
                        <Text
                          style={
                            styles.activityNumberText
                          }
                        >
                          {index + 1}
                        </Text>
                      )}
                    </View>

                    <View
                      style={styles.activityContent}
                    >
                      <Text
                        style={
                          styles.activityTitle
                        }
                      >
                        {activity.title}
                      </Text>

                      {activity.description && (
                        <Text
                          style={
                            styles.activityDescription
                          }
                        >
                          {activity.description}
                        </Text>
                      )}
                    </View>

                    {activity.duration !==
                      undefined && (
                      <Text
                        style={
                          styles.activityDuration
                        }
                      >
                        {activity.duration} min
                      </Text>
                    )}
                  </View>
                );
              },
            )}
          </View>
        </View>
      )}

      {/* Action */}

      <View
        style={[
          styles.actionCard,
          isMobile && styles.mobileActionCard,
        ]}
      >
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>
            {module.status === 'IN_PROGRESS'
              ? 'Continue learning'
              : module.status === 'COMPLETED'
                ? 'Review this module'
                : 'Ready to begin?'}
          </Text>

          <Text style={styles.actionDescription}>
            {module.status === 'IN_PROGRESS'
              ? 'Continue where you left off and complete the remaining activities.'
              : module.status === 'COMPLETED'
                ? 'Review the learning activities and refresh your knowledge.'
                : 'Start this module and work through the learning activities at your own pace.'}
          </Text>
        </View>

        <Pressable
          onPress={() =>
            onBeginLearning(module)
          }
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
            isMobile && styles.mobileStartButton,
          ]}
        >
          <Text style={styles.startButtonText}>
            {module.status === 'IN_PROGRESS'
              ? 'Continue Learning'
              : module.status === 'COMPLETED'
                ? 'Review Module'
                : 'Begin Learning'}
          </Text>

          <MaterialCommunityIcons
            name="arrow-right"
            size={19}
            color={colors.background}
          />
        </Pressable>
      </View>
    </ScrollView>
  );
}

/*
 * Metadata card
 */

interface MetaCardProps {
  label: string;
  value: string;
}

function MetaCard({
  label,
  value,
}: MetaCardProps) {
  return (
    <View style={styles.metaCard}>
      <Text style={styles.metaLabel}>
        {label}
      </Text>

      <Text style={styles.metaValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 28,
    paddingBottom: 60,
  },

  mobileContainer: {
    padding: 18,
  },

  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 28,
  },

  backText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 28,
  },

  mobileHeader: {
    flexDirection: 'column',
  },

  iconBox: {
    width: 68,
    height: 68,
    borderRadius: theme.radius.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    marginBottom: 14,
  },

  headerText: {
    flex: 1,
  },

  code: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    maxWidth: 760,
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },

  mobileMetaRow: {
    flexDirection: 'column',
  },

  metaCard: {
    flex: 1,
    minWidth: 130,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.radius.md,
    padding: 16,
  },

  metaLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },

  metaValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },

  progressCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.radius.md,
    padding: 20,
    marginBottom: 18,
  },

  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },

  progressStatus: {
    color: colors.textSecondary,
    fontSize: 11,
  },

  progressValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
  },

  progressTrack: {
    height: 7,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.surfaceElevated,
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: colors.primary,
  },

  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.radius.md,
    padding: 22,
    marginBottom: 18,
  },

  sectionText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
  },

  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  activityCount: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },

  activityList: {
    gap: 10,
  },

  activityRow: {
    minHeight: 68,
    padding: 12,
    borderRadius: theme.radius.sm,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },

  activityNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  activityNumberCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  activityNumberText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },

  activityDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
  },

  activityDuration: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 10,
  },

  actionCard: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.radius.md,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },

  mobileActionCard: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  actionText: {
    flex: 1,
  },

  actionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 7,
  },

  actionDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
  },

  startButton: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: theme.radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  mobileStartButton: {
    width: '100%',
  },

  startButtonPressed: {
    opacity: 0.8,
  },

  startButtonText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '800',
  },
});