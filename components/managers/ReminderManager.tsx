"use client";

import { useEffect, useRef } from "react";
import { format } from "date-fns";

export default function ReminderManager() {
    const lastCheckMinute = useRef<string | null>(null);

    useEffect(() => {
        // Request permission on mount
        if (typeof window !== "undefined" && Notification.permission === "default") {
            Notification.requestPermission();
        }

        const addInAppNotification = (habit: any, timeStr: string, isMissed: boolean = false) => {
            const saved = localStorage.getItem("inAppNotifications");
            let notifications = [];
            if (saved) {
                try {
                    notifications = JSON.parse(saved);
                } catch (e) {
                    console.error(e);
                }
            }

            const newNotification = {
                id: Date.now() + Math.random(),
                habitId: habit.id,
                activity: habit.activity,
                time: timeStr,
                date: format(new Date(), "yyyy-MM-dd"),
                isMissed,
                read: false,
                timestamp: new Date().toISOString()
            };

            // Check if this notification was dismissed
            const dismissedKey = `${habit.id}-${timeStr}-${newNotification.date}`;
            const dismissedSaved = localStorage.getItem("dismissedNotifications");
            if (dismissedSaved) {
                try {
                    const dismissedList = JSON.parse(dismissedSaved);
                    if (dismissedList.includes(dismissedKey)) {
                        return; // Don't add if it was dismissed
                    }
                } catch (e) {
                    console.error(e);
                }
            }

            // Avoid duplicates
            const isDuplicate = notifications.some((n: any) =>
                n.habitId === habit.id && n.time === timeStr && n.date === newNotification.date
            );

            if (!isDuplicate) {
                localStorage.setItem("inAppNotifications", JSON.stringify([newNotification, ...notifications]));
                // Trigger a storage event for other components to update
                window.dispatchEvent(new Event('storage'));
            }
        };

        const checkReminders = () => {
            const now = new Date();
            const currentDayIndex = ((now.getDay() + 0) % 7); // 0 = Sunday, 1 = Monday... matching Step3Reminder logic
            const currentTimeStr = format(now, "hh:mm a");

            if (lastCheckMinute.current === currentTimeStr) return;
            lastCheckMinute.current = currentTimeStr;

            const savedHabits = localStorage.getItem("habits");
            if (!savedHabits) return;

            try {
                const habits = JSON.parse(savedHabits);

                habits.forEach((habit: any) => {
                    if (!habit.reminders?.days || !habit.reminders?.times) return;

                    if (habit.reminders.days.includes(currentDayIndex)) {
                        if (habit.reminders.times.includes(currentTimeStr)) {
                            // Browser notification
                            if (Notification.permission === "granted") {
                                new Notification(`Time for ${habit.activity}!`, {
                                    body: `This is your scheduled reminder to keep up your streak!`,
                                    icon: "/icon.png",
                                    tag: `${habit.id}-${currentTimeStr}`
                                });
                            }
                            // In-app notification
                            addInAppNotification(habit, currentTimeStr);
                        }
                    }
                });

                localStorage.setItem("lastReminderCheck", now.toISOString());
            } catch (e) {
                console.error("Error checking reminders:", e);
            }
        };

        // Catch-up logic for missed reminders
        const performCatchUp = () => {
            const lastCheck = localStorage.getItem("lastReminderCheck");
            if (!lastCheck) return;

            const now = new Date();
            const lastDate = new Date(lastCheck);

            // Limit catch-up to last 24 hours to avoid flooding
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const startDate = lastDate > oneDayAgo ? lastDate : oneDayAgo;

            const savedHabits = localStorage.getItem("habits");
            if (!savedHabits) return;

            try {
                const habits = JSON.parse(savedHabits);

                habits.forEach((habit: any) => {
                    if (!habit.reminders?.days || !habit.reminders?.times) return;

                    habit.reminders.times.forEach((timeStr: string) => {
                        // Check if this time occurred between startDate and now
                        // We simplify by checking if the time string occurred today or yesterday
                        // and if it was after lastCheck.

                        // For simplicity in this demo, we'll mark it as missed if it was meant to trigger
                        // between lastCheck and now.

                        // Parse timeStr (hh:mm a) into a date object for today
                        const [time, period] = timeStr.split(' ');
                        let [hours, minutes] = time.split(':').map(Number);
                        if (period === "PM" && hours < 12) hours += 12;
                        if (period === "AM" && hours === 12) hours = 0;

                        const reminderDate = new Date();
                        reminderDate.setHours(hours, minutes, 0, 0);

                        if (reminderDate > startDate && reminderDate < now) {
                            const dayIndex = reminderDate.getDay();
                            if (habit.reminders.days.includes(dayIndex)) {
                                addInAppNotification(habit, timeStr, true);
                            }
                        }
                    });
                });
            } catch (e) {
                console.error("Catch-up error:", e);
            }
        };

        performCatchUp();

        const intervalId = setInterval(checkReminders, 10000);
        checkReminders();

        return () => clearInterval(intervalId);
    }, []);

    return null; // Logic-only component
}
