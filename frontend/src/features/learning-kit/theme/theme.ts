import Card from '../components/Card';
import { colors } from './colors';

export const theme = {
  colors,

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
  },

  radius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    card: 16,
    pill: 999,
  },

  sidebar: {
    width: 190,
  },

  topBar: {
    height: 58,
  },

  maxContentWidth: 1200,
};

export type Theme = typeof theme;