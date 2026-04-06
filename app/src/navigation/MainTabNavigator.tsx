import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';
import { useShopStore } from '../store/shopStore';
import {
  MainTabParamList,
  BookingStackParamList,
  ShopStackParamList,
  DriverStackParamList,
} from './types';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { SelectBarberScreen } from '../screens/booking/SelectBarberScreen';
import { SelectServiceScreen } from '../screens/booking/SelectServiceScreen';
import { SelectDateTimeScreen } from '../screens/booking/SelectDateTimeScreen';
import { BookingConfirmScreen } from '../screens/booking/BookingConfirmScreen';
import { BookingSuccessScreen } from '../screens/booking/BookingSuccessScreen';
import { ShopScreen } from '../screens/shop/ShopScreen';
import { ProductDetailScreen } from '../screens/shop/ProductDetailScreen';
import { CartScreen } from '../screens/shop/CartScreen';
import { CheckoutScreen } from '../screens/shop/CheckoutScreen';
import { OrderSuccessScreen } from '../screens/shop/OrderSuccessScreen';
import { DriverScreen } from '../screens/driver/DriverScreen';
import { DriverFormScreen } from '../screens/driver/DriverFormScreen';
import { DriverConfirmScreen } from '../screens/driver/DriverConfirmScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Sub-stacks
const BookingStack = createNativeStackNavigator<BookingStackParamList>();
const ShopStack = createNativeStackNavigator<ShopStackParamList>();
const DriverStack = createNativeStackNavigator<DriverStackParamList>();

const BookingNavigator = () => (
  <BookingStack.Navigator screenOptions={{ headerShown: false }}>
    <BookingStack.Screen name="BookingMain" component={SelectBarberScreen} />
    <BookingStack.Screen name="SelectBarber" component={SelectBarberScreen} />
    <BookingStack.Screen name="SelectService" component={SelectServiceScreen} />
    <BookingStack.Screen name="SelectDateTime" component={SelectDateTimeScreen} />
    <BookingStack.Screen name="BookingConfirm" component={BookingConfirmScreen} />
    <BookingStack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
  </BookingStack.Navigator>
);

const ShopNavigator = () => (
  <ShopStack.Navigator screenOptions={{ headerShown: false }}>
    <ShopStack.Screen name="ShopMain" component={ShopScreen} />
    <ShopStack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <ShopStack.Screen name="Cart" component={CartScreen} />
    <ShopStack.Screen name="Checkout" component={CheckoutScreen} />
    <ShopStack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
  </ShopStack.Navigator>
);

const DriverNavigator = () => (
  <DriverStack.Navigator screenOptions={{ headerShown: false }}>
    <DriverStack.Screen name="DriverMain" component={DriverScreen} />
    <DriverStack.Screen name="DriverForm" component={DriverFormScreen} />
    <DriverStack.Screen name="DriverConfirm" component={DriverConfirmScreen} />
  </DriverStack.Navigator>
);

export const MainTabNavigator = () => {
  const cartCount = useShopStore((s) => s.cartCount());

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? 'home' : 'home-outline',
            Booking: focused ? 'calendar' : 'calendar-outline',
            Shop: focused ? 'bag' : 'bag-outline',
            Driver: focused ? 'car' : 'car-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Accueil' }} />
      <Tab.Screen name="Booking" component={BookingNavigator} options={{ tabBarLabel: 'Réserver' }} />
      <Tab.Screen
        name="Shop"
        component={ShopNavigator}
        options={{
          tabBarLabel: 'Boutique',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: styles.badge,
        }}
      />
      <Tab.Screen
        name="Driver"
        component={DriverNavigator}
        options={{ tabBarLabel: "BARB'DRIVER" }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.borderGold,
    borderTopWidth: 1,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    height: 65,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  badge: {
    backgroundColor: colors.gold,
    color: colors.black,
    fontSize: 10,
    fontWeight: '700',
  },
});
