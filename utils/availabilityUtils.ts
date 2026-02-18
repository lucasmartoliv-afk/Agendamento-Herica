
import { AvailabilitySettings } from '../types';

const AVAILABILITY_SETTINGS_KEY = 'hericaStudioAvailabilitySettings';

// Default settings: Monday to Saturday, 9 AM to 5 PM
const DEFAULT_SETTINGS: AvailabilitySettings = {
    workDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
    startTime: '09:00',
    endTime: '17:00',
    exceptions: [],
};

export const getAvailabilitySettings = (): AvailabilitySettings => {
    try {
        const storedSettings = localStorage.getItem(AVAILABILITY_SETTINGS_KEY);
        if (storedSettings) {
            // Ensure exceptions array exists for backward compatibility
            const parsed = JSON.parse(storedSettings);
            if (!parsed.exceptions) {
                parsed.exceptions = [];
            }
            return parsed;
        }
        return DEFAULT_SETTINGS;
    } catch (error) {
        console.error("Failed to parse availability settings", error);
        return DEFAULT_SETTINGS;
    }
};

export const saveAvailabilitySettings = (settings: AvailabilitySettings) => {
    try {
        localStorage.setItem(AVAILABILITY_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save availability settings", error);
    }
};
