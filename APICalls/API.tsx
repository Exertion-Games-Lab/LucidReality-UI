import React, { createContext, useContext, useState, ReactNode } from 'react';

//ALL VARIABLES FOR SENDING COMMANDS STORED IN THIS FILE. TO MAKE THIS POSSIBLE WE WRAP THE WHOLE APP (see the outer most layout.tsx) IN THE APIPROVIDER WHICH ALLOWS ANY SCREEN TO ACCESS THE VARIABLES AND SEND COMMANDS

interface APIVariables {
    baseURL: string;
    port: number;
    ledValue: number;
    soundValue: number;
    vrGame: string;
    deviceType: string; // "portable" or "lab"
    ledCommandNo: number; // 1 for LAB, 2 for portable
    audioCommandNo: number; // 2 for LAB, 3 for portable
    gvsCommandNo: number; // 4 for LAB, 5 for portable
}

interface APIContextType {
    apiVariables: APIVariables;
    setAPIVariables: (newVars: Partial<APIVariables>) => void;
}

const defaultValues: APIVariables = {
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

const APIContext = createContext<APIContextType | undefined>(undefined);

export const APIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiVariables, setAPIVariablesState] = useState<APIVariables>(defaultValues);

    const setAPIVariables = (newVars: Partial<APIVariables>) => {
        // Check if deviceType is being updated and adjust command numbers accordingly
        let updatedVars = { ...newVars };
        if (newVars.deviceType !== undefined) {
            const isLab = newVars.deviceType === 'lab';
            updatedVars = {
                ...updatedVars,
                ledCommandNo: isLab ? 1 : 2,
                audioCommandNo: isLab ? 2 : 3,
                gvsCommandNo: isLab ? 4 : 5,
            };
        }

        setAPIVariablesState((currentVars) => ({ ...currentVars, ...updatedVars }));
    };

    return (
        <APIContext.Provider value={{ apiVariables, setAPIVariables }}>
            {children}
        </APIContext.Provider>
    );
};

export const useAPIVariables = () => {
    const context = useContext(APIContext);
    if (!context) {
        throw new Error('useAPIVariables must be used within a APIProvider');
    }
    return context;
};
