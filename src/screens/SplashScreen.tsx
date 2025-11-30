import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LoadingSpinner } from '../components';
import { colors, spacing, typography } from '../constants/theme';
import { APP_CONFIG } from '../constants';

export const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>📱</Text>
      <Text style={styles.title}>{APP_CONFIG.NAME}</Text>
      <Text style={styles.subtitle}>Smart Market Price Comparison</Text>
      <LoadingSpinner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.surface,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.surface,
    marginBottom: spacing.xl,
  },
});

