import React, { useState, useEffect } from 'react';
import { StyleSheet, Keyboard } from 'react-native';

import { ApplicationProvider, Button, Text, Layout, Icon, IconElement, IconRegistry, Card, Input } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const playIcon = (props: any): IconElement => (
  <Icon
    {...props}
    name='play-circle-outline'
  />
);

const pauseIcon = (props: any): IconElement => (
  <Icon
    {...props}
    name='pause-circle-outline'
  />
);

const resetIcon = (props: any): IconElement => (
  <Icon
    {...props}
    name='refresh-outline'
  />
);

const Timer = () => {
  const [initialTime, setInitialTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setRemainingTime((prevRemainingTime) => {
          if (prevRemainingTime === 0) {
            setIsRunning(false);
            clearInterval(interval);
            return 0;
          }
          return prevRemainingTime - 1000;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingTime(initialTime);
  };

  const handleTimeChange = (text: string) => {
    const newTime = parseInt(text, 10) * 60000;
    setInitialTime(newTime);
    setRemainingTime(newTime);
  };

  const formatTime = (milliseconds: any) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (


    <Layout style={styles.container} >
      <Input style={styles.input}
        placeholder="Enter time in minutes"
        keyboardType="numeric"
        onChangeText={handleTimeChange}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Layout>
          <Text style={styles.time}>{formatTime(remainingTime)}</Text>
        </Layout>
      </TouchableWithoutFeedback>
      <Layout style={styles.buttonContainer}>
        <Button style={styles.button} onPress={handleStartStop} status='success'>
          <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
        </Button>
        <Button style={styles.button} onPress={handleReset} status='danger'>
          <Text style={styles.buttonText}>Reset</Text>
        </Button>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: '10%'
  },
  time: {
    fontSize: 66,
    margin: '10%',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
  },
  button: {
    margin: '1%',
    width: '40%',
    paddingVertical: 'auto',
  },
});

export default Timer;