import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import { Picker } from "@react-native-picker/picker";
import { Button } from "@ui-kitten/components";
import { Animated } from "react-native";


const screen = Dimensions.get("window");

interface AppProps {
  defaultHours?: number; // Optional prop for default hours
  defaultMinutes?: number; // Optional prop for default minutes
}

interface AppState {
  remainingSeconds: number;
  isRunning: boolean;
  selectedHours: string;
  selectedMinutes: string;
  timerEnded: boolean;
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

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    const { defaultHours = 0, defaultMinutes = 0 } = this.props;
    this.state = {
      remainingSeconds: defaultHours * 3600 + defaultMinutes * 60,
      isRunning: false,
      selectedHours: defaultHours.toString(),
      selectedMinutes: formatNumber(defaultMinutes),
      timerEnded: false,
    };
  }


  interval: NodeJS.Timeout | null = null;
  soundObject: Audio.Sound | null = null;
  shakeAnimation = new Animated.Value(0);

  startShake = () => {
    Animated.sequence([
      Animated.timing(this.shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(this.shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(this.shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(this.shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start(() => this.startShake()); // Loop the animation
  };

  async componentDidMount() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

    this.soundObject = new Audio.Sound();
    await this.soundObject.loadAsync(require("../assets/audio/alarm.mp3"));
  }

  componentDidUpdate(prevProps: {}, prevState: AppState) {
    if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
      this.stopTimer(true); // Pass a flag indicating the timer ended naturally
    }
  }

  stopTimer = (ended = false) => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.setState({
      remainingSeconds: 5, 
      isRunning: false,
      timerEnded: ended, // Flag to set the timerEnded state
    });

    if (ended) {
      this.playSound();
      this.startShake();
    }
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    if (this.soundObject) {
      this.soundObject.unloadAsync();
    }
  }

  start = () => {
    this.setState((state) => ({
      remainingSeconds:
        parseInt(state.selectedHours, 10) * 3600 +
        parseInt(state.selectedMinutes, 10) * 60,
      isRunning: true,
    }));
    this.interval = setInterval(() => {
      this.setState((state) => ({
        remainingSeconds: state.remainingSeconds - 1,
      }));
    }, 1000);
  };

  stop = () => {
    this.stopTimer(); // Just stop the timer without playing the sound.
  };

  playSound = async () => {
    if (this.soundObject) {
      await this.soundObject.replayAsync(); 
    }
  };

  stopSound = async () => {
    if (this.soundObject) {
      await this.soundObject.stopAsync();
    }
    // Reset timerEnded to false after stopping the sound to revert UI changes
    this.setState({ timerEnded: false });
  };

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedHours}
        onValueChange={(itemValue) => {
          this.setState({ selectedHours: itemValue });
        }}
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
        selectedValue={this.state.selectedMinutes}
        onValueChange={(itemValue) => {
          this.setState({ selectedMinutes: itemValue });
        }}
        mode="dropdown"
      >
        {AVAILABLE_MINUTES.map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>minutes</Text>
    </View>
  );

  render() {
    const { hours, minutes, seconds } = getRemaining(this.state.remainingSeconds);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {this.state.isRunning ? (
          <Text style={styles.timerText}>{`${hours}:${minutes}:${seconds}`}</Text>
        ) : (
          this.renderPickers()
        )}
        {this.state.isRunning ? (
          <TouchableOpacity onPress={() => this.stopTimer(false)} style={[styles.button, styles.buttonStop]}>
            <Text style={[styles.buttonText, styles.buttonTextStop]}>Pause</Text>
          </TouchableOpacity>
        ) : this.state.timerEnded ? ( // Check if the timer has ended
          <Animated.View
            style={{
              transform: [{ translateX: this.shakeAnimation }]
            }}
          >
            <TouchableOpacity onPress={this.stopSound} style={styles.button}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <TouchableOpacity onPress={this.start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  Button: {
    margin: 30
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