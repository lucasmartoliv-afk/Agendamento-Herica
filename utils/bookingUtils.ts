
import { BookedSlot } from '../types';

const BOOKING_STORAGE_KEY = 'bellaStudioBookedSlots';

// Safely gets booked slots from localStorage
export const getBookedSlots = (): BookedSlot[] => {
    try {
        const storedSlots = localStorage.getItem(BOOKING_STORAGE_KEY);
        return storedSlots ? JSON.parse(storedSlots) : [];
    } catch (error) {
        console.error("Failed to parse booked slots from localStorage", error);
        return [];
    }
};

// Saves a new slot and updates localStorage
export const saveBookedSlot = (newSlot: BookedSlot) => {
    try {
        const currentSlots = getBookedSlots();
        const updatedSlots = [...currentSlots, newSlot];
        localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(updatedSlots));
    } catch (error) {
        console.error("Failed to save booked slot to localStorage", error);
    }
};

// Parses a time string (e.g., "14:30") into minutes from midnight
export const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};
