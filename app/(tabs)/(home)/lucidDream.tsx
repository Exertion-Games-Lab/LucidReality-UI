import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, ScrollView, Platform } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import styles from "../../../constants/Style";
import { ApplicationProvider, Button, Text, Layout, Icon, IconElement, IconRegistry, Card, Spinner, Modal } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import Timer from '../../../components/Timer';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { APIVariables, defaultValues, loadAPIVariables, saveAPIVariables } from '../../../APICalls/storage';
import GlobalEventEmitter from '../../../APICalls/EventEmitter';

const arrow = (props: any) => (
    <Icon name='arrow-forward-outline' {...props} animation='pulse' />
);

export default function lucidDream() {
    //const { apiVariables, setAPIVariables } = useAPIVariables();
    const [modalVisible, setModalVisible] = useState(false);
    const [remTimes, setRemTimes] = useState<string[]>([]);
    const [apiVariables, setApiVariables] = useState<APIVariables>(defaultValues);
    const [remState, setRemState] = useState('Checking connection...');
    const [connectionStatus, setConnectionStatus] = useState('Checking connection...');
    const [isLoading, setIsLoading] = useState(true);
    const [sessionActive, setSessionActive] = useState(false);

    const postURL = apiVariables.baseURL + ':' + apiVariables.port
    const intervalIdRef = useRef<NodeJS.Timeout | number | null>(null);

    //Reloads variables if save button is pressed on connect page
    useEffect(() => {
        const fetchVariables = async () => {
            const loadedVariables = await loadAPIVariables();
            setApiVariables(loadedVariables);
        };

        // Listen for updates
        const updateListener = () => {
            fetchVariables(); // Re-fetch variables when an update is detected
        };

        GlobalEventEmitter.on('variablesUpdated', updateListener);

        // Initial fetch
        fetchVariables();

        // Cleanup
        return () => {
            GlobalEventEmitter.removeListener('variablesUpdated', updateListener);
        };
    }, []);

    useEffect(() => {
        if (!sessionActive) return;
        const interval = setInterval(checkREMState, 5000);
        return () => clearInterval(interval);
    }, [sessionActive]);

    useEffect(() => {

        let intervalId: NodeJS.Timeout | undefined; // Declare variable to store interval ID
        if (remState === 'REM_PERIOD') {
            // sendCommands();
            intervalId = setInterval(() => {
                // Code to execute periodically
                // sendCommands();
                sendCommands();
            }, 20000); // Interval time in milliseconds
            
            //using interval here
        } else {
            // if not in REM state or session not active then clear the interval.
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
        //else if not REM, clearinterval
        //if session deactive, clear interval
    }, [remState, sessionActive]);

    const checkREMState = () => {
        // Implementation of REM state checking logic
        
        const url = `${apiVariables.baseURL}:5050/get_rem`; //flask server runs on port 5050 and main server on port 8080

        // Make a GET request to the endpoint
        fetch(url)
            .then(response => {
                // Check if the response is successful
                if (response.ok) {
                    return response.json(); // Parse the JSON response body
                } else {
                    // If the response is not successful, throw an error
                    throw new Error('Failed to fetch REM state');
                }
            })
            .then(data => {
                // Update the REM state with the data received from the server
                setRemState(data.state); // Assuming the JSON response contains a "state" field
                setConnectionStatus('Connected'); // Update connection status
                setIsLoading(false); // Stop showing the loading spinner
                if (data.state === 'REM_PERIOD') {
                    // Capture the current time
                    const currentTime = new Date().toLocaleTimeString();
                    setRemTimes(prevTimes => [...prevTimes, currentTime]);
                }
            })
            .catch(error => {
                console.error('Error fetching REM state:', error);
                setConnectionStatus('reconnecting...');
                setRemState('reconnecting...')
                setIsLoading(true); // Optionally, show the loading spinner if trying to reconnect or fetch again
            });


    };

    const startSession = () => {
        if (sessionActive) {
            console.log('Session is already active.');
            return;
        }

        setSessionActive(true);

        // Immediately send commands before setting the interval
        sendCommands();
    };

    const sendCommands = async () => {
        if (remState === 'REM_PERIOD' && sessionActive) {
            console.log("REM_PERIOD detected, sending commands...");
            try {
                const payloadAudio = {
                    filename: "THETA.mp3",
                    volume: apiVariables.soundValue,
                    duration: 10000
                };
                const payloadLED = {
                    brightness: apiVariables.ledValue,
                    colour: {
                        r: 255,
                        g: 0,
                        b: 0,
                    },
                }
                const payloadTACS = {
                    millis: 10000,
                    intensity: apiVariables.tacsIntensity,
                    frequency: apiVariables.tacsFrequency
                }

                await axios.post(`${postURL}/command/${apiVariables.audioCommandNo}/Audio`, payloadAudio, { timeout: 5000 });
                console.log('Audio command sent successfully.');
                await axios.post(`${postURL}/command/${apiVariables.ledCommandNo}/VisualStimulus`, payloadLED, { timeout: 5000 });
                console.log('Visual stimulus sent successfully.');
                await axios.post(`${postURL}/command/${apiVariables.tacsCommandNo}/TacsStimulus`, payloadTACS, {
                    timeout: 5000 // 5 seconds timeout
                  });
                console.log('TACS stimulus sent successfully.');
                console.log('Commands sent successfully.');
            } catch (error) {
                console.error('Error sending commands:', error);
            } finally {
                setIsLoading(false); // Stop loading spinner after sending commands
            }
        }
    };

    const endSession = () => {
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
        setSessionActive(false);
        setModalVisible(true);
    };



    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                <Stack.Screen options={{ headerTitle: 'Lucid Dream Session' }} />
                <Layout style={stylesScreen.titleContainer}>
                    <Text status='success' style={stylesScreen.boldText} category='p2'>Recommended minimum 2 hours to ensure REM is reached</Text>
                </Layout>
                <Layout>
                    <Card style={styles.card}>
                        <Layout style={stylesScreen.row}>
                            <Text style={stylesScreen.text} category='s1'>Connection Status: {connectionStatus}</Text>
                            {!isLoading && <AntDesign name="checkcircle" size={24} color="white" />}
                            {isLoading && <Spinner size='small' />}
                        </Layout>
                    </Card>
                    <Card style={styles.card}>
                        <Layout style={stylesScreen.row}>
                            <Text style={stylesScreen.text} category='s1'>REM State: {remState}</Text>
                            {!isLoading && <AntDesign name="checkcircle" size={24} color="white" />}
                            {isLoading && <Spinner size='small' />}
                        </Layout>
                    </Card>
                </Layout>
                <Layout style={styles.container}>
                    <Timer defaultHours={4} defaultMinutes={0} />

                    <Link href="/lucidDream" asChild>
                        <Button onPress={sessionActive ? endSession : startSession} style={styles.button}>
                            <Text>{sessionActive ? 'End Session' : 'Start Session'}</Text>
                        </Button>
                    </Link>

                    <Modal
                        visible={modalVisible}
                        backdropStyle={stylesScreen.backdrop}
                        onBackdropPress={() => setModalVisible(false)}>
                        <Card disabled={true}>
                            <Text category='h6'>REM Period Achieved At:</Text>
                            <ScrollView>
                                {remTimes.map((time, index) => (
                                    <Text key={index}>{time}</Text>
                                ))}
                            </ScrollView>
                            <Button onPress={() => setModalVisible(false)}>
                                Close
                            </Button>
                        </Card>
                    </Modal>

                </Layout>
            </ApplicationProvider>
        </>
    );
}

const stylesScreen = StyleSheet.create({
    titleContainer: {
        alignItems: 'center',
        paddingTop: 7,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    titleCard: {
        marginBottom: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        width: 325,
        height: 200,
        backgroundColor: '#0553',
        borderRadius: 30,
    },

    imageCard: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 'auto',
        padding: 1,
        borderRadius: 30,
        margin: 10,
    },
    boldText: {
        fontWeight: 'bold',
        paddingVertical: 5,
    },
    button: {
        justifyContent: 'center',
        borderWidth: 1,
        alignItems: 'center',
        width: 25,
        height: 25,
        borderRadius: 50,
        borderColor: 'black',
        backgroundColor: 'black',
    },
    icon: {
        width: 25,
        height: 25,
        size: 50
    },
    card: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 'auto',
        padding: 0,
        borderRadius: 10,
        margin: 5,
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center', // This ensures the text and spinner are vertically aligned
        backgroundColor: 'rgba(0,0,0,0)',
    },
    text: {
        marginRight: 10, // Adds some spacing between the text and the spinner
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
