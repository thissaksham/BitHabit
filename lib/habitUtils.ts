import { format } from "date-fns";

export const calculateLatestStreak = (completions: string[]) => {
    if (!completions || completions.length === 0) return 0;

    // Use set to ensure uniqueness and sort descending
    const sorted = [...new Set(completions)].sort((a, b) => b.localeCompare(a));
    const todayStr = format(new Date(), "yyyy-MM-dd");

    // Find if we have today or yesterday to start the streak
    const lastDate = sorted[0];
    const lastDateObj = new Date(lastDate + "T00:00:00");
    const todayObj = new Date(todayStr + "T00:00:00");

    const diffDays = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));

    // If the most recent completion is more than 1 day ago, streak is broken
    if (diffDays > 1) return 0;

    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
        const current = new Date(sorted[i] + "T00:00:00");
        const prev = new Date(sorted[i - 1] + "T00:00:00");

        const diff = Math.floor((prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
            streak++;
        } else if (diff === 0) {
            continue;
        } else {
            break;
        }
    }
    return streak;
};

export const getCountLabel = (count: number) => {
    if (count === 1) return "once";
    if (count === 2) return "twice";
    if (count === 3) return "thrice";
    return `${count} times`;
};

export const getFrequencyText = (habit: any) => {
    const parts = [];
    if (habit.measurement?.value) {
        parts.push(`${habit.measurement.value} ${habit.measurement.unit}`);
    }
    if (habit.frequency) {
        const timesLabel = getCountLabel(habit.frequency.times);
        parts.push(`${timesLabel} in ${habit.frequency.days} days`);
    }
    return parts.join(", ");
};

// Focus Mode Utilities

export interface FocusSession {
    id: string;
    mode: 'focus' | 'break';
    durationSeconds: number;
    timestamp: string; // ISO string
}

export const recordFocusSession = (mode: 'focus' | 'break', durationSeconds: number) => {
    try {
        const saved = localStorage.getItem("focusSessions");
        const sessions: FocusSession[] = saved ? JSON.parse(saved) : [];

        const newSession: FocusSession = {
            id: Date.now().toString(),
            mode,
            durationSeconds,
            timestamp: new Date().toISOString()
        };

        sessions.push(newSession);
        localStorage.setItem("focusSessions", JSON.stringify(sessions));
        return true;
    } catch (e) {
        console.error("Failed to record focus session", e);
        return false;
    }
};

export const getFocusStats = (timeframe: string, mode: 'focus' | 'break') => {
    try {
        const saved = localStorage.getItem("focusSessions");
        if (!saved) return { cycles: 0, durationSeconds: 0 };

        const allSessions: FocusSession[] = JSON.parse(saved);
        const now = new Date();

        // Filter by mode first
        let sessions = allSessions.filter(s => s.mode === mode);

        // Filter by timeframe
        sessions = sessions.filter(s => {
            const date = new Date(s.timestamp);

            if (timeframe === "Today") {
                return date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear();
            }

            if (timeframe === "This Week") {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
                startOfWeek.setHours(0, 0, 0, 0);
                return date >= startOfWeek;
            }

            if (timeframe === "This Month") {
                return date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear();
            }

            return true; // Total time
        });

        const cycles = sessions.length;
        const totalSeconds = sessions.reduce((acc, curr) => acc + curr.durationSeconds, 0);

        return { cycles, durationSeconds: totalSeconds };
    } catch (e) {
        console.error("Failed to get focus stats", e);
        return { cycles: 0, durationSeconds: 0 };
    }
};

export const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};
