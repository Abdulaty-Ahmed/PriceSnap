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
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Button, LoadingSpinner } from '../components';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import * as adminService from '../services/adminService';

type DatabaseManagementRouteProp = RouteProp<
  { DatabaseManagement: { collection: string } },
  'DatabaseManagement'
>;

export const DatabaseManagementScreen: React.FC = () => {
  const route = useRoute<DatabaseManagementRouteProp>();
  const navigation = useNavigation();
  const { collection: collectionName } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    loadDocuments();
  }, [collectionName]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await adminService.getCollectionData(collectionName);
      setDocuments(docs);
    } catch (error: any) {
      console.error('Error loading documents:', error);
      Alert.alert('Error', error.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.deleteDocument(collectionName, docId);
              Alert.alert('Success', 'Document deleted');
              await loadDocuments();
            } catch (error: any) {
              console.error('Error deleting document:', error);
              Alert.alert('Error', error.message || 'Failed to delete document');
            }
          },
        },
      ]
    );
  };

  const handleBackup = () => {
    const dataJSON = JSON.stringify(documents, null, 2);
    Alert.alert(
      'Backup Data',
      `${documents.length} documents ready for backup.\n\nData has been logged to console.`,
      [{ text: 'OK' }]
    );
    console.log(`Backup of ${collectionName}:`, dataJSON);
  };

  if (loading) {
    return <LoadingSpinner fullScreen message={`Loading ${collectionName}...`} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{collectionName}</Text>
          <Text style={styles.subtitle}>
            {documents.length} {documents.length === 1 ? 'document' : 'documents'}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="🔄 Refresh"
            onPress={loadDocuments}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="💾 Backup to Console"
            onPress={handleBackup}
            variant="outline"
            style={styles.actionButton}
          />
        </View>

        <View style={styles.documentsList}>
          {documents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No documents found</Text>
            </View>
          ) : (
            documents.map((document) => (
              <View key={document.id} style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <Text style={styles.documentId} numberOfLines={1}>
                    ID: {document.id}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteDocument(document.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.documentContent}>
                  {Object.entries(document).map(([key, value]) => {
                    if (key === 'id') return null;
                    
                    let displayValue = String(value);
                    if (typeof value === 'object' && value !== null) {
                      displayValue = JSON.stringify(value);
                    }
                    
                    return (
                      <View key={key} style={styles.documentField}>
                        <Text style={styles.fieldKey}>{key}:</Text>
                        <Text style={styles.fieldValue} numberOfLines={2}>
                          {displayValue}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))
          )}
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
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
    textTransform: 'capitalize',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  documentsList: {
    gap: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  documentCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  documentId: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  documentContent: {
    gap: spacing.sm,
  },
  documentField: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fieldKey: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
    minWidth: 100,
  },
  fieldValue: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
  },
});

