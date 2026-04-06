import { Platform } from 'react-native';

const fontFamily = {
  regular: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  medium: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  bold: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
};

export const typography = {
  // Display
  displayLarge: {
    fontSize: 36,
    fontWeight: '800' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },

  // Headlines
  h1: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },

  // Body
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },

  // Labels
  labelLarge: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },

  // Brand
  brandTitle: {
    fontSize: 32,
    fontWeight: '900' as const,
    letterSpacing: 4,
    textTransform: 'uppercase' as const,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 6,
    textTransform: 'uppercase' as const,
  },
};
