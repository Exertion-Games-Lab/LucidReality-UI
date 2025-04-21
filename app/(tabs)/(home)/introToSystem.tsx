import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, ScrollView } from 'react-native';

import styles from "../../../constants/Style";

import { ApplicationProvider, Button, Text, Layout, Icon, IconElement, IconRegistry, Card, Divider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { View } from '../../../components/Themed';
import { PropsWithChildren } from 'react';
import { Image } from 'expo-image';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

import * as React from 'react';

const arrow = (props: any) => (
    <Icon name='arrow-forward-outline' {...props} animation='pulse' />
);

const play = (props: any) => (
    <Icon style={stylesScreen.icon} fill='white' name='volume-up' {...props} animation='pulse' />
);

const pause = (props: any) => (
    <Icon style={stylesScreen.icon} fill='white' name='pause-circle' {...props} animation='pulse' />
);

const audioTrack = require('../../../assets/audio/introToSystem/intro.mp3');

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

//Pics needed for this screen
import imgSleepTracker from '../../../assets/images/adaptive-icon.png'
import imgLabUser from '../../../assets/images/adaptive-icon.png'
import imgLabSetup from '../../../assets/images/adaptive-icon.png'

export default function introToSystem() {
    const [Loaded, SetLoaded] = React.useState(false);
    const [Loading, SetLoading] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false); // Track playback status
    const sound = React.useRef(new Audio.Sound());

    //allows audio to play in silent
    useEffect(() => {
        Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
        });
    }, []);

    React.useEffect(() => {
        LoadAudio();
    }, []);

    const handleTogglePlayback = async () => {
        try {
            const result = await sound.current.getStatusAsync();
            if (result.isLoaded) {
                if (isPlaying) {
                    sound.current.pauseAsync();
                } else {
                    sound.current.playAsync();
                }
                setIsPlaying(!isPlaying); // Toggle playback status
            }
        } catch (error) { }
    };

    const LoadAudio = async () => {
        SetLoading(true);
        const checkLoading = await sound.current.getStatusAsync();
        if (checkLoading.isLoaded === false) {
            try {
                const result = await sound.current.loadAsync(audioTrack, {}, true);
                if (result.isLoaded === false) {
                    SetLoading(false);
                    console.log('Error in Loading Audio');
                } else {
                    SetLoading(false);
                    SetLoaded(true);
                }
            } catch (error) {
                console.log(error);
                SetLoading(false);
            }
        } else {
            SetLoading(false);
        }
    };
    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                <Stack.Screen options={{ title: '' }} />

                <Layout style={styles.container}>
                    <ScrollView>
                        <Layout style={stylesScreen.titleContainer}>
                            <Text category='h5'>The prototype and our approach</Text>
                            <Button
                                style={stylesScreen.button}
                                appearance='outline'
                                accessoryLeft={isPlaying ? pause : play}
                                onPress={handleTogglePlayback}
                            />
                        </Layout>
                        <Card style={styles.card}>
                            <Text style={stylesScreen.titleCard} category='h6'>Our approach</Text>
                            <Text category='p1'>Our approach utilizes pre-sleep preparation and external stimuli during sleep to induce lucid dreams based on previous research. </Text>
                            <Text category='p1' style={stylesScreen.boldText}>Step 1 - SLEEP SESSION: </Text>
                            <Text category='p1'>Sleep as you normally would at night, recommended for a minimum of 4 hours. </Text>
                            <Text category='p1' style={stylesScreen.boldText}>Step 2 - COGNITIVE TRAINING SESSION: </Text>
                            <Text category='p1'>During this session, the stimuli will be activated to help associate your self-awareness with the stimuli. Please practice recognizing the stimuli and asking yourself whether you are in the dream whenever recognizing the stimuli.  </Text>
                            <Text category='p1' style={stylesScreen.boldText}>Step 3 - LUCID DREAM SESSION: </Text>
                            <Text category='p1'>After the cognitive training, please go back to sleep again. Once you enter in your dream, the stimuli would be actived. Please recognize the stimuli and ask yourself whether you are dreaming to induce lucid dreaming. After you notice that you are dreaming, please move your eyeballs left to right 8 times to notify the system. </Text>
                            <Text category='p1' style={stylesScreen.boldText}>Step 4 - DREAM REPORT SESSION: </Text>
                            <Text category='p1'>Whenever you wake up from the lucid dream session (no matter whether you have a lucid dream or not), please switch to the “Journal” page on the app and report your experience. After the dream report, please go back to step 3 until you cannot fall asleep anymore or 4 hours have lapsed for the lucid dream session. </Text>
                        </Card>
                        <Layout style={styles.container}>
                            <Text status='primary' category='s1'>Our system consists of 3 major components:</Text>
                        </Layout>

                        <Card style={styles.card}>
                            <Text style={stylesScreen.boldText} category='h6'>Cue modules</Text>
                            <Text category='p1'>Cue modules include any devices that will directly aid in helping lucidity. For example, in the most basic setup, LEDs and Speakers are both devices that help a user reach lucidity. </Text>
                            {/* <Text category='p1'>{'\n'}For now this app only supports LED, Audio.</Text> */}
                        </Card>

                        {
                            // Image of lab setup
                        }
                        <Layout style={styles.container}>
                            <Image style={stylesScreen.image} placeholder={blurhash} source={imgLabSetup} />
                        </Layout>

                        <Card style={styles.card}>
                            <Text style={stylesScreen.boldText} category='h6'>Sleep tracker</Text>
                            <Text category='p1'>The sleep tracker captures your brain and eye activity during sleep and detects your sleep stage automatically.</Text>
                            {/* <Text category='p1'>{'\n'}Using this data our algorithm detects REM stages and activates stimulus accordingly</Text> */}
                        </Card>

                        {
                            // Image of sleep tracker setup
                        }
                        <Layout style={styles.container}>
                            <Image style={stylesScreen.image} placeholder={blurhash} source={imgSleepTracker} />
                        </Layout>

                        <Card style={styles.card}>
                            <Text style={stylesScreen.boldText} category='h6'>Server</Text>
                            <Text category='p1'> Information is automatically sent from the sleep tracker to the server, where data is further processed, and stimulus outputs are activated.</Text>
                            <Text category='p1'>{'\n'}It is important to ensure you are connected before starting the study.</Text>
                        </Card>

                        {
                            // Image of lab setup with user Sleeping
                        }
                        <Layout style={styles.container}>
                            <Image style={stylesScreen.image} source={imgLabUser} />
                        </Layout>
                        

                        <Card style={styles.card}>
                            <Text style={stylesScreen.boldText} category='h6'>How to set up the sleep tracker?</Text>
                            <Text category='p1'> 1. Plug in the battery.</Text>
                            <Text category='p1'>{'\n'}2. Turn the board into PC mode.</Text>
                            <Text category='p1'>{'\n'}3. Put on the cap.</Text>
                            <Text category='p1'>{'\n'}4. Adjust the tightness.</Text>
                            <Text category='p1'>{'\n'}5. Put on the ear clip.</Text>
                        </Card>

                        <Card style={styles.card}>
                            <Text style={stylesScreen.boldText} category='h6'>How to set up the server?</Text>
                            <Text category='p1'> 1.	Plug in the power.</Text>
                            <Text category='p1'>{'\n'}2. Connect the server with a monitor.</Text>
                            <Text category='p1'>{'\n'}3. Connect to the WIFI.</Text>
                            <Text category='p1'>{'\n'}4. Open the terminal.</Text>
                            <Text category='p1'>{'\n'}5. Enter “cd LuciEntry-Home”</Text>
                            <Text category='p1'>{'\n'}6. Enter “python configure_wifi.py” and enter your WIFI password here.</Text>
                            <Text category='p1'>{'\n'}7. Enter “./start.sh”</Text>
                        </Card>

                        <Card style={styles.card}>
                            <Text style={stylesScreen.boldText} category='h6'>How to set up the stimulus devices?</Text>
                            <Text category='p1'> 1.	On the server, open LuciEntry-Home/Devices/[Device-name] folder.</Text>
                            <Text category='p1'>{'\n'}2. Open the [Device-name].ino with Arduino.</Text>
                            <Text category='p1'>{'\n'}3. Open the box and unplug the USB cable from the battery.</Text>
                            <Text category='p1'>{'\n'}4. Plug the USB cable into the server.</Text>
                            <Text category='p1'>{'\n'}5. Select the port and “generic ESP 8266 Module” as the board.</Text>
                            <Text category='p1'>{'\n'}6. Press “upload”.</Text>
                            <Text category='p1'>{'\n'}7. Plug the USB cable back into the battery.</Text>
                            <Text category='p1'>{'\n'}8. Power on the battery.</Text>
                            {/* <Text category='p1'>{'\n'}For more instruction, please refer to our manual: README.</Text> */}
                        </Card>

                    </ScrollView>
                    <Link href="/uninterruptedSleep" asChild>
                        <Button onPress={() => {
                            if (isPlaying) {
                                handleTogglePlayback();
                            } else {
                                console.log("isPlaying is false");
                            }
                        }} status='success' style={styles.buttonFixed} accessoryRight={arrow}>
                            <Text>Next</Text>
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
        padding: 7,
        marginTop: 20,
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
});
