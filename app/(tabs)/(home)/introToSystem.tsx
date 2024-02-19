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
import imgSleepTracker from '../../../assets/images/DSC00181.png'
import imgLabUser from '../../../assets/images/DSC00187.png'
import imgLabSetup from '../../../assets/images/DSC00211.png'

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
                            <Text category='h5'>The system and our approach</Text>
                            <Button
                                style={stylesScreen.button}
                                appearance='outline'
                                accessoryLeft={isPlaying ? pause : play}
                                onPress={handleTogglePlayback}
                            />
                        </Layout>
                        <Card style={styles.card}>
                            <Text style={stylesScreen.titleCard} category='h6'>Our Approach</Text>
                            <Text category='p1'>Our approach is based on the lucid dream technique 'Wake Back to Bed (WBTB)'. </Text>
                            <Text category='p1' style={stylesScreen.boldText}>Step 1 - SLEEP SESSION: </Text>
                            <Text category='p1'>Sleep as you normally would at night, recommended for minimum 4 hours. </Text>
                            <Text category='p1' style={stylesScreen.boldText}>Step 2 - PLAY VR & STAY AWAKE: </Text>
                            <Text category='p1'>Spend up to half hour playing VR. This will aid in dreaming about your chosen VR topic.  </Text>
                            <Text category='p1' style={stylesScreen.boldText}>Step 3 - LUCID DREAM: </Text>
                            <Text category='p1'>Go back to bed and enjoy your lucid dream </Text>
                        </Card>
                        <Layout style={styles.container}>
                            <Text status='primary' category='s1'>Our system consists of 3 major components:</Text>
                        </Layout>

                        <Card style={styles.card}>
                            <Text style={stylesScreen.boldText} category='h6'>Stimulus devices</Text>
                            <Text category='p1'>Stimulus devices include any devices that will directly aid in helping lucidity. For example, in the most basic setup, LEDs and Speakers are both devices that help a user reach lucidity. Other devices such as TACs, EMS, bubbler can all provide extra help to achive lucidity and modify content.</Text>
                            <Text category='p1'>{'\n'}For now this app only supports LED, Audio and TACs but additional support is coming</Text>
                        </Card>

                        {
                            // Image of lab setup
                        }
                        <Layout style={styles.container}>
                            <Image style={stylesScreen.image} placeholder={blurhash} source={imgLabSetup} />
                        </Layout>

                        <Card style={styles.card}>
                            <Text style={stylesScreen.boldText} category='h6'>Sleep Tracker</Text>
                            <Text category='p1'>The sleep tracker is responsible for collecting EEG data (for sleep processing) and EOG (to detect eye movement) when you are sleeping.</Text>
                            <Text category='p1'>{'\n'}Using this data our algorithm detects REM stages and activates stimulus accordingly</Text>
                        </Card>

                        {
                            // Image of sleep tracker setup
                        }
                        <Layout style={styles.container}>
                            <Image style={stylesScreen.image} placeholder={blurhash} source={imgSleepTracker} />
                        </Layout>

                        <Card style={styles.card}>
                            <Text style={stylesScreen.boldText} category='h6'>Server</Text>
                            <Text category='p1'>Our server is the brains of our system. Informations is automatically sent from the sleep tracker to the server, where data is further processed and stimulus outputs are activated</Text>
                            <Text category='p1'>{'\n'}It is important to ensure you are connected before starting a Lucid Dream session</Text>
                        </Card>

                        {
                            // Image of lab setup with user Sleeping
                        }
                        <Layout style={styles.container}>
                            <Image style={stylesScreen.image} source={imgLabUser} />
                        </Layout>

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
