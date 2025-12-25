import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications and get token
 */
export const registerForPushNotifications = async (): Promise<string | null> => {
  try {
    // Check if running on physical device
    if (!Constants.isDevice) {
      Alert.alert('Error', 'Push notifications only work on physical devices');
      return null;
    }

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'Push notification permission is required for price alerts');
      return null;
    }

    // Get push token
    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;

    // Android specific channel setup
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
};

/**
 * Schedule a local notification
 */
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: any
): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

/**
 * Send price drop notification
 */
export const sendPriceDropNotification = async (
  productName: string,
  newPrice: number,
  storeName: string,
  distance: string
): Promise<void> => {
  await scheduleLocalNotification(
    '💰 Price Drop Alert!',
    `${productName} is now ₺${newPrice.toFixed(2)} at ${storeName} (${distance} away)`,
    { type: 'price_drop', productName, newPrice, storeName }
  );
};

/**
 * Send new store notification
 */
export const sendNewStoreNotification = async (
  storeName: string,
  distance: string
): Promise<void> => {
  await scheduleLocalNotification(
    '🏪 New Store Added!',
    `${storeName} has been added near you (${distance} away)`,
    { type: 'new_store', storeName }
  );
};

/**
 * Add notification received listener
 */
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
) => {
  return Notifications.addNotificationReceivedListener(callback);
};

/**
 * Add notification response listener (when user taps notification)
 */
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

