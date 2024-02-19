import { StyleSheet, Alert, Dimensions } from 'react-native';
import { View } from '../../../components/Themed';
import styles from "../../../constants/Style"
import { ApplicationProvider, Button, Divider, Layout, Text, Modal, Card, Input, Radio, RadioGroup, Spinner } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import axios from 'axios';
import { APIProvider, useAPIVariables } from '../../../APICalls/API';

function ConnectInner() {
  const { apiVariables, setAPIVariables } = useAPIVariables(); //so that we can update all global API variables in API.tsx so we can send the correct calibrated calls in other screens
  const [sliderValueLED, setSliderValueLED] = useState<number>(apiVariables.ledValue);
  const [sliderValueSound, setSliderValueSound] = useState(apiVariables.soundValue);
  const [baseURL, setBaseURL] = useState<string>(apiVariables.baseURL);
  const [visible, setVisible] = React.useState(false);
  const [port, setPort] = useState<string>('8080');
  const [deviceType, setDeviceType] = useState(0); // 0 for "lab", 1 for "portable"
  const [isVisualStimulusLoading, setIsVisualStimulusLoading] = useState(false);
  const [isAudioStimulusLoading, setIsAudioStimulusLoading] = useState(false);

  //Where we post to server after getting the base IP and port
  const postURL = baseURL + ':' + port;

  // Function to handle device type selection change and update the correct CommandNos
  const handleDeviceTypeChange = (index: number) => {
    setDeviceType(index);
    const deviceTypeValue = index === 0 ? 'lab' : 'portable';
    console.log(`Device type changed to: ${deviceTypeValue}`);
    setAPIVariables({
      deviceType: deviceTypeValue,
      ledCommandNo: index === 0 ? 1 : 2,
      audioCommandNo: index === 0 ? 2 : 3,
      gvsCommandNo: index === 0 ? 4 : 5,
    });
  };

  // Function to update API Variables and log the updates
  const updateAPIVariables = () => {
    // New values for API variables
    const newAPIVariables = {
      baseURL: baseURL,
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
    setIsVisualStimulusLoading(true); // Show spinner
    try {
      const payload = {
        brightness: apiVariables.ledValue,
        colour: {
          r: 255,
          g: 0,
          b: 0,
        },
      };

      await axios.post(`${postURL}/command/` + apiVariables.ledCommandNo + `/VisualStimulus`, payload, {
        timeout: 5000 // 5 seconds timeout
      });
      console.log('Visual stimulus sent successfully. Brightness: ' + payload.brightness + ' postURL: ' + postURL + ' commandNo' + apiVariables.ledCommandNo);
    } catch (error) {
      console.error('Error sending visual stimulus:', error);
      Alert.alert(
        "Error",
        "Failed to send visual stimulus. Please check your IP address and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsVisualStimulusLoading(false); // Hide spinner regardless of the outcome
    }
  };

  //SEND AUDIO COMMAND TO SERVER
  const sendAudioStimulus = async () => {
    setIsAudioStimulusLoading(true); // Show spinner
    try {
      const payload = {
        filename: "THETA.mp3",
        volume: apiVariables.soundValue,
        duration: 10000
      };

      await axios.post(`${postURL}/command/` + apiVariables.audioCommandNo + `/Audio`, payload, {
        timeout: 5000 // 5 seconds timeout
      });
      console.log('Audio stimulus sent successfully. Volume: ' + payload.volume);
    } catch (error) {
      console.error('Error sending audio stimulus:', error);
      Alert.alert(
        "Error",
        "Failed to send audio stimulus. Please check your IP address and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsAudioStimulusLoading(false); // Hide spinner regardless of the outcome
    }
  };



  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
      <Layout style={styles.container}>
        <Text category='h2'>Connect & Calibrate</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <RadioGroup
          selectedIndex={deviceType}
          onChange={handleDeviceTypeChange}>
          <Radio>Lab</Radio>
          <Radio>Portable</Radio>
        </RadioGroup>

        <Button style={styles.button} onPress={() => setVisible(true)}>
          <Text style={styles.buttonText}>Enter Server IP address</Text>
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
              value={baseURL.replace('http://', '')} // Formatting
              onChangeText={(value) => setBaseURL(`http://${value}`)} // Formatting
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


        <Text category='label' status='danger' style={stylesScreen.label}>Ensure to test stimuli before exiting the screen!</Text>

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
          step={5}
          onSlidingComplete={() => console.log("Sliding Complete" + { sliderValueLED })}
        />

        {isVisualStimulusLoading ? (
          <Layout style={stylesScreen.spinnerContainer}>
            <Text category='label' status='primary' style={stylesScreen.label}>Sending command...</Text>
            <Spinner size='small' />
          </Layout>
        ) : (
          <Button
            style={styles.button}
            appearance='outline'
            status='basic'
            onPress={sendVisualStimulus}
            disabled={isVisualStimulusLoading}
          >
            Test Visual Stimulus
          </Button>
        )}


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

        {isAudioStimulusLoading ? (
          <Layout style={stylesScreen.spinnerContainer}>
            <Text category='label' status='primary' style={stylesScreen.label}>Sending command...</Text>
            <Spinner size='small' />
          </Layout>
        ) : (
          <Button
            style={styles.button}
            appearance='outline'
            status='basic'
            onPress={sendAudioStimulus}
            disabled={isAudioStimulusLoading}
          >
            Test Audio Stimulus
          </Button>
        )}

        <Text category='label' status='danger'>Please save before exiting the screen!</Text>
        <Button status='danger' style={styles.button} onPress={updateAPIVariables}>
          <Text style={styles.buttonText}>SAVE CHANGES</Text>
        </Button>
      </Layout>
    </ApplicationProvider>
  );
}

//Need to wrap whole screen in APIProvider so that we can update/access API variables
export default function Connect() {
  return (
    <ConnectInner />
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
  label: {
    margin: 5
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: 10
  },
})
