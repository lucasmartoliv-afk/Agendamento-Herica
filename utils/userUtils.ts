
import { User } from '../types';

const USER_STORAGE_KEY = 'studioHericaUser';

export const saveUser = (user: User) => {
    try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Failed to save user to localStorage", error);
    }
};

export const getUser = (): User | null => {
    try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        return null;
    }
};

export const clearUser = () => {
    try {
        localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
        console.error("Failed to clear user from localStorage", error);
    }
};
