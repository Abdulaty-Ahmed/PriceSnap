import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SearchBar, ProductCard, LoadingSpinner, ErrorMessage } from '../components';
import { useSearchStore, useAuthStore } from '../store';
import { colors, spacing, typography } from '../constants/theme';
import { SEARCH_CONFIG } from '../constants';

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const {
    searchQuery,
    searchResults,
    loading,
    error,
    sortBy,
    search,
    clearResults,
    setSortBy,
    updateUserLocation,
  } = useSearchStore();

  const [localQuery, setLocalQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    updateUserLocation();
  }, []);

  const handleSearch = (text: string) => {
    setLocalQuery(text);

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new debounce timer
    if (text.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH) {
      const timer = setTimeout(() => {
        search(text, user?.userId);
      }, SEARCH_CONFIG.DEBOUNCE_DELAY);
      setDebounceTimer(timer);
    } else {
      clearResults();
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    clearResults();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          value={localQuery}
          onChangeText={handleSearch}
          onClear={handleClear}
          placeholder="Search for products..."
        />
        
        {searchResults.length > 0 && (
          <View style={styles.sortContainer}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === 'price' && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy('price')}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === 'price' && styles.sortButtonTextActive,
                ]}
              >
                💰 Price
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === 'distance' && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy('distance')}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === 'distance' && styles.sortButtonTextActive,
                ]}
              >
                📍 Distance
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading && <LoadingSpinner message="Searching..." />}

      {error && <ErrorMessage message={error} onRetry={() => search(localQuery, user?.userId)} />}

      {!loading && !error && searchResults.length === 0 && localQuery.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubtext}>Try searching for something else</Text>
        </View>
      )}

      {!loading && !error && searchResults.length === 0 && localQuery.length < SEARCH_CONFIG.MIN_SEARCH_LENGTH && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💡</Text>
          <Text style={styles.emptyText}>Start searching</Text>
          <Text style={styles.emptySubtext}>Enter a product name to find the best prices</Text>
        </View>
      )}

      {!loading && !error && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.productId}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item.productId)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingBottom: spacing.sm,
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  sortButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
  },
  sortButtonText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: colors.surface,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyText: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

