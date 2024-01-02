import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet } from 'react-native';

import { View } from '../../../components/Themed';
import styles from '../../../constants/Style';
import TabLayout from '../_layout';

import { ApplicationProvider, Button, Text, Layout } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import {default as theme} from "../../../theme.json"

export default function overnight() {
  return (
    <>
    <ApplicationProvider {...eva} theme={{...eva.dark, ...theme}}>
      
      <Layout style={styles.container}>
        <Text category ="h2">Overnight Session</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <Link href="/introToLD" asChild>
          <Button style={styles.button}>
            <Text>Scuba</Text>
          </Button>
        </Link>

        <Link href="/nap" asChild>
          <Button style={styles.button}>
            <Text>Dungeon</Text>
          </Button>
        </Link>
      </Layout>

      <TabLayout/>
      
     </ApplicationProvider>
    </>
  );
}
