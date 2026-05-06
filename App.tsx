import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native'; 

import { AuthProvider } from './context/AuthContext';
import { MedicineProvider } from './context/MedicineContext';
import { useAuth } from './hooks/useAuth'; 

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import { UserProvider } from './context/UserContext';
import { ExamProvider } from './context/ExamContext';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { token, loading } = useAuth();
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);

  React.useEffect(() => {
    if (!loading) {
      setIsInitialLoading(false);
    }
  }, [loading]);

  if (isInitialLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen name="App" component={AuthenticatedLayout} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ExamProvider>
          <MedicineProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </MedicineProvider>
        </ExamProvider>
      </UserProvider>
    </AuthProvider>
  );
}