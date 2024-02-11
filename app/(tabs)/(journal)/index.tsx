import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert, Platform } from 'react-native';
import { Layout, Text, Button, Card, Modal, Input, ApplicationProvider, SelectItem, Select, IndexPath } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';



interface DreamJournalEntry {
    id: string;
    title: string;
    date: string;
    sleepHours: string;
    description: string;
    category: 'Normal' | 'Lucid' | 'Nightmare' | 'Recurring';
    characters: string[];
    locations: string[];
}

const DreamJournalScreen: React.FC = () => {
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

    // Dynamically calculate modal width based on screen width
    const screenWidth = Dimensions.get('window').width;
    const modalWidth = screenWidth * 0.9; // 90% of the screen width

    //Dynamic styling for modal width
    const dynamicStyles = StyleSheet.create({
        modalCard: {
            width: modalWidth, // Use the dynamically calculated width
            height: 530,
            alignSelf: 'center', // Center the card
        },
    });

    useEffect(() => {
        loadDreamEntries();
    }, []);

    // Date change handler
    const onChangeDate = (_: any, selectedDate?: Date) => {
        const currentDate = selectedDate ? selectedDate.toISOString() : newEntry.date; // Keep existing date if none selected
        setNewEntry({ ...newEntry, date: currentDate });
    };

    // Time change handler
    const onChangeTime = (_: any, selectedTime?: Date) => {
        const currentTime = selectedTime ? selectedTime.toISOString() : newEntry.sleepHours; // Keep existing time if none selected
        setNewEntry({ ...newEntry, sleepHours: currentTime });
    };

    const formatDate = (isoString: string | number | Date) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const formatTime = (isoString: string | number | Date) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const loadDreamEntries = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const result = await AsyncStorage.multiGet(keys);
            let entries = result.map(([key, value]) => value ? JSON.parse(value) : null).filter(Boolean) as DreamJournalEntry[];

            // Sort entries by date from most recent to furthest away
            entries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setDreamEntries(entries);
        } catch (e) {
            console.log(e);
        }
    };


    const saveDreamEntry = async (entry: DreamJournalEntry) => {
        try {
            const jsonValue = JSON.stringify(entry);
            await AsyncStorage.setItem(`@dream_journal_${entry.id}`, jsonValue);
            if (isEditMode) {
                setDreamEntries(dreamEntries.map((item) => (item.id === entry.id ? entry : item)));
            } else {
                setDreamEntries([...dreamEntries, entry]);
            }
            loadDreamEntries(); // Refresh entries list
        } catch (e) {
            console.log(e);
        }
    };

    const deleteDreamEntry = async (id: string) => {
        try {
            await AsyncStorage.removeItem(`@dream_journal_${id}`);
            setDreamEntries(dreamEntries.filter((entry) => entry.id !== id));
        } catch (e) {
            console.log(e);
        }
    };

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

    const handleDeleteEntry = (id: string) => {
        Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
            { text: "Cancel" },
            { text: "Yes", onPress: () => deleteDreamEntry(id) },
        ]);
    };

    const handleEditEntry = (entry: DreamJournalEntry) => {
        setNewEntry(entry);
        setIsEditMode(true);
        setEditEntryId(entry.id);
        setModalVisible(true);
        const categoryIndex = ['Normal', 'Lucid', 'Nightmare', 'Recurring'].indexOf(entry.category);
        setSelectedIndex(new IndexPath(categoryIndex));
    };

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
            {/* Display characters and locations if needed */}
            <View style={styles.buttonContainer}>
                <Button accessoryLeft={edit} size="tiny" onPress={() => handleEditEntry(item)}>   Edit  </Button>
                <Button accessoryLeft={bin} size="tiny" status="danger" onPress={() => handleDeleteEntry(item.id)}>Delete</Button>
            </View>
        </Card>
    );

    const plus = (props: any) => (
        <Feather name="plus" size={18} color="white" />
    );

    const edit = (props: any) => (
        <Feather name="edit" size={13} color="white" />
    );

    const bin = (props: any) => (
        <MaterialIcons name="delete" size={13} color="white" />
    );


    return (
        <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
            <Layout style={styles.container}>
                <Button accessoryLeft={plus} onPress={() => { setModalVisible(true); resetForm(); }}>Add Dream Entry</Button>
                <FlatList
                    data={dreamEntries}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
                <Modal

                    visible={modalVisible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => { setModalVisible(false); resetForm(); }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <Card disabled={true} style={dynamicStyles.modalCard}>
                            <ScrollView>
                                <Input
                                    label="Title"
                                    style={styles.spacing}
                                    value={newEntry.title}
                                    onChangeText={(text) => setNewEntry({ ...newEntry, title: text })}
                                />
                                <Text category='label' style={styles.label}>Date</Text>
                                <DateTimePicker
                                    testID="dateTimePicker-date"
                                    value={new Date(newEntry.date || new Date().toISOString())} // Fallback to current date if newEntry.date is empty
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDate}
                                    style={styles.picker}
                                />
                                <Text category='label' style={styles.label}>Wake Up Time</Text>
                                <DateTimePicker
                                    testID="dateTimePicker-time"
                                    value={newEntry.sleepHours ? new Date(newEntry.sleepHours) : new Date()} // Use today's date with the stored time or fallback to current time
                                    mode="time"
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChangeTime}
                                    style={styles.picker}
                                />

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
                                <Input
                                    label="Description"
                                    value={newEntry.description}
                                    onChangeText={(text) => setNewEntry({ ...newEntry, description: text })}
                                    textStyle={{ minHeight: 130 }}
                                    multiline={true}
                                    style={styles.spacing}
                                />
                            </ScrollView>
                            <Button onPress={handleAddEditEntry}>
                                {isEditMode ? 'Update Entry' : 'Save Entry'}
                            </Button>
                        </Card>
                    </TouchableWithoutFeedback>
                </Modal>
            </Layout>
        </ApplicationProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    card: {
        marginVertical: 4,
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
        marginBottom: 15, // Space between form elements
    },
    renderSpacing: {
        marginBottom: 10, // Space between form elements
    },
    centerContent: {
        alignItems: 'center', // Center content horizontally
    },
    label: {
        textAlign: 'left',
        color: '#8894ac'
    },
    picker: {
        marginBottom: 15,
        alignItems: 'flex-start',
        color: 'black',
    }
});

export default DreamJournalScreen;