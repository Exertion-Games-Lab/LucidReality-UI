import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, ScrollView, Platform } from 'react-native';

import { useEffect, useRef, useState } from 'react';

import { View } from '../../../components/Themed';

import styles from "../../../constants/Style";

import { ApplicationProvider, Button, Text, Layout, Icon, IconElement, IconRegistry, Card, Spinner } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import Timer from '../../../components/Timer';

import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AntDesign } from '@expo/vector-icons';
import { useAPIVariables } from '../../../APICalls/API';
import axios from 'axios';

const arrow = (props: any) => (
    <Icon name='arrow-forward-outline' {...props} animation='pulse' />
);

export default function lucidDream() {
    const { apiVariables, setAPIVariables } = useAPIVariables();
    const [remState, setRemState] = useState('Checking connection...');
    const [connectionStatus, setConnectionStatus] = useState('Checking connection...');
    const [isLoading, setIsLoading] = useState(true);
    const [sessionActive, setSessionActive] = useState(false);
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

    const postURL = apiVariables.baseURL + ':' + apiVariables.port
    const intervalIdRef = useRef<NodeJS.Timeout | number | null>(null);

    const startSession = () => {
        if (sessionActive) {
            console.log('Session is already active.');
            return;
        }
    
        setSessionActive(true);
        intervalIdRef.current = setInterval(() => {
            (async () => {
                if (remState === 'REM_PERIOD') {
                    console.log("REM_PERIOD detected, sending commands...");
                    try {
                        await axios.post(`${postURL}/command/${apiVariables.audioCommandNo}/Audio`, payloadAudio, { timeout: 5000 });
                        await axios.post(`${postURL}/command/${apiVariables.ledCommandNo}/VisualStimulus`, payloadLED, { timeout: 5000 });
                        console.log('Commands sent successfully.');
                    } catch (error) {
                        console.error('Error sending commands:', error);
                    }
                }
            })();
        }, 5000); 
    };
    

    const endSession = () => {
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
        setSessionActive(false);
    };

    useEffect(() => {
        const sendCommands = async () => {
            if (remState === 'REM_PERIOD' && sessionActive) {
                console.log("REM_PERIOD detected, session active, sending commands...");
                try {
                    await axios.post(`${postURL}/command/${apiVariables.audioCommandNo}/Audio`, payloadAudio, { timeout: 5000 });
                    console.log('Audio command sent successfully.');
                    await axios.post(`${postURL}/command/${apiVariables.ledCommandNo}/VisualStimulus`, payloadLED, { timeout: 5000 });
                    console.log('Visual stimulus sent successfully.');
                } catch (error) {
                    console.error('Error sending commands:', error);
                }
            }
        };
    
        sendCommands();
    }, [remState, sessionActive, apiVariables, postURL, payloadAudio, payloadLED]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`http://127.0.0.1:5000/get_rem`) //always runs on this IP and port by default regardless of device
                .then((response) => {
                    if (response.ok) {
                        setConnectionStatus('Connected');
                        setIsLoading(false); // Stop showing the loading spinner once connected
                        return response.json();
                    } else {
                        throw new Error('Server responded with an error!');
                    }
                })
                .then((data) => {
                    setRemState(data.state);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setConnectionStatus('reconnecting...');
                    setRemState('reconnecting...')
                    setIsLoading(true); // Show the loading spinner on error
                });
        }, 5000); // Poll every 5000 milliseconds (5 seconds)

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);

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
        marginLeft: 10
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
});
