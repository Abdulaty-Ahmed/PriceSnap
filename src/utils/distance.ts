import { GeoPoint } from '../types';

/**
 * Calculate distance between two points using Haversine formula
 * @param point1 First geographic point
 * @param point2 Second geographic point
 * @returns Distance in meters
 */
export const calculateDistance = (point1: GeoPoint, point2: GeoPoint): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
};

/**
 * Format distance for display
 * @param meters Distance in meters
 * @returns Formatted string (e.g., "1.5 km" or "250 m")
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    return `${(meters / 1000).toFixed(1)} km`;
  }
};

/**
 * Sort items by distance from a reference point
 * @param items Array of items with storeLocation property
 * @param userLocation User's current location
 * @returns Sorted array with distance property added
 */
export const sortByDistance = <T extends { storeLocation: GeoPoint }>(
  items: T[],
  userLocation: GeoPoint
): (T & { distance: number })[] => {
  return items
    .map(item => ({
      ...item,
      distance: calculateDistance(userLocation, item.storeLocation),
    }))
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Filter items within a certain radius
 * @param items Array of items with storeLocation property
 * @param userLocation User's current location
 * @param radiusMeters Maximum distance in meters
 * @returns Filtered array
 */
export const filterByRadius = <T extends { storeLocation: GeoPoint }>(
  items: T[],
  userLocation: GeoPoint,
  radiusMeters: number
): T[] => {
  return items.filter(item => {
    const distance = calculateDistance(userLocation, item.storeLocation);
    return distance <= radiusMeters;
  });
};

