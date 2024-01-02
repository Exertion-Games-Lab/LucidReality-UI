import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import styles from "../../constants/Style"

export default function introToSystem() {
  return (
    <>
    <Stack.Screen options={{ title: 'Intro' }} />
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Intro to our System</Text>

      <ScrollView>
        <Text>Lucid dreaming provides a unique conscious control during dreams, where dreamers can engage in volitional actions not limited by the constraints of the physical world. However, this can be challenging to achieve. Current techniques can only induce lucidity in 57% of attempts. This project developed an autonomous modular prototype system that combines non-invasive interactive technologies to increase lucid dream induction rates above 57% and enable dreamers to control their dream content. Furthermore, a modular system would allow future researchers to add new stimuli devices that could further the induction success rates or trigger even more complex dream content.
            The system will monitor sleep stages via EEG and deliver stimuli at optimal moments to trigger lucidity. EOG signals allow dreamers to communicate with researchers and ask for desired dream content. If induction and control improve, lucid dreaming benefits like recreation or therapy can advance . This research will increase lucid dream induction success and control, enabling further studies and applications.
        </Text>
      </ScrollView>
    </SafeAreaView>
    </>
  );
}

