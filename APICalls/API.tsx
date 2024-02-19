import React, { createContext, useContext, useState, ReactNode } from 'react';

interface APIVariables {
  postURL: string;
  ledValue: number;
  soundValue: number;
}

interface APIContextType {
  apiVariables: APIVariables;
  setAPIVariables: (newVars: Partial<APIVariables>) => void;
}

const defaultValues: APIVariables = {
  postURL: 'http://192.168.1.7:8080',
  ledValue: 10,
  soundValue: 10,
};

const APIContext = createContext<APIContextType | undefined>(undefined);

export const APIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiVariables, setAPIVariablesState] = useState<APIVariables>(defaultValues);

  const setAPIVariables = (newVars: Partial<APIVariables>) => {
    setAPIVariablesState((currentVars) => ({ ...currentVars, ...newVars }));
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
