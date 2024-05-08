import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import styles from "../../../constants/Style";
import { ApplicationProvider, Button, Text, Layout, Icon, IconElement, IconRegistry, Card } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import Timer from '../../../components/Timer';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { loadAPIVariables, APIVariables, defaultValues } from '../../../APICalls/storage';
import GlobalEventEmitter from '../../../APICalls/EventEmitter';

const arrow = (props: any) => (
    <Icon name='arrow-forward-outline' {...props} animation='pulse' />
);

export default function cognitiveTraining() {
    // loads from AsyncStorage
    const [apiVariables, setApiVariables] = useState<APIVariables>(defaultValues);
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // To control spinner visibility

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

    // Ensure apiVariables is loaded before proceeding
    if (!apiVariables) return null; // Or some loading state

    const sendCommands = async () => {
        setIsLoading(true); // Show spinner when sending commands

        const payloadAudio = {
            filename: "THETA.mp3",
            volume: apiVariables.soundValue,
            duration: 10000,
        };
        const payloadLED = {
            brightness: apiVariables.ledValue,
            colour: { r: 255, g: 0, b: 0 },
        };
        const payloadGVS = {
            millis: 10000,
            intensity: apiVariables.gvsIntensity
        }
        const postURL = `${apiVariables.baseURL}:${apiVariables.port}`;

        const audioCommandPromise = axios.post(`${postURL}/command/${apiVariables.audioCommandNo}/Audio`, payloadAudio);
        const ledCommandPromise = axios.post(`${postURL}/command/${apiVariables.ledCommandNo}/VisualStimulus`, payloadLED);
        const GVSCommandPromise = axios.post(`${postURL}/command/${apiVariables.gvsCommandNo}/GVS_Stimulus`, payloadGVS, {
            timeout: 5000 // 5 seconds timeout
          });
    

        Promise.all([audioCommandPromise, ledCommandPromise, GVSCommandPromise])
            .then(([audioResponse, ledResponse]) => {
                console.log('Audio command sent');
                console.log('LED command sent');
                console.log('GVS command sent sent.');
            })
            .catch((error) => {
                // Log and alert the error. Stop sending stimuli too
                toggleSending();
                Alert.alert("Error", "Failed to send commands. Please check your connection and try again.");
                console.error('Error sending commands:', error);
            })
            .finally(() => {
                setIsLoading(false); // Hide spinner after commands are sent or failed
            });
    };


    useEffect(() => {
        if (isSending) {
            sendCommands(); // Send immediately
            const intervalId = setInterval(sendCommands, 20000); // Then every 11 seconds

            return () => clearInterval(intervalId);
        }
    }, [isSending, apiVariables]);

    const toggleSending = () => setIsSending(!isSending);

    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                <Stack.Screen options={{ headerTitle: 'Cognitive Training Session' }} />
                <Layout style={styles.container}>
                    <ScrollView>
                        <Card style={styles.card}>
                            <Text category='label' status='primary'>What should I do?</Text>
                            <Text category='s1' style={stylesScreen.spacing}>If you have not calibrated the intensity of the stimuli, please switch to “Get Started - Connect & Calibrate”. </Text>
                            <Text category='s1' style={stylesScreen.spacing}>Please press “Start Stimuli” and familiarize yourself with the stimuli and their feelings.</Text>
                            <Text category='s1' style={stylesScreen.spacing}>Close your eyes. Whenever recognizing the stimuli, please ask yourself whether you are dreaming. This associates your self-awareness with the stimuli. Please set up a timer (recommended time: 20 minutes) for this session. </Text>
                        </Card>
                        <Button onPress={toggleSending} status={isSending ? 'danger' : 'success'}>
                            {isSending ? 'Stop Stimuli' : 'Start Stimuli'}
                        </Button>
                        <Timer defaultHours={0} defaultMinutes={10} />
                    </ScrollView>
                </Layout>
                <Link href="/lucidDream" asChild>
                    <Button status='success' style={styles.buttonFixed} accessoryRight={arrow}>
                        <Text>Next</Text>
                    </Button>
                </Link>
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
        marginLeft: 10
    },
    icon: {
        width: 25,
        height: 25,
        size: 50
    },
    spacing: {
        margin: 5
    }
});
