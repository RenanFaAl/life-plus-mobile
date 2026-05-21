import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'; 
import { LayoutDashboard, User, FileText, Pill, Settings, Map } from 'lucide-react-native';
import colors from '../theme/colors';

import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExamsScreen from '../screens/ExamsScreen';
import MedicationsScreen from '../screens/MedicationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChangeEmailScreen from '../screens/ChangeEmailScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CreateExamScreen from '../screens/CreateExamScreen';
import ExamDetailsScreen from '../screens/ExamDetailsScreen';
import EditExamScreen from '../screens/EditExamScreen';
import CreateMedicineScreen from '../screens/CreateMedicineScreen';
import MedicineDetailsScreen from '../screens/MedicineDetailsScreen';
import EditMedicineScreen from '../screens/EditMedicineScreen';
import RegisterMedicineDoseScreen from '../screens/RegisterMedicineDoseScreen';
import MapScreen from '../screens/MapScreen';

const Tab = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();
const ExamStack = createNativeStackNavigator();
const MedicineStack = createNativeStackNavigator();

const hideArray = ["EditProfile", "ChangeEmail", "ChangePassword", "Accessibility", "CreateExam", "ExamDetails", "CreateMedicine"];

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsHome" component={SettingsScreen} />
      <SettingsStack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
      <SettingsStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <SettingsStack.Screen name="EditProfile" component={EditProfileScreen} />
    </SettingsStack.Navigator>
  );
}

function ExamStackScreen() {
  return (
    <ExamStack.Navigator screenOptions={{ headerShown: false }}>
      <ExamStack.Screen name="ExamsList" component={ExamsScreen} />
      <ExamStack.Screen name="CreateExam" component={CreateExamScreen} />
      <ExamStack.Screen name="ExamDetails" component={ExamDetailsScreen} />
      <ExamStack.Screen name="EditExam" component={EditExamScreen} />
    </ExamStack.Navigator>
  );
}

function MedicineStackScreen() {
  return (
    <MedicineStack.Navigator screenOptions={{ headerShown: false }}>
      <MedicineStack.Screen name="MedicinesList" component={MedicationsScreen} />
      <MedicineStack.Screen name="CreateMedicine" component={CreateMedicineScreen} />
      <MedicineStack.Screen name="MedicineDetails" component={MedicineDetailsScreen} />
      <MedicineStack.Screen name="EditMedicine" component={EditMedicineScreen} />
      <MedicineStack.Screen name="RegisterMedicineDose" component={RegisterMedicineDoseScreen} />
    </MedicineStack.Navigator>
  );
}

export default function AuthenticatedLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "SettingsHome";
          
          const hideHeaderScreens = ["EditProfile", "ChangeEmail", "ChangePassword", "Accessibility", "CreateExam", "ExamDetails", "CreateMedicine", "MedicineDetails", "EditMedicine", "RegisterMedicineDose"];
          
          if (hideHeaderScreens.includes(routeName)) {
            return false;
          }
          return true;
        })(route),
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#0891b2',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#0891b2',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "SettingsHome";
          
          const hideOnScreens = ["EditProfile", "ChangeEmail", "ChangePassword", "Accessibility", "CreateExam", "ExamDetails", "CreateMedicine", "MedicineDetails", "EditMedicine", "RegisterMedicineDose"];
          
          if (hideOnScreens.includes(routeName)) {
            return { display: 'none' };
          }

          return {
            backgroundColor: '#ffffff',
            borderTopColor: '#e2e8f0',
            paddingBottom: 6,
            paddingTop: 6,
            height: 60,
          };
        })(route),
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, any> = {
            Dashboard: LayoutDashboard,
            Profile: User,
            Exams: FileText,
            Medications: Pill,
            Map: Map,
            Settings: Settings,
          };
          const Icon = icons[route.name];
          return Icon ? <Icon size={size} color={color} /> : null;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <Tab.Screen name="Exams" component={ExamStackScreen} options={{ title: 'Exames' }} />
      <Tab.Screen name="Medications" component={MedicineStackScreen} options={{ title: 'Medicamentos' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Mapa' }} />
      <Tab.Screen name="Settings" component={SettingsStackScreen} options={{ title: 'Config' }} />
    </Tab.Navigator>
  );
}
