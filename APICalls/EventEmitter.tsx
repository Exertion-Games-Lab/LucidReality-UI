// EventEmitter.ts
//OUTDATED
//The eventemitter is responsible for reloading components and screens if anything in the connect.tsx is changed. This ensures that we are always using the most up to date API VARIABLES.
import { EventEmitter } from 'events';

export default new EventEmitter();


{/* If you want to ensure a component reloads when the save button is pressed in connect.tsx, then use this use effect in your component. 

//Reloads variables if save button is pressed on connect page
    useEffect(() => {
        const fetchVariables = async () => {
            const loadedVariables = await loadAPIVariables();
            setApiVariables(loadedVariables);
        };

        // Listen for updates
        const updateListener = () => {
            fetchVariables(); // Re-fetch variables when an update is detected
        };

        GlobalEventEmitter.on('variablesUpdated', updateListener);

        // Initial fetch
        fetchVariables();

        // Cleanup
        return () => {
            GlobalEventEmitter.removeListener('variablesUpdated', updateListener);
        };
    }, []);

*/}