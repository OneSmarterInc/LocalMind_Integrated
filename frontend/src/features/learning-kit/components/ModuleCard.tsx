import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { ModuleItem } from '../types/module';

import { colors } from '../theme/colors';
import { theme } from '../theme/theme';

interface ModuleCardProps {
  module: ModuleItem;
  onStart: (module: ModuleItem) => void;
}

export default function ModuleCard({
  module,
  onStart,
}: ModuleCardProps) {
  return (
    <View style={styles.card}>

      {/* =========================
          TOP ROW
      ========================== */}

      <View style={styles.topRow}>

        {/* Module Icon */}

        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={module.icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={25}
            color={colors.primary}
          />
        </View>

        {/* Duration + Module Code */}

        <View style={styles.metaContainer}>

          <View style={styles.durationBadge}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={13}
              color={colors.textSecondary}
            />

            <Text style={styles.durationText}>
              {module.duration}m
            </Text>
          </View>

          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>
              {module.code}
            </Text>
          </View>

        </View>
      </View>

      {/* =========================
          TITLE
      ========================== */}

      <Text
        style={styles.title}
        numberOfLines={2}
      >
        {module.title}
      </Text>

      {/* =========================
          DESCRIPTION
      ========================== */}

      <Text
        style={styles.description}
        numberOfLines={3}
      >
        {module.description}
      </Text>

      {/* =========================
          BOTTOM ROW
      ========================== */}

      <View style={styles.bottomRow}>

        {/* Status */}

        <View style={styles.statusContainer}>

          <View
            style={[
              styles.statusDot,
              module.status === 'COMPLETED' &&
                styles.completedDot,
              module.status === 'IN_PROGRESS' &&
                styles.progressDot,
            ]}
          />

          <Text style={styles.statusText}>
            {module.status.replace('_', ' ')}
          </Text>

        </View>

        {/* Start Button */}

        <Pressable
          onPress={() => onStart(module)}
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
        >
          <Text style={styles.startButtonText}>
            {module.status === 'NOT_STARTED'
              ? 'Start Module'
              : module.status === 'IN_PROGRESS'
                ? 'Continue'
                : 'Review'}
          </Text>

          <MaterialCommunityIcons
            name="arrow-right"
            size={19}
            color="#07110E"
          />
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  /* =========================
     CARD
  ========================== */

  card: {
    width: '100%',
    minHeight: 286,

    padding: 20,

    borderRadius: 14,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    overflow: 'hidden',
  },

  /* =========================
     TOP
  ========================== */

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',

    marginBottom: 22,
  },

  iconContainer: {
    width: 46,
    height: 46,

    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.surfaceElevated,

    borderWidth: 1,
    borderColor: colors.border,
  },

  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },

  durationBadge: {
    height: 32,

    paddingHorizontal: 10,

    borderRadius: 18,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 5,

    borderWidth: 1,
    borderColor: colors.border,

    backgroundColor: colors.background,
  },

  durationText: {
    color: colors.textSecondary,

    fontSize: 11,
    fontWeight: '600',
  },

  codeBadge: {
    height: 32,

    paddingHorizontal: 11,

    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.surfaceElevated,
  },

  codeText: {
    color: colors.textSecondary,

    fontSize: 10,
    fontWeight: '700',
  },

  /* =========================
     TITLE
  ========================== */

  title: {
    color: colors.text,

    fontSize: 19,
    fontWeight: '700',

    lineHeight: 25,

    marginBottom: 10,
  },

  /* =========================
     DESCRIPTION
  ========================== */

  description: {
    color: colors.textSecondary,

    fontSize: 13,
    lineHeight: 20,

    maxWidth: 500,

    marginBottom: 25,
  },

  /* =========================
     BOTTOM
  ========================== */

  bottomRow: {
    marginTop: 'auto',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 12,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: '#66716D',
  },

  progressDot: {
    backgroundColor: colors.primary,
  },

  completedDot: {
    backgroundColor: colors.primary,
  },

  statusText: {
    color: colors.textSecondary,

    fontSize: 10,
    fontWeight: '600',

    letterSpacing: 0.4,
  },

  /* =========================
     START BUTTON
  ========================== */

  startButton: {
    minHeight: 44,

    paddingHorizontal: 17,

    borderRadius: 7,

    backgroundColor: colors.primary,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,
  },

  startButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  startButtonText: {
    color: '#07110E',

    fontSize: 11,
    fontWeight: '700',
  },
});