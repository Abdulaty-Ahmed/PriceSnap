import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation';
import {
  registerForPushNotifications,
  addNotificationReceivedListener,
  addNotificationResponseListener,
} from './src/services/notificationService';
import { updateNotificationToken } from './src/services/authService';
import { useAuthStore } from './src/store';

export default function App() {
  const { user } = useAuthStore();

  useEffect(() => {
    // Setup push notifications
    setupNotifications();

    // Add notification listeners
    const receivedSubscription = addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    const responseSubscription = addNotificationResponseListener((response) => {
      console.log('Notification tapped:', response);
      // Handle navigation based on notification data
    });

    return () => {
      receivedSubscription?.remove();
      responseSubscription?.remove();
    };
  }, []);

  const setupNotifications = async () => {
    if (user) {
      const token = await registerForPushNotifications();
      if (token) {
        await updateNotificationToken(user.userId, token);
      }
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <RootNavigator />
    </>
  );
}

