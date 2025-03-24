import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { RootState } from '@/redux/store';
import Auth from '@/components/auth/auth';
import { useAppDispatch } from '@/redux/hooks';
import { initializeAuth } from '@/redux/authSlice';

export default function TabLayout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const colorScheme = useColorScheme();
  
  // Select the token from Redux state
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoggedIn = Boolean(token);

  // If not logged in, render the Auth component
  if (!isLoggedIn) {
    return <Auth />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="Notices"
        options={{
          title: 'Notices',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'notifications' : 'notifications-outline'} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="message-teacher"
        options={{
          title: 'Message Teacher',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chatbubble' : 'chatbubble-outline'} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="view-homework"
        options={{
          title: 'Homework',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'document' : 'document-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
