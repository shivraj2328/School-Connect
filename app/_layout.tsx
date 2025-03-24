import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import { Platform } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { io } from "socket.io-client";
import Constants from 'expo-constants';

const API_URL = "https://school-connect-server.up.railway.app";
const socket = io(API_URL);

SplashScreen.preventAutoHideAsync();

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false, // Set to false to prevent badge issues
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    setupNotifications();
    return () => cleanup();
  }, []);

  const setupNotifications = async () => {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return;
    }

    await registerForPushNotificationsAsync();
    setupNotificationListeners();
  };

  const setupNotificationListeners = () => {
    // Listen for incoming notifications while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Received notification:', notification);
    });

    // Handle notification when app is in background/closed and user taps it
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      const data = response.notification.request.content.data;
      
      // Navigate based on notification data
      if (data?.screen) {
        router.push(data.screen);
      } else {
        router.push("/Notices"); // Default navigation
      }
    });
  };

  const cleanup = () => {
    if (notificationListener.current) {
      Notifications.removeNotificationSubscription(notificationListener.current);
    }
    if (responseListener.current) {
      Notifications.removeNotificationSubscription(responseListener.current);
    }
  };

  async function registerForPushNotificationsAsync() {
    try {
      // Set up Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Check/request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      // Get push token
      const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      
      // Send token to server via socket
      socket.emit('register_push_token', token);
      console.log('Push token registered:', token);

    } catch (error) {
      console.error('Error in registerForPushNotificationsAsync:', error);
    }
  }

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}