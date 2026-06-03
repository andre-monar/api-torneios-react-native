import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TimesScreen from './src/screens/TimesScreen';
import RegisterTimeScreen from './src/screens/RegisterTimeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Login"        component={LoginScreen}        options={{ title: 'Login' }} />
        <Stack.Screen name="Register"     component={RegisterScreen}     options={{ title: 'Registrar' }} />
        <Stack.Screen name="Times"        component={TimesScreen}        options={{ title: 'Times' }} />
        <Stack.Screen name="RegisterTime" component={RegisterTimeScreen} options={{ title: 'Registrar Time' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}