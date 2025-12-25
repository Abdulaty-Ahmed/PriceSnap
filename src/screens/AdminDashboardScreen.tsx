import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, LoadingSpinner } from '../components';
import { useAuthStore } from '../store';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import * as adminService from '../services/adminService';

interface DatabaseStats {
  users: number;
  products: number;
  stores: number;
  receipts: number;
  searchLogs: number;
}

export const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { logout } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DatabaseStats>({
    users: 0,
    products: 0,
    stores: 0,
    receipts: 0,
    searchLogs: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Call Cloud Function to get stats
      const fetchedStats = await adminService.getFirestoreStats();
      
      setStats({
        users: fetchedStats.users || 0,
        products: fetchedStats.products || 0,
        stores: fetchedStats.stores || 0,
        receipts: fetchedStats.receipts || 0,
        searchLogs: fetchedStats.searchLogs || 0,
      });
    } catch (error: any) {
      console.error('Error loading stats:', error);
      Alert.alert('Error', error.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDatabase = () => {
    Alert.alert(
      'Reset Database',
      'This will delete ALL products, stores, receipts, and search logs. Users will be preserved. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              // Call Cloud Function to reset database
              await adminService.resetDatabase();
              
              Alert.alert('Success', 'Database reset successfully (users preserved)');
              await loadStats();
            } catch (error: any) {
              console.error('Error resetting database:', error);
              Alert.alert('Error', error.message || 'Failed to reset database');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleViewCollection = (collectionName: string) => {
    navigation.navigate('DatabaseManagement', { collection: collectionName });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>⚙️</Text>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Database Management & Statistics</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="👥"
            label="Users"
            value={stats.users}
            color={colors.primary}
            onPress={() => handleViewCollection('users')}
          />
          <StatCard
            icon="📦"
            label="Products"
            value={stats.products}
            color={colors.secondary}
            onPress={() => handleViewCollection('products')}
          />
          <StatCard
            icon="🏪"
            label="Stores"
            value={stats.stores}
            color={colors.success}
            onPress={() => handleViewCollection('stores')}
          />
          <StatCard
            icon="🧾"
            label="Receipts"
            value={stats.receipts}
            color={colors.warning}
            onPress={() => handleViewCollection('receipts')}
          />
          <StatCard
            icon="🔍"
            label="Searches"
            value={stats.searchLogs}
            color={colors.error}
            onPress={() => handleViewCollection('searchLogs')}
          />
        </View>

        <View style={styles.actions}>
          <Text style={styles.sectionTitle}>Database Actions</Text>
          
          <Button
            title="🔄 Refresh Stats"
            onPress={loadStats}
            variant="outline"
            style={styles.actionButton}
          />

          <Button
            title="🗑️ Reset Database"
            onPress={handleResetDatabase}
            variant="outline"
            style={styles.actionButton}
          />

          <Button
            title="🚪 Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  color: string;
  onPress: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, onPress }) => {
  return (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <Text style={styles.statIcon}>{icon}</Text>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  statsGrid: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderLeftWidth: 4,
    ...shadows.small,
  },
  statIcon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actions: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
});

