import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { IndexPath, Select, SelectItem, Layout, Card } from '@ui-kitten/components';
import { Image } from 'expo-image';
import { useAPIVariables } from '../APICalls/API';

//This component selects a game and also updates it in API.tsx. For future use can implement backend for specific vrGame API calls/stimuli
const VRImageSelector = () => {
    const { apiVariables, setAPIVariables } = useAPIVariables(); //so that we can update all global API variables in API.tsx so we can send the correct calibrated calls in other screens
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

    const handleSelect = (index: IndexPath | IndexPath[]) => {
        // If multiple selection is enabled, 'index' can be an array of IndexPath objects.
        // For single selection, 'index' will be a single IndexPath object.
        // Ensure compatibility with both cases by treating 'index' as an array and taking the first element.
        const selectedIndex = Array.isArray(index) ? index[0] : index;
        setSelectedIndex(selectedIndex);
        const selectedGameTitle = titles[selectedIndex.row];
        setDisplayValue(selectedGameTitle);
    
        // Update the vrGame variable in the global API context
        setAPIVariables({
            ...apiVariables, // Spread existing apiVariables to retain other values
            vrGame: selectedGameTitle, // Update vrGame with the selected title
        });
        console.log(apiVariables.vrGame)
    };

    return (
        <Layout style={styles.container}>
            <Card style={styles.card}>
            <Select
                    selectedIndex={selectedIndex}
                    value={displayValue}
                    onSelect={handleSelect}>
                    {titles.map((title, index) => (
                        <SelectItem key={index} title={title} />
                    ))}
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

