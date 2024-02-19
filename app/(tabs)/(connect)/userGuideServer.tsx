import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import Markdown from "react-native-marked";
import { MDPreview } from '@ilz5753/rnmd';
import { ApplicationProvider } from '@ui-kitten/components';

import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";

export default function UserGuideServer() {
    return (

        <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
            <WebView
                source={{ uri: 'https://github.com/Exertion-Games-Lab/README/blob/d4178cec95327e57734bbdfd3538862f6af0c77b/serverGuide.md#Setting-Up-Your-New-Raspberry-Pi' }}
                style={styles.webView}
            />
        </ApplicationProvider>
    );
}

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
    },
    webView: {
        flex: 1,
    },
});
