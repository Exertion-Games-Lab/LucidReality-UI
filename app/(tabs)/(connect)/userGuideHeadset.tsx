import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, ScrollView, Platform } from 'react-native';
import ReactPlayer from 'react-player'
import styles from "../../../constants/Style";
import { ApplicationProvider, Button, Text, Layout, Icon, IconElement, IconRegistry, Card } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import Timer from '../../../components/Timer';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import VideoCard from '../../../components/videoCard';

const arrow = (props: any) => (
    <Icon name='arrow-forward-outline' {...props} animation='pulse' />
);

export default function userGuideHeadset() {
    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                <Stack.Screen options={{ headerTitle: 'Headset Guide' }} />
                <ScrollView>
                <Layout>
                    <Card style={styles.card}>
                        <Text category='h2'>Headset Guide</Text>
                        <Text category='s1' status='danger'>Please note:</Text>
                        <Text category='s1' style={stylesScreen.spacing} status='danger'>This screen will reappear as you progress through a sleep session, do not start the detection script now!</Text>
                        <Text category='s1' style={stylesScreen.spacing}>Only start the detector.py Script when this screen is promted in your Sleep Session. This will be right before your lucid dream</Text>
                    </Card>
                </Layout>
                <Layout style={styles.container}>
                    <VideoCard
                        title="Step 1: Wear the headset"
                        excerpt="Please closely follow the electrode placements shown in the video."
                    >
                        <YoutubePlayer height={300} width={400} play={false} videoId={'DRGktMG2MhI'} />
                    </VideoCard>
                </Layout>
                <Layout>
                <Card style={styles.card}>
                    <Text category='label'>Step 2</Text>
                    <Text category='s1' style={stylesScreen.spacing}>Navigate to LucidReality-Devices/detector folder in your terminal</Text>

                    <Text category='label'>Step 3</Text>
                    <Text category='s1' style={stylesScreen.spacing}>In the terminal type 'python Detector.py' and press enter</Text>

                    <Text category='label'>Step 4</Text>
                    <Text category='s1' style={stylesScreen.spacing}>The script is running successfully if you see the terminal print a ip address and output the REM state to console every second</Text>
                </Card>
                </Layout>
                </ScrollView>
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
