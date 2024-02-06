import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, ScrollView, Platform } from 'react-native';

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

const arrow = (props: any) => (
    <Icon name='arrow-forward-outline' {...props} animation='pulse' />
);

export default function uninterruptedSleep() {
    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                <Stack.Screen options={{ headerTitle: 'Headset Guide' }} />
                <Layout style={stylesScreen.titleContainer}>
                    <Text status='success' style={stylesScreen.boldText} category='p2'>Now please put on the headband</Text>
                </Layout>
                <Layout style={styles.container}>
                    <VideoCard
                        title="Headset Guide"
                        excerpt="Please closely follow the electrode placements shown in the video"
                    >
                        <YoutubePlayer height={300} width={400} play={false} videoId={'xNE-NyaYBcg'} />
                    </VideoCard>
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
});
