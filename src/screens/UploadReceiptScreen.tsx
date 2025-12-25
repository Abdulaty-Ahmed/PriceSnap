import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Input, LoadingSpinner } from '../components';
import { useAuthStore, useUploadStore } from '../store';
import * as cameraService from '../services/cameraService';
import * as storageService from '../services/storageService';
import { parseReceiptOCR } from '../services/receiptService';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { ERROR_MESSAGES } from '../constants';

export const UploadReceiptScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const {
    imageUri,
    storeName,
    storeLocation,
    setImageUri,
    setStoreName,
    getCurrentLocation,
    clearForm,
  } = useUploadStore();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapturePhoto = async () => {
    const uri = await cameraService.capturePhoto();
    if (uri) {
      setImageUri(uri);
      setError(null);
    }
  };

  const handlePickImage = async () => {
    const uri = await cameraService.pickImage();
    if (uri) {
      setImageUri(uri);
      setError(null);
    }
  };

  const handleGetLocation = async () => {
    await getCurrentLocation();
  };

  const handleUpload = async () => {
    // Validation
    if (!imageUri) {
      setError('Please select an image');
      return;
    }

    if (!storeName.trim()) {
      setError('Please enter store name');
      return;
    }

    if (!storeLocation) {
      setError('Please enable location');
      return;
    }

    if (!user) {
      setError('User not authenticated');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Upload image to Firebase Storage
      const imageUrl = await storageService.uploadReceiptImage(imageUri, user.userId);

      // 2. Call Cloud Function to parse receipt (OCR only)
      const parseResult = await parseReceiptOCR(imageUrl);

      // 3. Navigate to review screen
      navigation.navigate('ReviewReceipt', {
        imageUrl,
        storeName: storeName.trim(),
        storeLocation,
        products: parseResult.products,
        ocrText: parseResult.ocrText,
      });

      // Clear form for next upload
      clearForm();
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || ERROR_MESSAGES.UPLOAD.FAILED);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Upload Receipt</Text>
        <Text style={styles.subtitle}>
          Scan or upload a receipt to add products
        </Text>

        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderIcon}>📷</Text>
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonRow}>
          <Button
            title="📸 Camera"
            onPress={handleCapturePhoto}
            variant="secondary"
            style={styles.halfButton}
          />
          <Button
            title="🖼️ Gallery"
            onPress={handlePickImage}
            variant="secondary"
            style={styles.halfButton}
          />
        </View>

        <Input
          label="Store Name"
          value={storeName}
          onChangeText={setStoreName}
          placeholder="Enter store name"
        />

        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Location</Text>
          {storeLocation ? (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                ✓ Location captured{'\n'}
                Lat: {storeLocation.latitude.toFixed(4)}, Lng:{' '}
                {storeLocation.longitude.toFixed(4)}
              </Text>
            </View>
          ) : (
            <Text style={styles.locationWarning}>Location not set</Text>
          )}
          <Button
            title="📍 Get Current Location"
            onPress={handleGetLocation}
            variant="outline"
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {uploading ? (
          <LoadingSpinner message="Processing receipt..." />
        ) : (
          <Button
            title="Upload & Process"
            onPress={handleUpload}
            disabled={!imageUri || !storeName || !storeLocation}
          />
        )}
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
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  placeholderText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  halfButton: {
    flex: 1,
  },
  locationContainer: {
    marginBottom: spacing.lg,
  },
  locationLabel: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  locationInfo: {
    backgroundColor: colors.success + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  locationText: {
    ...typography.bodySmall,
    color: colors.success,
  },
  locationWarning: {
    ...typography.bodySmall,
    color: colors.warning,
    marginBottom: spacing.sm,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
});

