import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Button, LoadingSpinner, ErrorMessage } from '../components';
import { getProductById } from '../services/searchService';
import { Product } from '../types';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';

type ProductDetailRouteProp = RouteProp<
  { ProductDetail: { productId: string } },
  'ProductDetail'
>;

export const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await getProductById(productId);
      if (productData) {
        setProduct(productData);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = () => {
    if (product) {
      const { latitude, longitude } = product.storeLocation;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading product..." />;
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage message={error || 'Product not found'} onRetry={loadProduct} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: product.imageUrl || 'https://via.placeholder.com/400' }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Store Information</Text>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Store:</Text>
                <Text style={styles.value}>{product.storeName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Location:</Text>
                <Text style={styles.value}>
                  {product.storeLocation.latitude.toFixed(4)},{' '}
                  {product.storeLocation.longitude.toFixed(4)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Original Name:</Text>
                <Text style={styles.value}>{product.originalName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Added:</Text>
                <Text style={styles.value}>
                  {product.createdAt.toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          <Button
            title="📍 Get Directions"
            onPress={handleGetDirections}
            style={styles.button}
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
    paddingBottom: spacing.xl,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: colors.surface,
  },
  content: {
    padding: spacing.lg,
  },
  name: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  priceContainer: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
    ...shadows.medium,
  },
  priceLabel: {
    ...typography.bodySmall,
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  price: {
    ...typography.h1,
    fontSize: 48,
    color: colors.surface,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.small,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  value: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  button: {
    marginTop: spacing.lg,
  },
});

