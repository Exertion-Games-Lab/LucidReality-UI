import { StyleSheet, Alert} from 'react-native';

import EditScreenInfo from '../../../components/EditScreenInfo';
import { View } from '../../../components/Themed';

import styles from "../../../constants/Style"
import { ApplicationProvider, Button, Divider, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';

export default function LABconnect() {
  const [sliderValueLED, setSliderValueLED] = useState(5);
  const [sliderValueSound, setSliderValueSound] = useState(5);

  //SEND LED VALUE TO SERVER

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postName: 'React updates ' })
  };

  const postLED = async () => {
    try {
      await fetch(
        'https://reqres.in/api/posts', requestOptions)
        .then(response => {
          response.json()
            .then(data => {
              Alert.alert("Post created at : ",
                data.createdAt);
            });
        })
    }
    catch (error) {
      console.error(error);
    }
  }

  //SEND AUDIO VALUE TO SERVER

  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
      <Layout style={styles.container}>
        <Text category='h2'>Calibration</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Button style={styles.button}>
          <Text style={styles.buttonText}>Connect</Text>
        </Button>

        <Text category='h6'>LED Brightness</Text>
        <Text category='c1'>{sliderValueLED}</Text>
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={0}
          maximumValue={10}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          value={sliderValueLED}
          onValueChange={value => setSliderValueLED(value)}
          step={1}
          onSlidingComplete={() => console.log("Sliding Complete" + { sliderValueLED })}
        />
        <Text category='h6'>Sound Volume</Text>
        <Text category='c1'>{sliderValueSound}</Text>
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={0}
          maximumValue={10}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          value={sliderValueSound}
          onValueChange={value => setSliderValueSound(value)}
          step={1}
        />
      </Layout>
    </ApplicationProvider>
  );
}

