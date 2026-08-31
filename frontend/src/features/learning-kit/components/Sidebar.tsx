import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

import { colors } from '../theme/colors';
import { theme } from '../theme/theme';

import type { ScreenName } from '../types/navigation';

interface SidebarProps {
  activeItem: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export default function Sidebar({
  activeItem,
  onNavigate,
}: SidebarProps) {
  const items: {
    label: string;
    screen: ScreenName;
  }[] = [
    {
      label: 'Dashboard',
      screen: 'Dashboard',
    },
    {
      label: 'Modules',
      screen: 'Modules',
    },
    {
      label: 'Doubts',
      screen: 'Doubt',
    },
    {
      label: 'Progress',
      screen: 'Progress',
    },
  ];

  return (
    <View style={styles.sidebar}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>
          CYBERGUARD
        </Text>

        <Text style={styles.logoSubtitle}>
          SECURITY LEARNING
        </Text>
      </View>

      <View style={styles.navigation}>
        {items.map(item => {
          const isActive =
            activeItem === item.screen;

          return (
            <Pressable
              key={item.screen}
              onPress={() =>
                onNavigate(item.screen)
              }
              style={[
                styles.navItem,
                isActive &&
                  styles.navItemActive,
              ]}
            >
              <Text
                style={[
                  styles.navText,
                  isActive &&
                    styles.navTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingVertical: 24,
    paddingHorizontal: 14,
  },

  logoContainer: {
    paddingHorizontal: 12,
    marginBottom: 35,
  },

  logo: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  logoSubtitle: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
  },

  navigation: {
    gap: 6,
  },

  navItem: {
    minHeight: 44,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },

  navItemActive: {
    backgroundColor:
      colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  navText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },

  navTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});