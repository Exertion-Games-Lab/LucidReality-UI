import { Stack } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

export default function HomeLayout() {
  return (
    <Stack
      // https://reactnavigation.org/docs/headers#sharing-common-options-across-screens
      screenOptions={{
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {/* Optionally configure static options outside the route. */}
      <Stack.Screen name="index" options={{ title: 'Get Started' }} />
      <Stack.Screen name= "overnight" options={{ title: 'Overnight' }} />
      <Stack.Screen name= "introToLD" options={{ title: '' }} />
      <Stack.Screen name= "introToSystem" options={{ title: '' }} />
      <Stack.Screen name= "playVR" options={{ title: 'playVR' }} />
      <Stack.Screen name= "uninterruptedSleep" options={{ title: 'Uninterrupted Sleep' }} />
      <Stack.Screen name= "stayAwake" options={{ title: 'Stay Awake' }} />
      <Stack.Screen name= "lucidDream" options={{ title: 'Lucid Dream' }} />
    </Stack>
  );
}
