import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from './types';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminAppointmentsScreen } from '../screens/admin/AdminAppointmentsScreen';
import { AdminEmployeesScreen } from '../screens/admin/AdminEmployeesScreen';
import { AdminProductsScreen } from '../screens/admin/AdminProductsScreen';
import { AdminClientsScreen } from '../screens/admin/AdminClientsScreen';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export const AdminNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    <Stack.Screen name="AdminAppointments" component={AdminAppointmentsScreen} />
    <Stack.Screen name="AdminEmployees" component={AdminEmployeesScreen} />
    <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
    <Stack.Screen name="AdminClients" component={AdminClientsScreen} />
  </Stack.Navigator>
);
