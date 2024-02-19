import { StyleSheet, Alert, Dimensions } from 'react-native';
import { View } from '../../../components/Themed';
import styles from "../../../constants/Style"
import { ApplicationProvider, Button, Divider, Layout, Text, Modal, Card, Input } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import axios from 'axios';
import { APIProvider, useAPIVariables } from '../../../APICalls/API';

function LABconnectInner() {
  const [sliderValueLED, setSliderValueLED] = useState<number>(20);
  const [sliderValueSound, setSliderValueSound] = useState(50);
  const [baseURL, setBaseURL] = useState<string>('http://192.168.1.7');
  const [visible, setVisible] = React.useState(false);
  const [port, setPort] = useState<string>('8080');
  const { apiVariables, setAPIVariables } = useAPIVariables(); //so that we can update all global API variables in API.tsx so we can send the correct calibrated calls in other screens

  //Where we post to server after getting the base IP and port
  const postURL = baseURL + ':' + port;

  // Function to update API Variables and log the updates
  const updateAPIVariables = () => {
    // New values for API variables
    const newAPIVariables = {
      postURL: baseURL + ':' + port,
      ledValue: sliderValueLED,
      soundValue: sliderValueSound,
    };

    // Set new API Variables
    setAPIVariables(newAPIVariables);

    // Log the updated values
    console.log('API Variables updated:', newAPIVariables);
  };

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
            style={stylesScreen.modalCard}
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
          <Button style={styles.button} onPress={updateAPIVariables}>
            <Text style={styles.buttonText}>SAVE CHANGES</Text>
          </Button>
        </Layout>
      </ApplicationProvider>
  );
}

//Need to wrap whole screen in APIProvider so that we can update/access API variables
export default function LABconnect() {
  return (
    <APIProvider>
      <LABconnectInner />
    </APIProvider>
  );
}


// Dynamically calculate modal width based on screen width
const screenWidth = Dimensions.get('window').width;
const modalWidth = screenWidth * 0.9; // 90% of the screen width


const stylesScreen = StyleSheet.create({
  testButton: {
    color: 'black'
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    width: modalWidth, // Use the dynamically calculated width
    alignSelf: 'center', // Center the card
},
})
