const ADMIN_PASSWORD_KEY = 'hericaAdminPassword';
const DEFAULT_ADMIN_PASSWORD = 'senha123';

export const getAdminPassword = (): string => {
    try {
        const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
        return storedPassword || DEFAULT_ADMIN_PASSWORD;
    } catch (error) {
        console.error("Failed to get admin password from localStorage", error);
        return DEFAULT_ADMIN_PASSWORD;
    }
};

export const setAdminPassword = (newPassword: string) => {
    try {
        if (!newPassword || newPassword.trim() === '') {
            throw new Error("Password cannot be empty");
        }
        localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword.trim());
    } catch (error) {
        console.error("Failed to set admin password in localStorage", error);
    }
};
