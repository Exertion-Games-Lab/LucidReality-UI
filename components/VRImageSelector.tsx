import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { IndexPath, Select, SelectItem, Layout, Card } from '@ui-kitten/components';
import { Image } from 'expo-image';
import { APIVariables, defaultValues, loadAPIVariables, saveAPIVariables } from '../APICalls/storage';

const VRImageSelector = () => {
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
    const [apiVariables, setApiVariables] = useState<APIVariables>(defaultValues);
    const [displayValue, setDisplayValue] = useState('Select a VR Game');

    const images = [
        { uri: 'https://cdn.akamai.steamstatic.com/steam/apps/264710/capsule_616x353.jpg?t=1700522118' },
        { uri: 'https://xxboxnews.blob.core.windows.net/prod/sites/2/2021/08/NMS_Frontiers_Hero.jpg' },
        { uri: 'https://cdn.logojoy.com/wp-content/uploads/20231208133956/11-30-23_Minecraft-Logo-Evolution_HEADER.webp' },
    ];
    const titles = ["Subnautica", "No Man's Sky", "Minecraft"]; // Titles for the images

    useEffect(() => {
        // Load the current API variables from storage when the component mounts
        const fetchApiVariables = async () => {
            const vars = await loadAPIVariables();
            setApiVariables(vars);
            if (vars.vrGame && titles.includes(vars.vrGame)) {
                setDisplayValue(vars.vrGame);
                setSelectedIndex(new IndexPath(titles.indexOf(vars.vrGame)));
            }
        };
        fetchApiVariables();
    }, []);

    const handleSelect = async (index: IndexPath | IndexPath[]) => {
        const selectedIndex = Array.isArray(index) ? index[0] : index;
        setSelectedIndex(selectedIndex);
        const selectedGameTitle = titles[selectedIndex.row];
        setDisplayValue(selectedGameTitle);

        // Create a new APIVariables object with the updated vrGame
        const updatedVariables: APIVariables = {
            ...apiVariables,
            vrGame: selectedGameTitle,
        };

        // Save the updated API variables to AsyncStorage
        await saveAPIVariables(updatedVariables);

        // Optionally, update the local state with the new variables
        setApiVariables(updatedVariables);

        console.log(`VR Game updated to: ${selectedGameTitle}`);
    };

    return (
        <Layout style={styles.container}>
            <Card style={styles.card}>
                <Select selectedIndex={selectedIndex} value={displayValue} onSelect={handleSelect}>
                    {titles.map((title, index) => (
                        <SelectItem key={index} title={title} />
                    ))}
                </Select>

                <View style={styles.imageContainer}>
                    <Image source={images[selectedIndex.row]} style={styles.image} />
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

