import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert, Platform } from 'react-native';
import { Layout, Text, Button, Card, Modal, Input, ApplicationProvider, SelectItem, Select, IndexPath } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as eva from '@eva-design/eva';
import { default as theme } from "../../../theme.json";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

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
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        loadDreamEntries();
    }, []);

    // Date change handler
    const onChangeDate = (_: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setNewEntry({ ...newEntry, date: currentDate.toISOString() });
    };

    // Time change handler
    const onChangeTime = (_: any, selectedTime?: Date) => {
        const currentTime = selectedTime || time;
        setNewEntry({ ...newEntry, sleepHours: currentTime.toISOString() });
    };

    const loadDreamEntries = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const result = await AsyncStorage.multiGet(keys);
            const entries = result.map(([key, value]) => value ? JSON.parse(value) : null).filter(Boolean) as DreamJournalEntry[];
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
            <Text category="h5">{item.title}</Text>
            <Text category="s1">Date: {item.date}</Text>
            <Text category="s1">Sleep Time: {item.sleepHours}</Text>
            <Text category="p1">Description: {item.description}</Text>
            <Text category="s1">Category: {item.category}</Text>
            {/* Display characters and locations if needed */}
            <View style={styles.buttonContainer}>
                <Button size="tiny" onPress={() => handleEditEntry(item)}>Edit</Button>
                <Button size="tiny" status="danger" onPress={() => handleDeleteEntry(item.id)}>Delete</Button>
            </View>
        </Card>
    );

    return (
        <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
            <Layout style={styles.container}>
                <Button onPress={() => { setModalVisible(true); resetForm(); }}>Add Dream Entry</Button>
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
                    <Card disabled={true}>
                        <Input
                            placeholder="Title"
                            value={newEntry.title}
                            onChangeText={(text) => setNewEntry({ ...newEntry, title: text })}
                        />
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                        />
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={time}
                            mode="time"
                            is24Hour={true} 
                            display="default"
                            onChange={onChangeTime}
                        />
                        <Input
                            placeholder="Description"
                            value={newEntry.description}
                            onChangeText={(text) => setNewEntry({ ...newEntry, description: text })}
                            textStyle={{ minHeight: 100 }} 
                            multiline={true}
                        />
                        <Select
                            selectedIndex={selectedIndex}
                            onSelect={(index) => setSelectedIndex(index as IndexPath)}
                            value={newEntry.category}
                        >
                            <SelectItem title='Normal' />
                            <SelectItem title='Lucid' />
                            <SelectItem title='Nightmare' />
                            <SelectItem title='Recurring' />
                        </Select>

                        <Button onPress={handleAddEditEntry}>
                            {isEditMode ? 'Update Entry' : 'Save Entry'}
                        </Button>
                    </Card>
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
});

export default DreamJournalScreen;