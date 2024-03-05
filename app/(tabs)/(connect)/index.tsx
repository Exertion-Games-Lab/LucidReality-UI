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
        <Text category='h2'>Connect Now</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text category='label'>If your server is already up and running:</Text>
        <Link href="/Connect" asChild>
          <Button style={styles.button}>
            <Text>Connect & Calibrate</Text>
          </Button>
        </Link>
        <Link href="../userGuideHeadset" asChild>
          <Button style={styles.button}>
            <Text style={styles.buttonText}>Headset Guide</Text>
          </Button>
        </Link>
        <Text category='label'>If you need help setting up the server:</Text>
        <Link href="../userGuideServer" asChild>
          <Button style={styles.button}>
            <Text style={styles.buttonText}>Server Setup Guide</Text>
          </Button>
        </Link>
      </Layout>
    </ApplicationProvider>
  );
}
