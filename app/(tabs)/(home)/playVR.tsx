import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, ScrollView, Platform } from 'react-native';
import styles from "../../../constants/Style";
import { ApplicationProvider, Button, Text, Layout, Icon, IconElement, IconRegistry, Card } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import Timer from '../../../components/Timer';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import VRImageSelector from '../../../components/VRImageSelector';

const arrow = (props: any) => (
    <Icon name='arrow-forward-outline' {...props} animation='pulse' />
);


export default function playVR() {
    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                <Stack.Screen options={{ title: 'Play VR' }} />


                <Layout style={stylesScreen.titleContainer}>
                    <Text status='success' style={stylesScreen.boldText} category='p2'>Recommended to spend at least 30 minutes playing VR</Text>
                    <VRImageSelector />
                </Layout>
                <Layout style={styles.container}>
                    <Timer defaultHours={0} defaultMinutes={30} />
                    <Link href="/videoGuideHeadset" asChild>
                        <Button status='success' style={stylesScreen.buttonFixed} accessoryRight={arrow}>
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
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1
    },
    titleCard: {
        marginBottom: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        width: 325,
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
    buttonFixed: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },

});
