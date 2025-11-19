import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ReceivedContactScreen from './src/screens/ReceivedContactScreen';
import { UserProfile } from './src/services/storage';

// Определяем типы для параметров навигации
export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  ReceivedContact: { contact: UserProfile };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              headerShown: true,
              title: 'Профиль',
              headerStyle: {
                backgroundColor: '#007AFF',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen 
            name="ReceivedContact" 
            component={ReceivedContactScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
