import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as eva from '@eva-design/eva';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';

import Colors from '../../constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#254EDB',
        tabBarStyle: {
          backgroundColor: 'black',
        },
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Sleep',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="sleep" color={color} size={24} />,
          headerShown: false,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="(connect)"
        options={{
          title: 'Get Started',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="connection" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="(journal)"
        options={{
          title: 'Journal',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="book" color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
