import React from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import { colors } from '../theme/colors';
import { theme } from '../theme/theme';

interface ResponsiveLayoutProps {
  sidebar: React.ReactNode;
  topBar: React.ReactNode;
  children: React.ReactNode;
}

export default function ResponsiveLayout({
  sidebar,
  topBar,
  children,
}: ResponsiveLayoutProps) {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  return (
    <View style={styles.container}>
      {!isMobile && sidebar}

      <View style={styles.main}>
        {topBar}

        <View style={styles.content}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },

  main: {
    flex: 1,
    minWidth: 0,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.xl,
  },
});