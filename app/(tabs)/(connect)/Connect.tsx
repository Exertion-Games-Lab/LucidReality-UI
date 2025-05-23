import { StyleSheet, Alert, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from '../../../components/Themed';
import styles from "../../../constants/Style"
import { ApplicationProvider, Button, Divider, Layout, Text, Modal, Card, Input, Radio, RadioGroup, Spinner } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import Slider from '@react-native-community/slider';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIVariables, defaultValues, loadAPIVariables, saveAPIVariables } from '../../../APICalls/storage';
import GlobalEventEmitter from '../../../APICalls/EventEmitter';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';


function ConnectInner() {
  const [apiVariables, setApiVariables] = useState<APIVariables>(defaultValues);
  const [sliderValueLED, setSliderValueLED] = useState<number>(apiVariables.ledValue);
  const [sliderValueSound, setSliderValueSound] = useState(apiVariables.soundValue);
  const [sliderValueGVS, setSliderValueGVS] = useState(apiVariables.gvsIntensity);
  const [baseURL, setBaseURL] = useState<string>(apiVariables.baseURL);
  const [visible, setVisible] = React.useState(false);
  const [port, setPort] = useState<string>('8080');
  const [isVisualStimulusLoading, setIsVisualStimulusLoading] = useState(false);
  const [isAudioStimulusLoading, setIsAudioStimulusLoading] = useState(false);
  const [isGVSStimulusLoading, setIsGVSStimulusLoading] = useState(false);
  const [deviceTypeIndex, setDeviceTypeIndex] = useState(apiVariables.deviceType === 'lab' ? 0 : 1); // Index for UI Kitten RadioGroup

  //Where we post to server after getting the base IP and port
  const postURL = baseURL + ':' + port;

  useEffect(() => {
    const fetchApiVariables = async () => {
      const vars = await loadAPIVariables();
      setApiVariables(vars);
      setSliderValueLED(vars.ledValue);
      setSliderValueSound(vars.soundValue);
      setSliderValueGVS(vars.gvsIntensity)
      setBaseURL(vars.baseURL);
      setDeviceTypeIndex(vars.deviceType === 'lab' ? 0 : 1);
    };
    fetchApiVariables();
  }, []);

  const handleSaveChanges = async () => {
    const updatedVariables = { ...apiVariables, ledValue: sliderValueLED, soundValue: sliderValueSound, baseURL, gvsIntensity: sliderValueGVS };
    await saveAPIVariables(updatedVariables);
    Alert.alert("Success", "API variables saved.");
    GlobalEventEmitter.emit('variablesUpdated');
  };

  const handleDeviceTypeChange = async (index: number) => {
    // Explicitly define deviceType as 'portable' | 'lab' based on the index
    const deviceType: 'portable' | 'lab' = index === 0 ? 'lab' : 'portable';

    // Updated APIVariables object with the correct type for deviceType
    const updatedVariables: APIVariables = {
      ...apiVariables,
      deviceType,
      ledCommandNo: deviceType === 'lab' ? 1 : 2,
      audioCommandNo: deviceType === 'lab' ? 2 : 3,
      gvsCommandNo: deviceType === 'lab' ? 4 : 5,
      // Other properties remain unchanged
      baseURL: apiVariables.baseURL,
      port: apiVariables.port,
      ledValue: sliderValueLED,
      soundValue: sliderValueSound,
      gvsIntensity: sliderValueGVS,
      vrGame: apiVariables.vrGame,
    };

    await saveAPIVariables(updatedVariables);
    setApiVariables(updatedVariables);
    setDeviceTypeIndex(index);
  };


  //LED VALUE CHANGE
  const handleLedValueChange = async (value: number) => {
    const updatedVariables = { ...apiVariables, ledValue: value };
    setSliderValueLED(value); // Update slider value
    await saveAPIVariables(updatedVariables); // Save updated variables to AsyncStorage
    setApiVariables(updatedVariables); // Update state
  };

  //SOUND VALUE CHANGE
  const handleSoundValueChange = async (value: number) => {
    const updatedVariables = { ...apiVariables, soundValue: value };
    setSliderValueSound(value); // Update slider value
    await saveAPIVariables(updatedVariables); // Save updated variables to AsyncStorage
    setApiVariables(updatedVariables); // Update state
  };

  //GVS VALUE CHANGE
  const handleGVSValueChange = async (value: number) => {
    const updatedVariables = { ...apiVariables, gvsIntensity: value };
    setSliderValueGVS(value); // Update slider value
    await saveAPIVariables(updatedVariables); // Save updated variables to AsyncStorage
    setApiVariables(updatedVariables); // Update state
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

  //SEND GVS COMMAND TO SERVER
  const sendGVSStimulus = async () => {
    setIsGVSStimulusLoading(true); // Show spinner
    try {
      const payload = {
        millis: 1000,
        intensity: apiVariables.gvsIntensity
      };

      await axios.post(`${postURL}/command/` + apiVariables.gvsCommandNo + `/GVS_Stimulus`, payload, {
        timeout: 5000 // 5 seconds timeout
      });
      console.log('GVS Stimulus sent. Intensity: ' + payload.intensity);
    } catch (error) {
      console.error('Error sending GVS stimulus:', error);
      Alert.alert(
        "Error",
        "Failed to send GVS stimulus. Please check your IP address and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsGVSStimulusLoading(false); // Hide spinner regardless of the outcome
    }
  };



  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
      <ScrollView>
      <Layout style={styles.container}>
        <Text category='h2'>Connect & Calibrate</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <RadioGroup
          selectedIndex={deviceTypeIndex}
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
        <Text category='c1'>{apiVariables.ledValue}</Text>
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={0}
          maximumValue={40}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          value={apiVariables.ledValue}
          onValueChange={value => handleLedValueChange(value)}
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
            onPress={sendVisualStimulus}
            disabled={isVisualStimulusLoading}
          >
            Test Visual Stimulus
          </Button>
        )}


        <Text category='h6'>Sound Volume</Text>
        <Text category='c1'>{apiVariables.soundValue}</Text>
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          value={apiVariables.soundValue}
          onValueChange={value => handleSoundValueChange(value)}
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
            onPress={sendAudioStimulus}
            disabled={isAudioStimulusLoading}
          >
            Test Audio Stimulus
          </Button>
        )}

        {/* <Text category='h6'>GVS Intensity</Text>
        <Text category='c1'>{apiVariables.gvsIntensity}</Text>
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={0}
          maximumValue={255}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          value={apiVariables.gvsIntensity}
          onValueChange={value => handleGVSValueChange(value)}
          step={5}
          onSlidingComplete={() => console.log("Sliding complete" + { sliderValueGVS })}
        />

        {isGVSStimulusLoading ? (
          <Layout style={stylesScreen.spinnerContainer}>
            <Text category='label' status='primary' style={stylesScreen.label}>Sending command...</Text>
            <Spinner size='small' />
          </Layout>
        ) : (
          <Button
            style={styles.button}
            onPress={sendGVSStimulus}
            disabled={isGVSStimulusLoading}
          >
            Test GVS Stimulus
          </Button>
        )} */}

      
        <Text category='label' status='danger'>Please save before exiting the screen!</Text>
        <Button status='danger' style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>SAVE CHANGES</Text>
        </Button>

      </Layout>
      </ScrollView>
    </ApplicationProvider>
  );
}

//Need to wrap whole screen in APIProvider so that we can update/access API variables
export default function Connect() {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ConnectInner />
      </GestureHandlerRootView>
    </>
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
