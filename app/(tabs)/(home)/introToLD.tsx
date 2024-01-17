import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, ScrollView } from 'react-native';

import styles from "../../../constants/Style";

import { ApplicationProvider, Button, Text, Layout, Icon, IconElement, IconRegistry, Card, Divider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { View } from '../../../components/Themed';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import Sound from 'react-native-sound';
import * as React from 'react';

const arrow = (props: any) => (
  <Icon name='arrow-forward-outline' {...props} animation='pulse' />
);

const play = (props: any) => (
  <Icon style={stylesScreen.icon} fill='white' name='volume-up' {...props} animation='pulse' />
);

const pause = (props: any) => (
  <Icon style={stylesScreen.icon} fill='white' name='pause-circle' {...props} animation='pulse' />
);

const audioTrack = require('../../../assets/audio/introToLd/intro.mp3');

export default function introToLD() {
  const [Loaded, SetLoaded] = React.useState(false);
  const [Loading, SetLoading] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false); // Track playback status
  const sound = React.useRef(new Audio.Sound());

  //allows audio to play in silent
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
  }, []);

  React.useEffect(() => {
    LoadAudio();
  }, []);

  const handleTogglePlayback = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (isPlaying) {
          sound.current.pauseAsync();
        } else {
          sound.current.playAsync();
        }
        setIsPlaying(!isPlaying); // Toggle playback status
      }
    } catch (error) { }
  };

  const LoadAudio = async () => {
    SetLoading(true);
    const checkLoading = await sound.current.getStatusAsync();
    if (checkLoading.isLoaded === false) {
      try {
        const result = await sound.current.loadAsync(audioTrack, {}, true);
        if (result.isLoaded === false) {
          SetLoading(false);
          console.log('Error in Loading Audio');
        } else {
          SetLoading(false);
          SetLoaded(true);
        }
      } catch (error) {
        console.log(error);
        SetLoading(false);
      }
    } else {
      SetLoading(false);
    }
  };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />

      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
        <Stack.Screen options={{ title: '' }} />
        <Layout style={styles.container}>
          <ScrollView>
            <Layout style={stylesScreen.titleContainer}>
              <Text category='h3'>Introduction</Text>
              <Button
                style={stylesScreen.button}
                appearance='outline'
                accessoryLeft={isPlaying ? pause : play}
                onPress={handleTogglePlayback}
              />

            </Layout>

            <Card style={styles.card}>
              <Text style={stylesScreen.titleCard} category='h6'>What is Lucid Dreaming?</Text>
              <Text category='p1'>Lucid Dreaming is when you realise you're dreaming while you're asleep. You know the stuff happening in your dream isn't real, but it feels super clear and lifelike. Sometimes, you can even steer the dream like you're the boss of a sleep movie. Studies say about half of people might have had a lucid dream at least once, but they usually don't happen a lot — just a few times a year for most people.</Text>
            </Card>

            <Card style={styles.card}>
              <Text style={stylesScreen.titleCard} category='h6'>When do Lucid Dreams Happen?</Text>
              <Text category='p1'>
                Lucid dreams typically occur during rapid eye movement (REM) sleep, a phase of deep sleep characterized by eye movement, increased breathing, and heightened brain activity. REM sleep usually begins approximately 90 minutes after you fall asleep and lasts for about 10 minutes initially. Throughout the night, each subsequent REM period becomes longer, eventually extending up to an hour.</Text>
            </Card>

            <Card style={styles.card}>
              <Text style={stylesScreen.titleCard} category='h6'>Benifits of lucid dreaming</Text>
              <Text category='p1'>Boosts Creativity: Lucid dreaming lets you get creative in your dreams, making it a fun space for imagination. {'\n'}</Text>
              <Text category='p1'>Facing Fears: You can use lucid dreaming to confront and conquer fears in a safe dream setting. {'\n'}</Text>
              <Text category='p1'>Problem-Solving Practice: Some people use lucid dreaming to practice problem-solving or rehearse real-life situations. {'\n'}</Text>
              <Text category='p1'>Personal Growth: Lucid dreaming offers a chance for self-reflection and personal insights, helping you understand your thoughts and feelings better. {'\n'}</Text>
              <Text category='p1'>Entertainment: Lucid dreaming is like having your own personalized entertainment system, where you can enjoy unique and fantastical experiences. {'\n'}</Text>

            </Card>

            { /*
            <Card style={styles.card}>
              <Text style={stylesScreen.titleCard} category='h6'>Dangers of lucid dreaming</Text>
              <Text category='p1'> Dangers here</Text>
            </Card>
            */}

          </ScrollView>
          <Link href="/introToSystem" asChild>
            <Button onPress={() => {
              if (isPlaying) {
                handleTogglePlayback();
              } else {
                console.log("isPlaying is false");
              }
            }} status='success' style={styles.buttonFixed} accessoryRight={arrow}>
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
    flexDirection: 'row',
    justifyContent: 'center'
  },
  titleCard: {
    marginBottom: 10,
  },
  button: {
    justifyContent: 'center',
    borderWidth: 1,
    alignItems: 'center',
    width: 25,
    height: 25,
    borderRadius: 50,
    borderColor: 'black',
    backgroundColor: 'black',
    marginLeft: 10
  },
  icon: {
    width: 25,
    height: 25,
    size: 50
  },
});
