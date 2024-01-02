import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, ScrollView } from 'react-native';

import styles from "../../../constants/Style";

import { ApplicationProvider, Button, Text, Layout, Icon, IconElement, IconRegistry, Card, Divider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { View } from '../../../components/Themed';

const arrow = (props: any) => (
  <Icon name='arrow-forward-outline' {...props} animation='pulse' />
);

export default function introToLD() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
        <Stack.Screen options={{ title: '' }} />
        <Layout style={styles.container}>
          <ScrollView>
            <Layout style={stylesScreen.titleContainer}>
              <Text category='h3'>Introduction</Text>
              <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            </Layout>

            <Card style={styles.card}>
              <Text style={stylesScreen.titleCard} category='h6'>What is Lucid Dreaming?</Text>
              <Text category='p1'>Lucid dreams are when you know that you’re dreaming while you’re asleep.
                You’re aware that the events flashing through your brain aren’t really happening. But the dream feels vivid and real. You may even be able to control how the action unfolds, as if you’re directing a movie in your sleep.
                Studies suggest that about half of people may have had at least one lucid dream. But they probably don’t happen often, usually only a handful of times in a year.</Text>
            </Card>

            <Card style={styles.card}>
              <Text style={stylesScreen.titleCard} category='h6'>When do Lucid Dreams Happen?</Text>
              <Text category='p1'>Lucid dreams are most common during rapid eye movement (REM) sleep, a period of very deep sleep marked by eye motion, faster breathing, and more brain activity.
                You usually enter REM sleep about 90 minutes after falling asleep. It lasts about 10 minutes. As you sleep, each REM period is longer than the one before, finally lasting up to an hour.</Text>
            </Card>

            <Card style={styles.card}>
              <Text style={stylesScreen.titleCard} category='h6'>Benifits of lucid dreaming</Text>
              <Text category='p1'> Benefits here</Text>
            </Card>

            <Card style={styles.card}>
              <Text style={stylesScreen.titleCard} category='h6'>Dangers of lucid dreaming</Text>
              <Text category='p1'> Dangers here</Text>
            </Card>

          </ScrollView>
          <Link href="/introToSystem" asChild>
            <Button status='success' style={styles.buttonFixed} accessoryRight={arrow}>
              <Text>Continue</Text>
            </Button>
          </Link>
        </Layout>
      </ApplicationProvider>
    </>
  );
}

const stylesScreen = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    padding: 7,
    marginTop: 20,
  },
  titleCard: {
    marginBottom: 10,
  },
});
