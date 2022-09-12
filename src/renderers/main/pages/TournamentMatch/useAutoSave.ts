import { useState } from "react";

export function useAutoSave<T>(key: string, location: string, initialState: T) {

    const [state, setState] = useState<T>(() => {
        let savedData = JSON.parse(localStorage.getItem(location));
        if (savedData !== null) {
            if(savedData[key]) {
                return savedData[key];
            }
            savedData[key] = initialState;
            localStorage.setItem(location, JSON.stringify(savedData));
            return initialState;
        }
        savedData = { ...savedData };
        savedData[key] = initialState;
        localStorage.setItem(location, JSON.stringify(savedData));
        return initialState;
    });

    const setSaveState = (newState: T) => {
        const savedData = JSON.parse(localStorage.getItem(location));
        savedData[key] = newState;
        localStorage.setItem(location, JSON.stringify(savedData));
        setState(newState);
    }

    return [state, setSaveState] as [T, (newState: T) => void];
}