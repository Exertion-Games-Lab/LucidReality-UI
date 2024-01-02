import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';

import styles from "../../constants/Style"

export default function setupGuide() {
  return (
    <>
    <Stack.Screen options={{ title: 'Setup' }} />
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Setup Guide</Text>
    </SafeAreaView>
    </>
  );
}
