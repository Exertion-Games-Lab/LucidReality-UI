import { StyleSheet, Alert } from 'react-native';
import { View } from '../../../components/Themed';

import styles from "../../../constants/Style"
import { ApplicationProvider, Button, Divider, Layout, Text, Modal, Card, Input } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import axios from 'axios';

export default function LABconnect() {
  const [sliderValueLED, setSliderValueLED] = useState<number>(20);
  const [sliderValueSound, setSliderValueSound] = useState(50);
  const [baseURL, setBaseURL] = useState<string>('http://192.168.1.7');
  const [visible, setVisible] = React.useState(false);
  const [port, setPort] = useState<string>('8080');

  //Where we post to server after getting the base IP and port
  const postURL = baseURL + ':' + port;

  //SEND LED COMMAND TO SERVER
  const sendVisualStimulus = async () => {
    try {
      const payload = {
        brightness: sliderValueLED,
        colour: {
          r: 255,
          g: 0,
          b: 0,
        },
      };

      await axios.post(`${postURL}/command/1/VisualStimulus`, payload);
      console.log('Visual stimulus sent successfully. Brightness: ' + payload.brightness + ' postURL: ' + postURL);
    } catch (error) {
      console.error('Error sending visual stimulus:', error);
    }
  };

  //SEND AUDIO COMMAND TO SERVER
  const sendAudioStimulus = async () => {
    try {
      const payload = {
        filename: "THETA.mp3",
        volume: sliderValueSound,
        duration: 10000
      };

      await axios.post(`${postURL}/command/2/Audio`, payload);
      console.log('Audio stimulus sent successfully. Volume: ' + payload.volume);
    } catch (error) {
      console.error('Error sending visual stimulus:', error);
    }
  };

  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
      <Layout style={styles.container}>
        <Text category='h2'>Calibration</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <Button style={styles.button} onPress={() => setVisible(true)}>
          <Text style={styles.buttonText}>Connect</Text>
        </Button>

        <Modal
          visible={visible}
          backdropStyle={stylesScreen.backdrop}
          onBackdropPress={() => setVisible(false)}
        >
          <Card disabled={true}>
            <Text>
              Enter your IP address:
            </Text>
            <Text
              appearance='hint'
            >
              Current IP address: {postURL}
            </Text>
            <Input
              placeholder='IP Address'
              onChangeText={value => setBaseURL('http://' + value)}
              keyboardType="numeric"
            />

            { /* No need for port input as our server port is always 8080, LAB or Portable
            <Input
              placeholder='Port'
              keyboardType="numeric"
              onChangeText={nextValue => setPort(nextValue)}
            />
            */
            }

            <Button onPress={() => setVisible(false)}>
              Confirm
            </Button>
          </Card>
        </Modal>

        <Text category='h6'>LED Brightness</Text>
        <Text category='c1'>{sliderValueLED}</Text>
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={0}
          maximumValue={40}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          value={sliderValueLED}
          onValueChange={value => setSliderValueLED(value)}
          step={1}
          onSlidingComplete={() => console.log("Sliding Complete" + { sliderValueLED })}
        />

        <Button
          style={styles.button}
          appearance='outline'
          status='basic'
          onPress={sendVisualStimulus}
        >
          Test Visual Stimulus
        </Button>


        <Text category='h6'>Sound Volume</Text>
        <Text category='c1'>{sliderValueSound}</Text>
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          value={sliderValueSound}
          onValueChange={value => setSliderValueSound(value)}
          step={10}
          onSlidingComplete={() => console.log("Sliding complete" + { sliderValueSound })}
        />

        <Button
          style={styles.button}
          appearance='outline'
          status='basic'
          onPress={sendAudioStimulus}
        >
          Test Audio Stimulus
        </Button>
      </Layout>
    </ApplicationProvider>
  );
}


const stylesScreen = StyleSheet.create({
  testButton: {
    color: 'black'
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})
