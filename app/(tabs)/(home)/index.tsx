import 'react-native-gesture-handler'
import { View } from '../../../components/Themed';

import { Stack, useRouter, Link } from 'expo-router';
import styles from "../../../constants/Style"
import { ApplicationProvider, Button, Divider, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json"

export default function Home() {

  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
      <Layout style={styles.container}>
        <Text category='h2'>Welcome to LucidReality</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Link href="/overnight" asChild>
          <Button style={styles.button}>
            <Text>Overnight</Text>
          </Button>
        </Link>

        <Link href="/nap" asChild>
          <Button style={styles.button}>
            <Text style={styles.buttonText}>Nap</Text>
          </Button>
        </Link>
      </Layout>
    </ApplicationProvider>
  );
}
