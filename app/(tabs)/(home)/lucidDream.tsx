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

const arrow = (props: any) => (
    <Icon name='arrow-forward-outline' {...props} animation='pulse' />
);

export default function lucidDream() {
    const [remState, setRemState] = useState('Checking connection...');
    const [connectionStatus, setConnectionStatus] = useState('Checking connection...');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch('http://127.0.0.1:5000/get_rem')
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
                        <Button status='Danger' style={styles.button} accessoryRight={arrow}>
                            <Text>End Session</Text>
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
