import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Input } from '../components';
import { useAuthStore } from '../store';
import { colors, spacing, typography } from '../constants/theme';

export const AdminLoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { loginAsAdmin, loading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    clearError();

    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await loginAsAdmin(email, password);
      // Navigation will be handled automatically by auth state change
    } catch (err) {
      // Error is already set in the store
      Alert.alert('Error', 'Invalid admin credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>🔐</Text>
          <Text style={styles.title}>Admin Access</Text>
          <Text style={styles.subtitle}>Enter admin credentials</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Admin Email"
            value={email}
            onChangeText={setEmail}
            placeholder="admin@pricesnap.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Admin Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter admin password"
            secureTextEntry
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Sign In as Admin"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          />

          <Button
            title="Back to User Login"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
            style={styles.button}
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📝 Setup Instructions:</Text>
            <Text style={styles.infoText}>
              1. First, go back and Register with:{'\n'}
              Email: admin@pricesnap.com{'\n'}
              Password: Admin123!{'\n'}
              Name: Administrator{'\n\n'}
              2. Then return here and login{'\n\n'}
              (One-time setup)
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
  infoBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

