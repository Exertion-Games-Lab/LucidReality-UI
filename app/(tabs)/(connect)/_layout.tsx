import { Stack } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

export default function ConnectionLayout() {
  return (
    <Stack
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
      <Stack.Screen name="index" options={{title: 'Connect now'}} />
      <Stack.Screen name="LABconnect" options={{ title: 'Lab' }} />
      <Stack.Screen name="PORTABLEconnect" options={{ title: 'Portable' }} />
    </Stack>
  );
}
