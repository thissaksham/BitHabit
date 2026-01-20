"use client";

import { Plus, Bell } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import WeekCalendar from "@/components/habits/WeekCalendar";
import EmptyState from "@/components/habits/EmptyState";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import CreateHabitFlow from "@/components/habits/CreateHabitFlow";
import HabitCard from "@/components/habits/HabitCard";
import HabitDetailOverlay from "@/components/habits/HabitDetailOverlay";
import NotificationOverlay from "@/components/notifications/NotificationOverlay";
import { AnimatePresence, motion } from "framer-motion";
import { HabitListSkeleton } from "@/components/ui/Skeletons";
import { safeLocalStorage } from "@/lib/safeStorage";
import Toast from "@/components/ui/Toast";
import { calculateLatestStreak } from "@/lib/habitUtils";

export default function HabitsPage() {
    const [showCreateFlow, setShowCreateFlow] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
    const [editingHabit, setEditingHabit] = useState<any | null>(null);
    const [editStep, setEditStep] = useState<number>(1);
    const [habits, setHabits] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [bouncingHabit, setBouncingHabit] = useState<number | null>(null);

    // Load from localStorage with safe storage
    useEffect(() => {
        const parsed = safeLocalStorage.getItem<any[]>("habits", []);
        const migrated = parsed.map((h: any, i: number) => ({
            ...h,
            id: h.id || `legacy-${i}-${Date.now()}`,
            streak: h.streak || 0
        }));
        setHabits(migrated);
        // Small delay for smooth skeleton transition
        setTimeout(() => setIsLoaded(true), 300);
    }, []);

    // Load unread status with safe storage
    useEffect(() => {
        const checkUnread = () => {
            const notifications = safeLocalStorage.getItem<any[]>("inAppNotifications", []);
            setHasUnread(notifications.some((n: any) => !n.read));
        };

        checkUnread();
        window.addEventListener('storage', checkUnread);
        return () => window.removeEventListener('storage', checkUnread);
    }, []);

    // Save to localStorage with safe storage
    useEffect(() => {
        if (isLoaded) {
            safeLocalStorage.setItem("habits", habits);
        }
    }, [habits, isLoaded]);



    const handleToggleDay = (habitId: number, dayIndex: number) => {
        // Trigger bounce animation
        setBouncingHabit(habitId);
        setTimeout(() => setBouncingHabit(null), 300);

        setHabits(prevHabits => prevHabits.map(habit => {
            if (habit.id === habitId) {
                const completedDays = habit.completedDays || [];
                const isCompleted = completedDays.includes(dayIndex);
                const newCompletedDays = isCompleted
                    ? completedDays.filter((d: number) => d !== dayIndex)
                    : [...completedDays, dayIndex];

                // Sync with allCompletions (mocking dates for the current week: Jan 13-19)
                const mockDates = ["2026-01-13", "2026-01-14", "2026-01-15", "2026-01-16", "2026-01-17", "2026-01-18", "2026-01-19"];
                const toggledDate = mockDates[dayIndex];
                const allCompletions = habit.allCompletions || [];
                const newAllCompletions = isCompleted
                    ? allCompletions.filter((d: string) => d !== toggledDate)
                    : [...allCompletions, toggledDate];

                return {
                    ...habit,
                    completedDays: newCompletedDays,
                    allCompletions: newAllCompletions,
                    streak: calculateLatestStreak(newAllCompletions)
                };
            }
            return habit;
        }));
    };

    const handleUpdateHabit = (updatedHabit: any) => {
        // When updating from overlay, we should derive completedDays for the current week
        const mockDates = ["2026-01-13", "2026-01-14", "2026-01-15", "2026-01-16", "2026-01-17", "2026-01-18", "2026-01-19"];
        const newCompletedDays = mockDates
            .map((date, index) => updatedHabit.allCompletions?.includes(date) ? index : -1)
            .filter(index => index !== -1);

        const finalHabit = {
            ...updatedHabit,
            completedDays: newCompletedDays,
            streak: calculateLatestStreak(updatedHabit.allCompletions || [])
        };
        setHabits(prevHabits => prevHabits.map(h => h.id === finalHabit.id ? finalHabit : h));
    };

    const handleDeleteHabit = (habitId: number) => {
        if (confirm("Are you sure you want to delete this habit?")) {
            setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));
            setSelectedHabitId(null);
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 5rem)' }}>
                <PageHeader title="Habits">
                    <div className="flex items-center gap-3">
                        <button className="text-white/50">
                            <Bell className="w-6 h-6" />
                        </button>
                        <button className="text-white/50">
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </PageHeader>

                <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
                    <div className="mb-6">
                        <WeekCalendar />
                    </div>
                    <HabitListSkeleton />
                </div>
            </div>
        );
    }

    const selectedHabit = habits.find(h => h.id === selectedHabitId);

    return (
        <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 5rem)' }}>
            <PageHeader title="Habits">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowNotifications(true)}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1c1c1c] text-white hover:bg-[#2c2c2c] transition-colors relative"
                    >
                        <Bell className="w-6 h-6" />
                        {hasUnread && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1c1c1c]"
                            />
                        )}
                    </button>
                    <button
                        onClick={() => {
                            setEditingHabit(null);
                            setEditStep(1);
                            setShowCreateFlow(true);
                        }}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1c1c1c] text-white hover:bg-[#2c2c2c] transition-colors"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>
            </PageHeader>

            <div className="px-6 flex-shrink-0">
                <WeekCalendar />
            </div>

            <div
                className="flex-1 overflow-y-auto min-h-0"
                style={{
                    maskImage: 'linear-gradient(to bottom, transparent 0px, black 20px)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 20px)'
                }}
            >
                <div className="mt-4 px-6 pb-24">
                    {habits.length === 0 ? (
                        <EmptyState onCreateClick={() => {
                            setEditingHabit(null);
                            setEditStep(1);
                            setShowCreateFlow(true);
                        }} />
                    ) : (
                        <div className="space-y-4">
                            {habits.map((habit) => (
                                <HabitCard
                                    key={habit.id}
                                    habit={habit}
                                    onToggleDay={(dayIdx) => handleToggleDay(habit.id, dayIdx)}
                                    onClick={() => setSelectedHabitId(habit.id)}
                                    isBouncing={bouncingHabit === habit.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showCreateFlow && (
                    <CreateHabitFlow
                        onClose={() => {
                            setShowCreateFlow(false);
                            setEditingHabit(null);
                        }}
                        initialData={editingHabit}
                        initialStep={editStep}
                        onComplete={(habit) => {
                            if (editingHabit) {
                                // Update existing habit
                                const updatedHabit = {
                                    ...editingHabit,
                                    ...habit,
                                    id: editingHabit.id,
                                    streak: calculateLatestStreak(editingHabit.allCompletions || []),
                                    completedDays: editingHabit.completedDays,
                                    allCompletions: editingHabit.allCompletions
                                };
                                setHabits(habits.map(h => h.id === editingHabit.id ? updatedHabit : h));
                                setEditingHabit(null);
                                setToastMessage("Habit updated!");
                                setShowToast(true);
                            } else {
                                // Create new habit
                                const newHabit = {
                                    ...habit,
                                    id: Date.now(),
                                    streak: 0,
                                    completedDays: [],
                                    allCompletions: []
                                };
                                setHabits([...habits, newHabit]);
                                setToastMessage("Habit created!");
                                setShowToast(true);
                            }
                            setShowCreateFlow(false);
                        }}
                    />
                )}

                {selectedHabit && (
                    <HabitDetailOverlay
                        habit={selectedHabit}
                        onClose={() => setSelectedHabitId(null)}
                        onUpdate={handleUpdateHabit}
                        onDelete={handleDeleteHabit}
                        onEdit={(habit, step) => {
                            setSelectedHabitId(null);
                            setEditingHabit(habit);
                            setEditStep(step);
                            setShowCreateFlow(true);
                        }}
                    />
                )}
            </AnimatePresence>
            <NotificationOverlay
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
            />
            <Toast
                message={toastMessage}
                type="success"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
