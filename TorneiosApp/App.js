import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TimesScreen from './src/screens/TimesScreen';
import RegisterTimeScreen from './src/screens/RegisterTimeScreen';
import JogosScreen from './src/screens/JogosScreen';
import RegisterJogoScreen from './src/screens/RegisterJogoScreen';
import TabelaScreen from './src/screens/TabelaScreen';

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
        <Stack.Screen name="Login"         component={LoginScreen}         options={{ title: 'Login' }} />
        <Stack.Screen name="Register"      component={RegisterScreen}      options={{ title: 'Registrar' }} />
        <Stack.Screen name="Times"         component={TimesScreen}         options={{ title: 'Times' }} />
        <Stack.Screen name="RegisterTime"  component={RegisterTimeScreen}  options={{ title: 'Registrar Time' }} />
        <Stack.Screen name="Jogos"         component={JogosScreen}         options={{ title: 'Jogos' }} />
        <Stack.Screen name="RegisterJogo"  component={RegisterJogoScreen}  options={{ title: 'Registrar Jogo' }} />
        <Stack.Screen name="Tabela"        component={TabelaScreen}        options={{ title: 'Tabela' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}