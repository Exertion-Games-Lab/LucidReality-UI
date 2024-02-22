import AsyncStorage from "@react-native-async-storage/async-storage";

// API variables
export interface APIVariables {
    baseURL: string;
    port: number;
    ledValue: number;
    soundValue: number;
    vrGame: string;
    deviceType: 'portable' | 'lab';
    ledCommandNo: number;
    audioCommandNo: number;
    gvsCommandNo: number;
}

export const defaultValues: APIVariables = {
    baseURL: 'http://192.168.86.25',
    port: 8080,
    ledValue: 20,
    soundValue: 20,
    vrGame: 'Subnautica',
    deviceType: 'lab',
    ledCommandNo: 1,
    audioCommandNo: 2,
    gvsCommandNo: 4,
};

// AsyncStorage functions
export const saveAPIVariables = async (variables: APIVariables) => {
    try {
        const jsonValue = JSON.stringify(variables);
        await AsyncStorage.setItem('@APIVariables', jsonValue);
        console.log("Saved API Variables:", variables); // Logging the variables being saved
    } catch (e) {
        console.error("Error saving API variables:", e);
    }
};

export const loadAPIVariables = async (): Promise<APIVariables> => {
    try {
        const jsonValue = await AsyncStorage.getItem('@APIVariables');
        const loadedVariables = jsonValue != null ? JSON.parse(jsonValue) : defaultValues;
        console.log("Loaded API Variables:", loadedVariables); // Logging the loaded variables
        return loadedVariables;
    } catch (e) {
        console.error("Error loading API variables:", e);
        return defaultValues;
    }
};