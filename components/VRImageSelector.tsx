import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { IndexPath, Select, SelectItem, Layout, Card } from '@ui-kitten/components';
import { Image } from 'expo-image';

const VRImageSelector = () => {
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
    const images = [
        { uri: 'https://cdn.akamai.steamstatic.com/steam/apps/264710/capsule_616x353.jpg?t=1700522118' },
        { uri: 'https://xxboxnews.blob.core.windows.net/prod/sites/2/2021/08/NMS_Frontiers_Hero.jpg' },
        { uri: 'https://cdn.logojoy.com/wp-content/uploads/20231208133956/11-30-23_Minecraft-Logo-Evolution_HEADER.webp' },
    ];
    const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
    const [displayValue, setDisplayValue] = useState('Select an VR Game');
    const titles = ["Subnautica", "No Man's Sky", "Minecraft"]; // Titles for the images

    return (
        <Layout style={styles.container}>
            <Card style={styles.card}>
            <Select
                selectedIndex={selectedIndex}
                value={displayValue}
                onSelect={(index) => {
                    const selectedIndex = Array.isArray(index) ? index[0] : index;
                    setSelectedIndex(selectedIndex);
                    setDisplayValue(titles[selectedIndex.row]);
                }}>
                <SelectItem title={titles[0]} />
                <SelectItem title={titles[1]} />
                <SelectItem title={titles[2]} />
            </Select>

            <View style={styles.imageContainer}>
                <Image source={images[selectedIndex.row]} placeholder={blurhash} style={styles.image} />
            </View>
            </Card>
        </Layout>
    );
};

// Dynamically calculate card width based on screen width
const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth * 0.9; // 90% of the screen width
const imageWidth = screenWidth * 0.8; // 90% of the screen width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        marginTop: 15,
        height: 200,
        width: imageWidth,
        justifyContent: 'center',
        alignItems: 'center', 
    
    },
    image: {
        width: '100%',
        height: '100%',
    },
    card: {
        width: cardWidth, // Use the dynamically calculated width
        alignSelf: 'center', // Center the card
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default VRImageSelector;

