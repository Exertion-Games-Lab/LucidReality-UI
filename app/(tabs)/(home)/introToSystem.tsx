import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, ScrollView, Image } from 'react-native';

import styles from "../../../constants/Style";

import { ApplicationProvider, Button, Text, Layout, Icon, IconElement, IconRegistry, Card, Divider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { View } from '../../../components/Themed';
import { PropsWithChildren } from 'react';

const arrow = (props: any) => (
    <Icon name='arrow-forward-outline' {...props} animation='pulse' />
);

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

//Pics needed for this screen
import imgSleepTracker from '../../../assets/images/DSC00181.png'
import imgLabUser from '../../../assets/images/DSC00187.png'
import imgLabSetup from '../../../assets/images/DSC00211.png'

export default function introToSystem() {
    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                <Stack.Screen options={{ title: '' }} />

                <Layout style={styles.container}>
                    <ScrollView>
                        <Layout style={stylesScreen.titleContainer}>
                            <Text category='h4'>Our system and approach</Text>
                            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                        </Layout>
                        <Card style={styles.card}>
                            <Text style={stylesScreen.titleCard} category='h6'>WBTB (Wake back to bed)</Text>
                            <Text category='p1'> </Text>
                        </Card>
 
                        {
                            // Image of lab setup
                        }
                        <Layout style={styles.container}>
                            <Image style={stylesScreen.image} source={imgLabSetup} />
                        </Layout>

                        <Card style={styles.card}>
                            <Text style={stylesScreen.titleCard} category='h6'>When do Lucid Dreams Happen?</Text>
                            <Text category='p1'>Lucid dreams are most common during rapid eye movement (REM) sleep, a period of very deep sleep marked by eye motion, faster breathing, and more brain activity.
                                You usually enter REM sleep about 90 minutes after falling asleep. It lasts about 10 minutes. As you sleep, each REM period is longer than the one before, finally lasting up to an hour.</Text>
                        </Card>

                        {
                            // Image of sleep tracker setup
                        }
                        <Layout style={styles.container}>
                            <Image style={stylesScreen.image} source={imgSleepTracker} />
                        </Layout>

                        <Card style={styles.card}>
                            <Text style={stylesScreen.titleCard} category='h6'>Benifits of lucid dreaming</Text>
                            <Text category='p1'> Benefits here</Text>
                        </Card>

                        {
                            // Image of lab setup with user Sleeping
                        }
                        <Layout style={styles.container}>
                            <Image style={stylesScreen.image} source={imgLabUser} />
                        </Layout>

                        <Card style={styles.card}>
                            <Text style={stylesScreen.titleCard} category='h6'>Dangers of lucid dreaming</Text>
                            <Text category='p1'> Dangers here</Text>
                        </Card>

                    </ScrollView>
                    <Link href="/playVR" asChild>
                        <Button status='success' style={styles.buttonFixed} accessoryRight={arrow}>
                            <Text>Play VR</Text>
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
    }
});
