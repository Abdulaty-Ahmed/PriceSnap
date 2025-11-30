import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore, useSearchStore } from '../store';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { APP_CONFIG } from '../constants';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { updateUserLocation } = useSearchStore();

  useEffect(() => {
    // Update user location on mount
    updateUserLocation();
  }, []);

  const features = [
    {
      icon: '📸',
      title: 'Scan Receipt',
      description: 'Capture and upload receipts',
      onPress: () => navigation.navigate('Upload'),
    },
    {
      icon: '🔍',
      title: 'Search Products',
      description: 'Find best prices nearby',
      onPress: () => navigation.navigate('Search'),
    },
    {
      icon: '👤',
      title: 'Profile',
      description: 'Manage your account',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.displayName}! 👋</Text>
          <Text style={styles.subtitle}>What would you like to do today?</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureCard}
              onPress={feature.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 How it works</Text>
          <Text style={styles.infoText}>
            1. Scan your shopping receipts{'\n'}
            2. We extract product names and prices{'\n'}
            3. Search for any product{'\n'}
            4. Find the cheapest price nearby
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {APP_CONFIG.AUTHOR.NAME} - {APP_CONFIG.AUTHOR.STUDENT_ID}
          </Text>
          <Text style={styles.footerText}>{APP_CONFIG.AUTHOR.COURSE}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  featuresContainer: {
    marginBottom: spacing.xl,
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadows.medium,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  featureTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  infoTitle: {
    ...typography.h3,
    color: colors.surface,
    marginBottom: spacing.md,
  },
  infoText: {
    ...typography.body,
    color: colors.surface,
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

