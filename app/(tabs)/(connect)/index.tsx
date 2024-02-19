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
        <Text category='h2'>Get Started</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Link href="/Connect" asChild>
          <Button style={styles.button}>
            <Text>Connect & Calibrate</Text>
          </Button>
        </Link>

        <Link href="../PORTABLEconnect" asChild>
          <Button style={styles.button}>
            <Text style={styles.buttonText}>Portable</Text>
          </Button>
        </Link>
      </Layout>
    </ApplicationProvider>
  );
}
