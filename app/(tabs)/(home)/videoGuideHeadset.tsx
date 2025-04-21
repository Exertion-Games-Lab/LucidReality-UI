import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, ScrollView, Platform, Image } from 'react-native';

import { useRef } from 'react';

import { View } from '../../../components/Themed';

import styles from "../../../constants/Style";

import { ApplicationProvider, Button, Text, Layout, Icon, IconElement, IconRegistry, Card } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import Timer from '../../../components/Timer';

import { EvaIconsPack } from '@ui-kitten/eva-icons';
import YoutubePlayer from 'react-native-youtube-iframe';

import VideoCard from '../../../components/videoCard';
import { Dimensions } from 'react-native';


//image
import imgElectrode1 from '../../../assets/images/electrode1.png'
import imgElectrode2 from '../../../assets/images/electrode2.png'
import imgSleepTrackingCap1 from '../../../assets/images/cap1.png'
import imgSleepTrackingCap2 from '../../../assets/images/cap2.png'

const screenWidth = Dimensions.get('window').width;
const dynamicWidth = screenWidth * 0.9;

const arrow = (props: any) => (
    <Icon name='arrow-forward-outline' {...props} animation='pulse' />
);

export default function videoGuideHeadset() {
    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                <Stack.Screen options={{ headerTitle: 'Headset Guide' }} />

                <Layout style={stylesScreen.titleContainer}>

                    <Text status='success' style={stylesScreen.boldText} category='p2'>Now please put on the headband</Text>
                </Layout>
                {/* <Layout style={styles.container}>
                {/* <VideoCard
                    title="Wear the headset"
                    // excerpt="Please closely follow the electrode placements shown in the video."
                >
                    <YoutubePlayer height={300}  play={false} videoId={'DRGktMG2MhI'} />
                </VideoCard> }
                 
                </Layout> */}
                <Layout style={styles.container}>
                    <ScrollView>
                        <Card style={styles.card}>
                            <Text category='label'>Step 1</Text>
                            <Text category='s1' style={stylesScreen.spacing}>Please wipe your forehead and the eye area (places where the electrodes will be attached) with a sanitary wipe. Attach the sticky electrodes on (1) both side of your eyes, (2) the center of forehead, and (3) behind the right ear.</Text>
                            <Layout style={styles.container}>
                                <Image style={stylesScreen.image} source={imgElectrode1} />
                            </Layout>
                            <Layout style={styles.container}>
                                <Image style={stylesScreen.image} source={imgElectrode2} />
                            </Layout>
                            <Text category='label'>Step 2</Text>
                            <Text category='s1' style={stylesScreen.spacing}>1. Put the sleep tracker on to the head. Blue eletrodes should face the front. 2. Clip the blue eletrodes to the sticky electrodes on the head: (1) orange cable connects to the electrode on the center of forehand, (2) red cable connects to the electrode on the right temple, (3) yellow cable connects to the electrode on the left temple, and (4) black cable connects to the electode behind right ear. </Text>
                            <Layout style={styles.container}>
                                <Image style={stylesScreen.image} source={imgSleepTrackingCap1} />
                            </Layout>
                            <Layout style={styles.container}>
                                <Image style={stylesScreen.image} source={imgSleepTrackingCap2} />
                            </Layout>
                            <Text category='label'>Step 3</Text>
                            <Text category='s1' style={stylesScreen.spacing}>Adjust the size with the velcro band on the jaw.</Text>
                        </Card>

                    </ScrollView>
                </Layout>

                <Link href="/cognitiveTraining" asChild>
                    <Button status='success' style={styles.buttonFixed} accessoryRight={arrow}>
                        <Text>Next</Text>
                    </Button>
                </Link>
            </ApplicationProvider >
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
