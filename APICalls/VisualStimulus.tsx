import React from 'react';
import { View, Button } from 'react-native';
import axios from 'axios';

const base_url = "http://192.168.1.64:8080";

const VisualStimulusScreen: React.FC = () => {
  const sendVisualStimulus = async (
    brightness: number = 20,
    red: number = 255,
    green: number = 0,
    blue: number = 0
  ) => {
    try {
      const payload = {
        brightness,
        colour: {
          r: red,
          g: green,
          b: blue,
        },
      };

      await axios.post(`${base_url}/command/2/VisualStimulus`, payload);
      console.log('Visual stimulus sent successfully.');
    } catch (error) {
      console.error('Error sending visual stimulus:', error);
    }
  };

  return (
    <View>
      <Button
        title="Test Visual Stimulus"
        onPress={() => sendVisualStimulus(50, 255, 0, 0)}
      />
    </View>
  );
};

export default VisualStimulusScreen;
