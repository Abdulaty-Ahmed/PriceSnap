import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ProductWithDistance } from '../types';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { formatDistance } from '../utils/distance';

interface ProductCardProps {
  product: ProductWithDistance;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: product.imageUrl || 'https://via.placeholder.com/100' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <View style={styles.footer}>
          <Text style={styles.storeName} numberOfLines={1}>
            📍 {product.storeName}
          </Text>
          {product.distance !== undefined && (
            <Text style={styles.distance}>
              {formatDistance(product.distance)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  price: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  distance: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});

