import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import styles from "../../../constants/Style";
import { ApplicationProvider, Button, Text, Layout, Icon, IconElement, IconRegistry, Card } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import Timer from '../../../components/Timer';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useEffect, useState } from 'react';
import { useAPIVariables } from '../../../APICalls/API';
import axios from 'axios';

const arrow = (props: any) => (
    <Icon name='arrow-forward-outline' {...props} animation='pulse' />
);




export default function cognitiveTraining() {
    const { apiVariables, setAPIVariables } = useAPIVariables()
    const [isSending, setIsSending] = useState(false);
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
    const postURL=apiVariables.baseURL + ':' + apiVariables.port;

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;

        if (isSending) {
            intervalId = setInterval(() => {
                console.log(apiVariables)
                axios.post(`${postURL}/command/` + apiVariables.audioCommandNo + `/Audio`, payloadAudio, {
                    timeout: 5000 // 5 seconds timeout
                })
                axios.post(`${postURL}/command/` + apiVariables.ledCommandNo + `/VisualStimulus`, payloadLED, {
                    timeout: 5000 // 5 seconds timeout
                })
            }, 11000); // Send commands every 15 seconds
        }

        return () => {
            if (intervalId !== undefined) {
                clearInterval(intervalId); // Clear interval on component unmount or when isSending changes to false
            }
        };
    }, [isSending]);


    const toggleSending = () => setIsSending(!isSending);
    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                <Stack.Screen options={{ headerTitle: 'Cognitive Training' }} />
                <Layout style={styles.container}>
                    <ScrollView>
                        <Card style={styles.card}>
                            <Text category='label' status='primary'>What do I do?</Text>
                            <Text category='s1' style={stylesScreen.spacing}>Press start stimuli and get used to the stimuli and how it feels. </Text>
                            <Text category='s1' style={stylesScreen.spacing}>Train yourself to do a 'reality check' when you experience the stimuli.</Text>
                            <Text category='s1' style={stylesScreen.spacing}>The idea is you recognise the stimuli while dreaming to gain conciousness resulting in lucidity but not enough to make you wake up</Text>
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
