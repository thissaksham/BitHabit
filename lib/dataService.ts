import { safeLocalStorage } from "./safeStorage";

export interface AppData {
    habits: any[];
    journalEntries: any[];
    notifications: {
        inApp: any[];
        dismissed: any[];
    };
    version: string;
    exportDate: string;
}

/**
 * DataService centralizes all data operations.
 * Currently it uses localStorage via safeLocalStorage.
 * In the future, these methods can be updated to sync with Supabase
 * without changing the UI implementation.
 */
export const dataService = {
    /**
     * Aggregates all application data into a single object for backup.
     */
    async getAllData(): Promise<AppData> {
        return {
            habits: safeLocalStorage.getItem("habits", []),
            journalEntries: safeLocalStorage.getItem("journalEntries", []),
            notifications: {
                inApp: safeLocalStorage.getItem("inAppNotifications", []),
                dismissed: safeLocalStorage.getItem("dismissedNotifications", []),
            },
            version: "1.0.0",
            exportDate: new Date().toISOString()
        };
    },

    /**
     * Validates and restores data from a backup object.
     */
    async restoreData(data: AppData): Promise<boolean> {
        // Basic validation - check for essential structure
        if (!data || typeof data !== 'object') return false;
        if (!Array.isArray(data.habits)) return false;

        try {
            // Persist to local storage (Future: Sync to Supabase)
            safeLocalStorage.setItem("habits", data.habits);
            safeLocalStorage.setItem("journalEntries", data.journalEntries || []);

            if (data.notifications) {
                safeLocalStorage.setItem("inAppNotifications", data.notifications.inApp || []);
                safeLocalStorage.setItem("dismissedNotifications", data.notifications.dismissed || []);
            }

            // Force a slight delay to simulate "processing" and allow UI feedback
            await new Promise(resolve => setTimeout(resolve, 800));

            return true;
        } catch (e) {
            console.error("Data restoration failed:", e);
            return false;
        }
    },

    /**
     * Helper to trigger a file download for the exported JSON
     */
    downloadBackup(data: AppData) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};
