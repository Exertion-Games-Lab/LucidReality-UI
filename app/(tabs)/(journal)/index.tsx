import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert, Platform } from 'react-native';
import { Layout, Text, Button, Card, Modal, Input, ApplicationProvider, SelectItem, Select, IndexPath } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Declare the interface for dream entries
interface DreamJournalEntry {
    id: string;
    title: string;
    date: string;
    sleepHours: string;
    description: string;
    category: 'Normal' | 'Lucid' | 'Nightmare' | 'Recurring';
    characters: string[];
    locations: string[];
    recordingUri?: string | null;
}

const index: React.FC = () => {
    // State variables
    const [dreamEntries, setDreamEntries] = useState<DreamJournalEntry[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editEntryId, setEditEntryId] = useState<string | null>(null);
    const [newEntry, setNewEntry] = useState<DreamJournalEntry>({
        id: '',
        title: '',
        date: '',
        sleepHours: '',
        description: '',
        category: 'Normal',
        characters: [],
        locations: [],
    });
    const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(0));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    // State for rem_periods
    const [remPeriods, setRemPeriods] = useState<string | null>(null);

    // Load dream entries and rem periods on component mount
    useEffect(() => {
        loadDreamEntries();
        loadRemPeriods(); // Load rem periods from AsyncStorage
        loadTimerLogs();  // Load timer logs from AsyncStorage
    }, []);

    // Function to load timer logs
    const loadTimerLogs = async () => {
        try {
            const storedLogs = await AsyncStorage.getItem('TIMER_LOGS');
            if (storedLogs) {
                const logs = JSON.parse(storedLogs);
                console.log('Timer Logs:', logs);  // You can display or save these logs as needed
            }
        } catch (e) {
            console.log('Error loading timer logs', e);
        }
    };

    // Function to load rem_periods from AsyncStorage
    const loadRemPeriods = async () => {
        try {
            const storedRemPeriods = await AsyncStorage.getItem('@rem_periods');
            setRemPeriods(storedRemPeriods);
        } catch (e) {
            console.log('Error loading REM periods', e);
        }
    };

    // Start recording audio
    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
            setIsRecording(false)
        }
    };

    // Stop recording audio
    const stopRecording = async () => {
        if (!recording) {
            return;
        }
        setRecording(null);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setNewEntry({ ...newEntry, recordingUri: uri });
        setIsRecording(false)
    };

    // Play recorded audio
    const playRecording = async (uri: string) => {
        const { sound } = await Audio.Sound.createAsync(
            { uri: uri },
            { shouldPlay: true }
        );
        await sound.playAsync();
    };

    // Start playback of recorded audio
    const startPlayback = async (uri: string, entryId: string) => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }

        if (uri && currentlyPlaying !== entryId) {
            const { sound: playbackSound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true },
            );
            setSound(playbackSound);
            setCurrentlyPlaying(entryId);

            playbackSound.setOnPlaybackStatusUpdate((status) => {
                if (!status.isLoaded) {
                    return;
                } else {
                    if (status.didJustFinish) {
                        setCurrentlyPlaying(null);
                    }
                }
            });
            await playbackSound.playAsync();
        }
    };

    // Stop playback of recorded audio
    const stopPlayback = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
            setCurrentlyPlaying(null);
        }
    };

    // Handle date change for the entry
    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(Platform.OS === 'ios');
        setNewEntry({ ...newEntry, date: currentDate.toISOString() });
    };

    // Handle time change for the entry
    const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
        const currentTime = selectedTime || new Date();
        setShowTimePicker(Platform.OS === 'ios');
        setNewEntry({ ...newEntry, sleepHours: currentTime.toISOString() });
    };

    // Format date for display
    const formatDate = (isoString: string | number | Date) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    // Format time for display
    const formatTime = (isoString: string | number | Date) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Load dream entries from AsyncStorage
    const loadDreamEntries = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const result = await AsyncStorage.multiGet(keys);
            let entries = result.map(([key, value]) => value ? JSON.parse(value) : null).filter(Boolean) as DreamJournalEntry[];

            entries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setDreamEntries(entries);
        } catch (e) {
            console.log(e);
        }
    };

    // Save or update a dream entry
    const saveDreamEntry = async (entry: DreamJournalEntry) => {
        try {
            const jsonValue = JSON.stringify(entry);
            await AsyncStorage.setItem(`@dream_journal_${entry.id}`, jsonValue);
            if (isEditMode) {
                setDreamEntries(dreamEntries.map((item) => (item.id === entry.id ? entry : item)));
            } else {
                setDreamEntries([...dreamEntries, entry]);
            }
            loadDreamEntries();
        } catch (e) {
            console.log(e);
        }
    };

    // Delete a dream entry
    const deleteDreamEntry = async (id: string) => {
        try {
            await AsyncStorage.removeItem(`@dream_journal_${id}`);
            setDreamEntries(dreamEntries.filter((entry) => entry.id !== id));
        } catch (e) {
            console.log(e);
        }
    };

    // Handle adding or editing a dream entry
    const handleAddEditEntry = () => {
        const entryToSave = { ...newEntry, category: ['Normal', 'Lucid', 'Nightmare', 'Recurring'][selectedIndex.row] as DreamJournalEntry['category'] };
        if (isEditMode && editEntryId) {
            saveDreamEntry({ ...entryToSave, id: editEntryId });
        } else {
            const entryToAdd = { ...entryToSave, id: Date.now().toString() };
            saveDreamEntry(entryToAdd);
        }
        setModalVisible(false);
        resetForm();
    };

    // Handle deleting an entry
    const handleDeleteEntry = (id: string) => {
        Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
            { text: "Cancel" },
            { text: "Yes", onPress: () => deleteDreamEntry(id) },
        ]);
    };

    // Handle editing an entry
    const handleEditEntry = (entry: DreamJournalEntry) => {
        setNewEntry(entry);
        setIsEditMode(true);
        setEditEntryId(entry.id);
        setModalVisible(true);
        const categoryIndex = ['Normal', 'Lucid', 'Nightmare', 'Recurring'].indexOf(entry.category);
        setSelectedIndex(new IndexPath(categoryIndex));
    };

    // Reset the form to its initial state
    const resetForm = () => {
        setNewEntry({
            id: '',
            title: '',
            date: '',
            sleepHours: '',
            description: '',
            category: 'Normal',
            characters: [],
            locations: [],
        });
        setIsEditMode(false);
        setEditEntryId(null);
        setSelectedIndex(new IndexPath(0));
    };

    // Export dream report as JSON
    const exportDreamReport = async () => {
        try {
            const exportData = {
                dreamEntries,
                remPeriods, // Include the retrieved rem periods in the export
                calibrationSettings: await AsyncStorage.getItem('@calibration_setting'),
            };

            const jsonString = JSON.stringify(exportData, null, 2);
            const fileUri = FileSystem.documentDirectory + 'dream_report.json';

            await FileSystem.writeAsStringAsync(fileUri, jsonString);

            await Sharing.shareAsync(fileUri);
        } catch (error) {
            console.error('Error exporting dream report', error);
            Alert.alert("Export Error", "There was an error exporting the dream report. Please try again.");
        }
    };

    // Render individual dream entry cards
    const renderItem = ({ item }: { item: DreamJournalEntry }) => (
        <Card style={styles.card}>
            <Text category="h5" style={styles.renderSpacing}>{item.title}</Text>

            <Text category="label" style={styles.label}>Date:</Text>
            <Text category="s1" style={styles.renderSpacing}>{formatDate(item.date)}</Text>

            <Text category="label" style={styles.label}>Wake Up Time:</Text>
            <Text category="s1" style={styles.renderSpacing}>{formatTime(item.sleepHours)}</Text>

            <Text category="label" style={styles.label}>Description:</Text>
            <Text category="s1" style={styles.renderSpacing}>{item.description}</Text>

            <Text category="label" style={styles.label}>Category:</Text>
            <Text category="s1">{item.category}</Text>

            {item.recordingUri ? (
                currentlyPlaying === item.id ? (
                    <Button
                        appearance='ghost'
                        size='giant'
                        onPress={stopPlayback}
                    >
                        {evaProps => <><StopIcon /><Text style={{ marginLeft: 8 }} category='label'>Stop Recording</Text></>}
                    </Button>
                ) : (
                    <Button
                        appearance='ghost'
                        size='giant'
                        onPress={() => item.recordingUri && startPlayback(item.recordingUri, item.id)}
                    >
                        {evaProps => <><PlayIcon /><Text style={{ marginLeft: 8 }} category='label' >Play Recording</Text></>}
                    </Button>
                )
            ) : null}
            <View style={styles.buttonContainer}>
                <Button accessoryLeft={edit} size="tiny" onPress={() => handleEditEntry(item)}>   
                    Edit  
                </Button>
                <Button accessoryLeft={bin} size="tiny" status="danger" onPress={() => handleDeleteEntry(item.id)}>
                    Delete
                </Button>
            </View>
        </Card>
    );

    // Icons for buttons
    const plus = (props: any) => (
        <Feather name="plus" size={18} color="white" />
    );

    const edit = (props: any) => (
        <Feather name="edit" size={13} color="white" />
    );

    const bin = (props: any) => (
        <MaterialIcons name="delete" size={13} color="white" />
    );

    const PlayIcon = (props: any) => (
        <Ionicons name="play-circle-outline" size={30} color="green" {...props} />
    );

    const StopIcon = (props: any) => (
        <Ionicons name="stop-circle-outline" size={30} color="red" {...props} />
    );

    // Button to start recording
    const RecordButton = () => (
        <Button
            appearance='ghost'
            status='danger'
            accessoryLeft={() => <Ionicons name="mic-circle" size={32} color="red" />}
            onPress={startRecording}
        >
            {() => <Text style={styles.buttonText} category='label'>Start Recording</Text>}
        </Button>
    );

    // Button to stop recording
    const StopButton = () => (
        <Button
            appearance='ghost'
            status='danger'
            accessoryLeft={() => <Ionicons name="stop-circle" size={32} color="red" />}
            onPress={stopRecording}
        >
            {() => <Text style={styles.buttonText} category='label'>Stop Recording</Text>}
        </Button>
    );

    return (
        <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Layout style={styles.container}>
                    <Button accessoryLeft={plus} onPress={() => { setModalVisible(true); resetForm(); }}>Add Dream Entry</Button>
                    <FlatList
                        data={dreamEntries}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id} // Ensure unique key
                    />              
                    <Button onPress={exportDreamReport} style={styles.exportButton}>Export Dream Report</Button>
                    <Modal
                        visible={modalVisible}
                        backdropStyle={styles.backdrop}
                        onBackdropPress={() => { setModalVisible(false); resetForm(); }}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <Card disabled={true} style={dynamicStyles.modalCard}>
                                <ScrollView>
                                    <Input
                                        label="Title*"
                                        style={styles.spacing}
                                        value={newEntry.title}
                                        onChangeText={(text) => setNewEntry({ ...newEntry, title: text })}
                                    />

                                    <Input
                                        label="Description"
                                        value={newEntry.description}
                                        onChangeText={(text) => setNewEntry({ ...newEntry, description: text })}
                                        textStyle={{ minHeight: 130 }}
                                        multiline={true}
                                        style={styles.spacing}
                                    />
                                    <Text category='label' style={styles.label}>Date*</Text>
                                    <Layout>
                                        {newEntry.date && (
                                            <Text category='label'>
                                                Selected Date: {formatDate(newEntry.date)}
                                            </Text>
                                        )}
                                        <Button onPress={() => setShowDatePicker(true)} style={styles.spacing}>
                                            Select Date
                                        </Button>
                                    </Layout>
                                    {
                                        showDatePicker && (
                                            <DateTimePicker
                                                testID="dateTimePicker-date"
                                                value={new Date(newEntry.date || new Date().toISOString())}
                                                mode="date"
                                                display="default"
                                                onChange={onChangeDate}
                                            />
                                        )
                                    }
                                    <Text category='label' style={styles.label}>Wake Up Time*</Text>
                                    <Layout>
                                        {newEntry.sleepHours && (
                                            <Text category='label'>
                                                Selected Time: {formatTime(newEntry.sleepHours)}
                                            </Text>
                                        )}
                                        <Button onPress={() => setShowTimePicker(true)} style={styles.spacing}>
                                            Select Wake Up Time
                                        </Button>
                                    </Layout>
                                    {
                                        showTimePicker && (
                                            <DateTimePicker
                                                testID="dateTimePicker-time"
                                                value={new Date(newEntry.sleepHours || new Date().toISOString())}
                                                mode="time"
                                                is24Hour={true}
                                                display="default"
                                                onChange={onChangeTime}
                                            />
                                        )
                                    }
                                    <Select
                                        selectedIndex={selectedIndex}
                                        onSelect={(index) => setSelectedIndex(index as IndexPath)}
                                        value={newEntry.category}
                                        style={styles.spacing}
                                        label="Category"
                                    >
                                        <SelectItem title='Normal' />
                                        <SelectItem title='Lucid' />
                                        <SelectItem title='Nightmare' />
                                        <SelectItem title='Recurring' />
                                    </Select>
                                    {isRecording ? <StopButton /> : <RecordButton />}

                                    <Button onPress={handleAddEditEntry}>
                                        {isEditMode ? 'Update Entry' : 'Save Entry'}
                                    </Button>
                                </ScrollView>
                            </Card>
                        </TouchableWithoutFeedback>
                    </Modal>
                </Layout>
            </GestureHandlerRootView>
        </ApplicationProvider>
    );
};

// Dynamically calculate modal width based on screen width
const screenWidth = Dimensions.get('window').width;
const modalWidth = screenWidth * 0.9;

// Dynamic styling for modal width
const dynamicStyles = StyleSheet.create({
    modalCard: {
        width: modalWidth,
        height: 650,
        alignSelf: 'center',
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    card: {
        marginVertical: 4,
        padding: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    spacing: {
        marginBottom: 15,
    },
    renderSpacing: {
        marginBottom: 10,
    },
    centerContent: {
        alignItems: 'center',
    },
    label: {
        textAlign: 'left',
        color: '#8894ac',
    },
    picker: {
        marginBottom: 15,
        alignItems: 'flex-start',
        color: 'black',
    },
    buttonText: {
        marginLeft: 8,
        color: 'red',
    },
    exportButton: {
        marginTop: 20,
    },
});

export default index;