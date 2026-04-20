import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, User, FileText, Pill, Settings } from 'lucide-react-native';
import colors from '../theme/colors';

import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExamsScreen from '../screens/ExamsScreen';
import MedicationsScreen from '../screens/MedicationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MapScreen from '../screens/MapScreen';


const Tab = createBottomTabNavigator();

export default function AuthenticatedLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#0891b2',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#0891b2',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, any> = {
            Dashboard: LayoutDashboard,
            Profile: User,
            Exams: FileText,
            Medications: Pill,
            Settings: Settings,
          };
          const Icon = icons[route.name];
          return Icon ? <Icon size={size} color={color} /> : null;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <Tab.Screen name="Exams" component={ExamsScreen} options={{ title: 'Exames' }} />
      <Tab.Screen name="Medications" component={MedicationsScreen} options={{ title: 'Medicamentos' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Config' }} />
      <Tab.Screen name="Mapa" component={MapScreen} options={{ title: 'Mapa' }} />
    </Tab.Navigator>
  );
}
