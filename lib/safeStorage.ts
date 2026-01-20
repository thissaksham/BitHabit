// Utility functions for safe localStorage operations

export const safeLocalStorage = {
    getItem: <T = any>(key: string, fallback: T): T => {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return fallback;
            return JSON.parse(item) as T;
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return fallback;
        }
    },

    setItem: (key: string, value: any): boolean => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage (${key}):`, error);
            return false;
        }
    },

    removeItem: (key: string): boolean => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
            return false;
        }
    },
};
