
// In a real application, this data would come from a database or an API
// managed by an admin panel where Hérica could set her availability.

// This function generates a schedule for the next 60 days.
const generateAvailability = (): Record<string, string[]> => {
    const availableSlots: Record<string, string[]> = {};
    const today = new Date();
    
    // Operating hours
    const workHours = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        // Lunch break from 12:00 to 13:00
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];
    
    // Generate for the next 60 days
    for (let i = 0; i < 60; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dayOfWeek = date.getDay();
        
        // 0 = Sunday, 6 = Saturday. Let's say she doesn't work on Sundays.
        if (dayOfWeek === 0) {
            continue;
        }

        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
        availableSlots[dateKey] = workHours;
    }

    return availableSlots;
}

export const AVAILABLE_SLOTS = generateAvailability();
