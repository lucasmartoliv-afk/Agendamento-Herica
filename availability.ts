
import { getAvailabilitySettings } from './utils/availabilityUtils';
import { parseTime } from './utils/bookingUtils';

// This function dynamically generates a schedule for the next 60 days
// based on the settings saved by the admin, including exceptions.
const generateAvailability = (): Record<string, string[]> => {
    const availableSlots: Record<string, string[]> = {};
    const settings = getAvailabilitySettings();
    const today = new Date();

    const regularStartTime = parseTime(settings.startTime);
    const regularEndTime = parseTime(settings.endTime);
    
    // Generate for the next 60 days
    for (let i = 0; i < 60; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        const exception = settings.exceptions.find(ex => ex.date === dateKey);

        let startTimeInMinutes = regularStartTime;
        let endTimeInMinutes = regularEndTime;
        let isWorkDay = settings.workDays.includes(date.getDay());

        if (exception) {
            isWorkDay = exception.isWorking;
            if (isWorkDay) {
                startTimeInMinutes = parseTime(exception.startTime);
                endTimeInMinutes = parseTime(exception.endTime);
            }
        }

        if (!isWorkDay) {
            continue;
        }

        const daySlots: string[] = [];

        // Generate 30-minute slots from start to end time
        for (let minutes = startTimeInMinutes; minutes < endTimeInMinutes; minutes += 30) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            const timeString = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
            daySlots.push(timeString);
        }
        
        if (daySlots.length > 0) {
            availableSlots[dateKey] = daySlots;
        }
    }

    return availableSlots;
}

// AVAILABLE_SLOTS is now a function that gets called to generate slots on the fly
export const getAvailableSlots = () => generateAvailability();
