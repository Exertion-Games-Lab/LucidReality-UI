import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused } from '@react-navigation/native';

const screen = Dimensions.get("window");

interface AppProps {
  defaultHours?: number;
  defaultMinutes?: number;
}

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
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }
  return arr;
};

const AVAILABLE_HOURS = createArray(24);
const AVAILABLE_MINUTES = createArray(60);

const STORAGE_KEY = "PERSISTENT_TIMER_STATE";

const PersistentTimer: React.FC<AppProps> = ({ defaultHours = 0, defaultMinutes = 0 }) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    defaultHours * 3600 + defaultMinutes * 60
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedHours, setSelectedHours] = useState<string>(defaultHours.toString());
  const [selectedMinutes, setSelectedMinutes] = useState<string>(formatNumber(defaultMinutes));
  const [timerEnded, setTimerEnded] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundObjectRef = useRef<Audio.Sound | null>(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadState = async () => {
      try {
        const state = await AsyncStorage.getItem(STORAGE_KEY);
        if (state) {
          const parsedState = JSON.parse(state);
          setRemainingSeconds(parsedState.remainingSeconds);
          setIsRunning(parsedState.isRunning);
          setSelectedHours(parsedState.selectedHours);
          setSelectedMinutes(parsedState.selectedMinutes);
          setTimerEnded(parsedState.timerEnded);
          if (parsedState.isRunning) {
            startTimer();
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
      soundObjectRef.current.loadAsync(require("../assets/audio/alarm.mp3"));
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (soundObjectRef.current) {
        soundObjectRef.current.unloadAsync();
      }
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
        await AsyncStorage.setItem(STORAGE_KEY, stateToSave);
      } catch (error) {
        console.error("Failed to save state", error);
      }
    };

    saveState();
  }, [remainingSeconds, isRunning, selectedHours, selectedMinutes, timerEnded]);

  useEffect(() => {
    if (remainingSeconds === 0 && isRunning) {
      stopTimer(true);
    }
  }, [remainingSeconds]);

  useEffect(() => {
    if (isFocused && isRunning) {
      startTimer();
    } else if (!isFocused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isFocused]);

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start(() => startShake());
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setRemainingSeconds(prevState => prevState - 1);
    }, 1000);
  };

  const start = () => {
    setRemainingSeconds(
      parseInt(selectedHours, 10) * 3600 + parseInt(selectedMinutes, 10) * 60
    );
    setIsRunning(true);
    startTimer();
  };

  const stopTimer = (ended = false) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setTimerEnded(ended);
    if (ended) {
      playSound();
      startShake();
    }
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
            {AVAILABLE_HOURS.map(value => (
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
            {AVAILABLE_MINUTES.map(value => (
              <Picker.Item key={value} label={value} value={value} />
            ))}
          </Picker>
          <Text style={styles.pickerItem}>minutes</Text>
        </View>
      )}
      {isRunning ? (
        <TouchableOpacity onPress={stop} style={[styles.button, styles.buttonStop]}>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  timerText: {
    color: "#fff",
    fontSize: 90,
  },
  picker: {
    flex: 1,
    maxWidth: 100,
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
});

export default PersistentTimer;