import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Button, LoadingSpinner } from '../components';
import { processReceipt } from '../services/receiptService';
import { useAuthStore } from '../store';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

type ReviewReceiptRouteProp = RouteProp<
  {
    ReviewReceipt: {
      imageUrl: string;
      storeName: string;
      storeLocation: { latitude: number; longitude: number };
      products: Array<{ name: string; price: number }>;
      ocrText: string;
    };
  },
  'ReviewReceipt'
>;

interface EditableProduct {
  id: string;
  name: string;
  price: string;
}

export const ReviewReceiptScreen: React.FC = () => {
  const route = useRoute<ReviewReceiptRouteProp>();
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  
  const { imageUrl, storeName, storeLocation, products: initialProducts, ocrText } = route.params;

  // Convert products to editable format with unique IDs
  const [products, setProducts] = useState<EditableProduct[]>(
    initialProducts.map((p, index) => ({
      id: `product-${index}`,
      name: p.name,
      price: p.price.toFixed(2),
    }))
  );

  const [loading, setLoading] = useState(false);

  const handleUpdateProduct = (id: string, field: 'name' | 'price', value: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleDeleteProduct = (id: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to remove this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProducts((prev) => prev.filter((p) => p.id !== id));
          },
        },
      ]
    );
  };

  const handleAddProduct = () => {
    const newId = `product-${Date.now()}`;
    setProducts((prev) => [
      ...prev,
      { id: newId, name: '', price: '0.00' },
    ]);
  };

  const handleConfirm = async () => {
    // Validate products
    const validProducts = products.filter((p) => p.name.trim().length > 0);
    
    if (validProducts.length === 0) {
      Alert.alert('No Products', 'Please add at least one product before confirming.');
      return;
    }

    // Check for invalid prices
    const hasInvalidPrice = validProducts.some((p) => {
      const price = parseFloat(p.price);
      return isNaN(price) || price <= 0;
    });

    if (hasInvalidPrice) {
      Alert.alert('Invalid Price', 'Please ensure all products have valid prices greater than 0.');
      return;
    }

    try {
      setLoading(true);

      // Convert products back to API format
      const confirmedProducts = validProducts.map((p) => ({
        name: p.name.trim(),
        price: parseFloat(p.price),
      }));

      await processReceipt(
        imageUrl,
        storeName,
        storeLocation,
        user!.userId,
        confirmedProducts,
        ocrText
      );

      Alert.alert(
        'Success',
        'Receipt uploaded successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Main'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload receipt');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Saving receipt..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Review Products</Text>
          <Text style={styles.subtitle}>
            Check and edit the detected products below
          </Text>
        </View>

        <View style={styles.storeInfo}>
          <Text style={styles.storeLabel}>Store:</Text>
          <Text style={styles.storeName}>{storeName}</Text>
        </View>

        <View style={styles.productsContainer}>
          {products.map((product, index) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <Text style={styles.productNumber}>#{index + 1}</Text>
                <TouchableOpacity
                  onPress={() => handleDeleteProduct(product.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                  style={styles.input}
                  value={product.name}
                  onChangeText={(value) =>
                    handleUpdateProduct(product.id, 'name', value)
                  }
                  placeholder="Enter product name"
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Price (₺)</Text>
                <TextInput
                  style={styles.input}
                  value={product.price}
                  onChangeText={(value) =>
                    handleUpdateProduct(product.id, 'price', value)
                  }
                  placeholder="0.00"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          ))}
        </View>

        <Button
          title="➕ Add Product"
          onPress={handleAddProduct}
          variant="outline"
          style={styles.addButton}
        />

        <View style={styles.footer}>
          <Button
            title={`✓ Confirm ${products.length} Product${products.length !== 1 ? 's' : ''}`}
            onPress={handleConfirm}
            style={styles.confirmButton}
          />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.cancelButton}
          />
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
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  storeLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  storeName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  productsContainer: {
    marginBottom: spacing.md,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  productNumber: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: spacing.xs,
  },
  deleteButtonText: {
    ...typography.bodySmall,
    color: colors.error,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  addButton: {
    marginBottom: spacing.xl,
  },
  footer: {
    gap: spacing.md,
  },
  confirmButton: {
    marginBottom: spacing.sm,
  },
  cancelButton: {
    marginBottom: spacing.md,
  },
});

