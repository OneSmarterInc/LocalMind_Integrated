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

interface ModuleCardProps {
  module: ModuleItem;
  onStart: (module: ModuleItem) => void;
  locked?: boolean;
}

export default function ModuleCard({
  module,
  onStart,
  locked,
}: ModuleCardProps) {
  return (
    <View style={[styles.card, locked && { opacity: 0.55 }]}>

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

        {/* Start Button */}

        <Pressable
          onPress={() => !locked && onStart(module)}
          disabled={locked}
          style={({ pressed }) => [
            styles.startButton,
            locked && styles.startButtonLocked,
            !locked && pressed && styles.startButtonPressed,
          ]}
        >
          <Text style={[styles.startButtonText, locked && styles.startButtonTextLocked]}>
            {locked
              ? 'Locked'
              : module.status === 'NEEDS_REVIEW'
                ? 'Revisit Module'
                : module.status === 'NOT_STARTED'
                  ? 'Start Module'
                  : module.status === 'IN_PROGRESS'
                    ? 'Continue'
                    : 'Review'}
          </Text>

          <MaterialCommunityIcons
            name={locked ? "lock" : "arrow-right"}
            size={19}
            color={locked ? "#A7B2BA" : "#07110E"}
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
    justifyContent: 'flex-end',

    gap: 12,
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

  startButtonLocked: {
    backgroundColor: '#1E2A34',
    borderColor: '#263747',
    borderWidth: 1,
  },

  startButtonTextLocked: {
    color: '#A7B2BA',
  },
});