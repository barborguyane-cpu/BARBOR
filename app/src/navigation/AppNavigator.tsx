import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme';
import { RootStackParamList } from './types';

import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { AdminNavigator } from './AdminNavigator';

const Root = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.gold,
          background: colors.background,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.border,
          notification: colors.gold,
        },
      }}
    >
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Root.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === 'admin' ? (
          <Root.Screen name="Admin" component={AdminNavigator} />
        ) : (
          <Root.Screen name="Main" component={MainTabNavigator} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
};
