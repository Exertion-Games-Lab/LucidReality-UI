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

const arrow = (props: any) => (
    <Icon name='arrow-forward-outline' {...props} animation='pulse' />
  );

export default function lucidDream() {
    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                <Stack.Screen options={{ headerTitle: '' }} />
                <Layout style={styles.container}>
                    <Timer />
                
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
