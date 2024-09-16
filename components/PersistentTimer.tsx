import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  AppState,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
  Animated,
  AppStateStatus, 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused } from '@react-navigation/native';
import * as Notifications from 'expo-notifications'; // Import Notifications API

const screen = Dimensions.get("window");

const formatNumber = (number: number) => `0${number}`.slice(-2);

const getRemaining = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return {
    hours: formatNumber(hours),
    minutes: formatNumber(minutes),
    seconds: formatNumber(seconds),
  };
};

const createArray = (length: number) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(i.toString());
  }
  return arr;
};

const AVAILABLE_HOURS = createArray(24);
const AVAILABLE_MINUTES = createArray(60);

const PersistentTimer = ({
  defaultHours = 0,
  defaultMinutes = 0,
}) => {
  const isFocused = useIsFocused();
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    defaultHours * 3600 + defaultMinutes * 60
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedHours, setSelectedHours] = useState<string>(
    defaultHours.toString()
  );
  const [selectedMinutes, setSelectedMinutes] = useState<string>(
    formatNumber(defaultMinutes)
  );
  const [timerEnded, setTimerEnded] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const soundObjectRef = useRef<Audio.Sound | null>(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const loadState = async () => {
      try {
        const state = await AsyncStorage.getItem("PERSISTENT_TIMER_STATE");
        if (state) {
          const parsedState = JSON.parse(state);
          if (parsedState) {
            setRemainingSeconds(parsedState.remainingSeconds);
            setIsRunning(parsedState.isRunning);
            setSelectedHours(parsedState.selectedHours);
            setSelectedMinutes(parsedState.selectedMinutes);
            setTimerEnded(parsedState.timerEnded);
          }
        }

        const endTime = await AsyncStorage.getItem("PERSISTENT_TIMER_END_TIME");
        if (endTime) {
          const timeLeft = Math.floor((parseInt(endTime, 10) - Date.now()) / 1000);
          if (timeLeft > 0) {
            setRemainingSeconds(timeLeft);
            if (isRunning) {
              startTimer(timeLeft);
            }
          } else {
            stopTimer(true);
          }
        }
      } catch (error) {
        console.error("Failed to load state", error);
      }
    };

    loadState();

    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    }).then(() => {
      soundObjectRef.current = new Audio.Sound();
      soundObjectRef.current.loadAsync(
        require("../assets/audio/alarm.mp3")
      );
    });

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (soundObjectRef.current) {
        soundObjectRef.current.unloadAsync();
      }
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const saveState = async () => {
      try {
        const stateToSave = JSON.stringify({
          remainingSeconds,
          isRunning,
          selectedHours,
          selectedMinutes,
          timerEnded,
        });
        await AsyncStorage.setItem("PERSISTENT_TIMER_STATE", stateToSave);
      } catch (error) {
        console.error("Failed to save state", error);
      }
    };

    saveState();
  }, [remainingSeconds, isRunning, selectedHours, selectedMinutes, timerEnded]);

  useEffect(() => {
    if (remainingSeconds <= 0 && isRunning) {
      stopTimer(true);
    }
  }, [remainingSeconds]);

  useEffect(() => {
    if (isFocused && isRunning) {
      const handleAppFocus = async () => {
        // Clear the previous timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
  
        const storedEndTime = await AsyncStorage.getItem("PERSISTENT_TIMER_END_TIME");
        if (storedEndTime) {
          const endTime = parseInt(storedEndTime, 10);
          const now = Date.now();
          const timeLeft = Math.floor((endTime - now) / 1000);
  
          if (timeLeft > 0) {
            setRemainingSeconds(timeLeft);  // Sync remaining seconds with real time
            startTimer(timeLeft);  // Start the timer from the recalculated time
          } else {
            setRemainingSeconds(0);  // Timer has ended, reset to 0
            stopTimer(true);  // Stop the timer
          }
        }
      };
  
      handleAppFocus();  // Sync when app gains focus
    }
  
    return () => {
      // Cleanup when the component unmounts or focus changes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isFocused, isRunning]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      const now = Date.now();
      const storedEndTime = await AsyncStorage.getItem("PERSISTENT_TIMER_END_TIME");
      if (storedEndTime) {
        const endTime = parseInt(storedEndTime, 10);
        const timeLeft = Math.floor((endTime - now) / 1000);
        if (timeLeft > 0) {
          setRemainingSeconds(timeLeft);
        } else {
          setRemainingSeconds(0);
          stopTimer(true);
        }
      }
    } else if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
      if (isRunning) {
        const endTime = Date.now() + remainingSeconds * 1000;
        await AsyncStorage.setItem("PERSISTENT_TIMER_END_TIME", endTime.toString());
      }
    }
    appState.current = nextAppState;
  };

  const startTimer = (seconds: number) => {
    // Clear any existing timer before starting a new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (seconds > 0) {
      timeoutRef.current = setTimeout(() => {
        setRemainingSeconds(seconds - 1);
        startTimer(seconds - 1);  // Recursive call to continue the countdown
      }, 1000);

      // Schedule notification for when the timer ends
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Timer Ended!",
          body: "Your countdown timer has finished.",
        },
        trigger: { seconds },  // Trigger the notification after 'seconds'
      });
    } else {
      stopTimer(true);  // Stop the timer when it reaches 0
    }
  };
  
  const stopTimer = async (ended = false) => {
    // Clear any running timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsRunning(false);
    setTimerEnded(ended);

    // Clear the stored end time
    await AsyncStorage.removeItem("PERSISTENT_TIMER_END_TIME");

    if (ended) {
      playSound();  // Play sound if timer ended
      startShake();  // Start shake animation if needed
      // No need to schedule another notification here, as it's already been scheduled.
    }
  };

  const start = async () => {
    // Clear any existing timer before starting a new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  
    const totalSeconds =
      parseInt(selectedHours, 10) * 3600 +
      parseInt(selectedMinutes, 10) * 60;
  
    // Set remaining seconds to the selected time
    setRemainingSeconds(totalSeconds);
    setIsRunning(true);
  
    // Store the end time for persistence
    await AsyncStorage.setItem(
      "PERSISTENT_TIMER_END_TIME",
      (Date.now() + totalSeconds * 1000).toString()
    );
  
    // Start the timer
    startTimer(totalSeconds);
  };

  const stop = () => {
    stopTimer(false);
  };

  const playSound = async () => {
    if (soundObjectRef.current) {
      await soundObjectRef.current.replayAsync();
    }
  };

  const stopSound = async () => {
    if (soundObjectRef.current) {
      await soundObjectRef.current.stopAsync();
    }
    setTimerEnded(false);
    shakeAnimation.stopAnimation();
    shakeAnimation.setValue(0);
  };

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => startShake());
  };

  const { hours, minutes, seconds } = getRemaining(remainingSeconds);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {isRunning ? (
        <Text style={styles.timerText}>{`${hours}:${minutes}:${seconds}`}</Text>
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            itemStyle={styles.pickerItem}
            selectedValue={selectedHours}
            onValueChange={setSelectedHours}
            mode="dropdown"
          >
            {AVAILABLE_HOURS.map((value) => (
              <Picker.Item key={value} label={value} value={value} />
            ))}
          </Picker>
          <Text style={styles.pickerItem}>hours</Text>
          <Picker
            style={styles.picker}
            itemStyle={styles.pickerItem}
            selectedValue={selectedMinutes}
            onValueChange={setSelectedMinutes}
            mode="dropdown"
          >
            {AVAILABLE_MINUTES.map((value) => (
              <Picker.Item key={value} label={value} value={value} />
            ))}
          </Picker>
          <Text style={styles.pickerItem}>minutes</Text>
        </View>
      )}
      {isRunning ? (
        <TouchableOpacity
          onPress={stop}
          style={[styles.button, styles.buttonStop]}
        >
          <Text style={[styles.buttonText, styles.buttonTextStop]}>Pause</Text>
        </TouchableOpacity>
      ) : timerEnded ? (
        <Animated.View
          style={{
            transform: [{ translateX: shakeAnimation }],
          }}
        >
          <TouchableOpacity onPress={stopSound} style={styles.button}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <TouchableOpacity onPress={start} style={styles.button}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  timerText: {
    color: "#fff",
    fontSize: 90,
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonStop: {
    borderColor: "#FF851B",
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF",
  },
  buttonTextStop: {
    color: "#FF851B",
  },
  picker: {
    width: 100,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "rgba(92, 92, 92, 0.206)",
      },
    }),
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20,
    ...Platform.select({
      android: {
        marginLeft: 10,
        marginRight: 10,
      },
    }),
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  clearButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ff4040",
    borderRadius: 10,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default PersistentTimer;