"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Pencil, Zap, Trash2, Camera } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    differenceInDays,
    startOfDay
} from "date-fns";
import { useRouter } from "next/navigation";

interface HabitDetailOverlayProps {
    habit: {
        id: number;
        activity: string;
        measurement?: {
            value: string;
            unit: string;
        };
        color: string;
        streak?: number;
        displayMode?: 'count' | 'streak';
        reminders?: {
            days: number[];
            times: string[];
        };
        allCompletions?: string[]; // ISO date strings
        frequency?: {
            times: number;
            days: number;
        };
    };
    onClose: () => void;
    onUpdate: (habit: any) => void;
    onDelete: (id: number) => void;
    onEdit: (habit: any, step: number) => void;
}

export default function HabitDetailOverlay({
    habit,
    onClose,
    onUpdate,
    onDelete,
    onEdit,
}: HabitDetailOverlayProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [entries, setEntries] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const savedEntries = localStorage.getItem("journalEntries");
        if (savedEntries) {
            try {
                setEntries(JSON.parse(savedEntries));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const habitEntriesCount = entries.filter(e => e.context === habit.activity).length;

    const handleNotesClick = () => {
        localStorage.setItem("journal_initial_context", habit.activity);
        router.push("/journal");
    };

    // Calendar logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    });

    const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const isDayCompleted = (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return habit.allCompletions?.includes(dateStr);
    };

    const toggleCompletion = (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const newCompletions = habit.allCompletions?.includes(dateStr)
            ? habit.allCompletions.filter(d => d !== dateStr)
            : [...(habit.allCompletions || []), dateStr];

        onUpdate({
            ...habit,
            allCompletions: newCompletions
        });
    };

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const calculateLatestStreak = (completions: string[]) => {
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

    const latestStreak = useMemo(() => {
        return calculateLatestStreak(habit.allCompletions || []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [habit.allCompletions]);

    // Sync streak when completions change
    useEffect(() => {
        if (latestStreak !== habit.streak) {
            onUpdate({ ...habit, streak: latestStreak });
        }
    }, [latestStreak, habit, onUpdate]);

    const handleToggleDisplayMode = () => {
        const newMode = habit.displayMode === 'streak' ? 'count' : 'streak';
        onUpdate({ ...habit, displayMode: newMode });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full max-w-mobile bg-[#121212] rounded-t-[3rem] overflow-hidden flex flex-col"
                style={{ height: "92vh" }}
            >
                {/* Header */}
                <div
                    className="h-32 px-8 flex items-center justify-between"
                    style={{ backgroundColor: habit.color }}
                >
                    <h2 className="text-black text-4xl font-extrabold tracking-tight">
                        {habit.activity}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
                    >
                        <X className="w-8 h-8 text-black" strokeWidth={3} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-20 scrollbar-hide">
                    {/* Activity Section (Floating) */}
                    <div className="space-y-6">
                        {/* Month Selector */}
                        <div className="flex items-center justify-center min-h-[40px]">
                            <div className="flex items-center gap-4 text-white/40 font-bold">
                                <button onClick={prevMonth} className="p-1 hover:text-white transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-white text-xl min-w-[120px] text-center">
                                    {format(currentMonth, "MMMM")}
                                </span>
                                <button onClick={nextMonth} className="p-1 hover:text-white transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-y-6">
                            {dayLabels.map(day => (
                                <div key={day} className="text-white/20 text-center font-bold text-xs uppercase tracking-widest">
                                    {day}
                                </div>
                            ))}
                            {calendarDays.map((day, i) => {
                                const completed = isDayCompleted(day);
                                const isCurrentMonth = isSameMonth(day, monthStart);

                                const isEditable = differenceInDays(startOfDay(new Date()), startOfDay(day)) <= 6 && differenceInDays(startOfDay(new Date()), startOfDay(day)) >= 0;

                                return (
                                    <div
                                        key={i}
                                        className="flex flex-col items-center justify-center h-12"
                                    >
                                        <button
                                            onClick={() => isEditable && toggleCompletion(day)}
                                            disabled={!isEditable}
                                            className={`relative w-12 h-12 flex items-center justify-center transition-all active:scale-75 ${!isCurrentMonth || !isEditable ? "opacity-30" : ""
                                                } ${!isEditable ? "cursor-not-allowed" : ""}`}
                                        >
                                            {completed ? (
                                                <div className="text-white">
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", damping: 10, stiffness: 400 }}
                                                    >
                                                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </motion.div>
                                                </div>
                                            ) : (
                                                <span className={`text-xl font-bold ${isSameDay(day, new Date()) ? "text-white" : "text-white/30"
                                                    }`}>
                                                    {format(day, "d")}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Stats Row (Centered Toggle) */}
                        <div className="flex items-center justify-between px-4 pt-4 pb-2">
                            {/* Count Section */}
                            <div className={`flex items-center gap-2 transition-opacity ${habit.displayMode === 'streak' ? 'opacity-30' : 'opacity-100'}`}>
                                <span className="text-white/50 font-bold text-xl">Count</span>
                                <span className="text-white font-bold text-3xl">{habit.allCompletions?.length || 0}</span>
                                <X className="w-5 h-5 text-white/50" strokeWidth={6} />
                            </div>

                            {/* Center Toggle */}
                            <button
                                onClick={handleToggleDisplayMode}
                                className="w-12 h-6 bg-white/10 rounded-full p-0.5 transition-colors hover:bg-white/15"
                            >
                                <motion.div
                                    animate={{ x: habit.displayMode === 'streak' ? 22 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                    className="w-5 h-5 bg-white rounded-full shadow-lg"
                                />
                            </button>

                            {/* Streak Section */}
                            <div className={`flex items-center gap-2 transition-opacity ${habit.displayMode === 'streak' ? 'opacity-100' : 'opacity-30'}`}>
                                <span className="text-white/50 font-bold text-xl">Streak</span>
                                <Zap className="w-5 h-5 fill-white/50 text-white/50" />
                                <span className="text-white font-bold text-3xl">{habit.streak || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="space-y-6">
                        <h3 className="text-white text-2xl font-bold px-2">Notes</h3>
                        <button
                            onClick={handleNotesClick}
                            className="flex items-center justify-between w-full px-6 h-18 py-5 rounded-3xl group transition-all active:scale-95 text-left"
                            style={{ backgroundColor: habit.color }}
                        >
                            <span className="text-black text-xl font-bold">
                                {habitEntriesCount === 0 ? "No notes yet" : `${habitEntriesCount} notes`}
                            </span>
                            <ChevronRight className="w-6 h-6 text-black/30 group-hover:text-black transition-colors" />
                        </button>
                    </div>

                    {/* Goal Section */}
                    <div className="space-y-6">
                        <h3 className="text-white text-2xl font-bold px-2">Goal</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => onEdit(habit, 1)}
                                className="flex items-center justify-between w-full px-6 h-18 py-5 rounded-3xl group transition-all active:scale-95 text-left"
                                style={{ backgroundColor: habit.color }}
                            >
                                <span className="text-black text-xl font-bold">
                                    {habit.activity} {habit.frequency ? `${habit.frequency.times} times in ${habit.frequency.days} days` : "every day"}
                                </span>
                                <Pencil className="w-6 h-6 text-black/30 group-hover:text-black transition-colors" />
                            </button>

                            {habit.measurement?.value && (
                                <button
                                    onClick={() => onEdit(habit, 2)}
                                    className="flex items-center justify-between w-full px-6 h-18 py-5 rounded-3xl group transition-all active:scale-95 text-left"
                                    style={{ backgroundColor: habit.color }}
                                >
                                    <span className="text-black text-xl font-bold">
                                        {habit.measurement.value} {habit.measurement.unit}
                                    </span>
                                    <Pencil className="w-6 h-6 text-black/30 group-hover:text-black transition-colors" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Reminders Section */}
                    <div className="space-y-6">
                        <h3 className="text-white text-2xl font-bold px-2">Reminders</h3>
                        <button
                            onClick={() => onEdit(habit, 3)}
                            className="flex items-center justify-between w-full px-6 h-18 py-5 rounded-3xl group transition-all active:scale-95 text-left"
                            style={{ backgroundColor: habit.color }}
                        >
                            <span className="text-black text-lg font-medium leading-tight">
                                {(() => {
                                    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                                    const selectedDays = habit.reminders?.days || [];
                                    const daysText = selectedDays.length === 7
                                        ? "every day"
                                        : selectedDays.length === 0
                                            ? "no days"
                                            : "on " + selectedDays.map(d => dayNames[d]).join(", ");

                                    return (
                                        <>
                                            Remind me {daysText} at <br />
                                            <span className="text-black/60">
                                                {habit.reminders?.times && habit.reminders.times.length > 0
                                                    ? habit.reminders.times.join(", ")
                                                    : "No reminders set"}
                                            </span>
                                        </>
                                    );
                                })()}
                            </span>
                            <Pencil className="w-6 h-6 text-black/30 group-hover:text-black transition-colors" />
                        </button>
                    </div>

                    {/* Delete Section */}
                    <div className="pt-4">
                        <AnimatePresence mode="wait">
                            {!showDeleteConfirm ? (
                                <motion.button
                                    key="delete-btn"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full h-18 py-5 text-red-500 font-bold text-xl flex items-center justify-center hover:bg-red-500/10 rounded-3xl transition-all active:scale-95"
                                >
                                    Delete Habit
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="confirm-delete"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col gap-3"
                                >
                                    <p className="text-white/60 text-center text-lg font-medium">Are you sure?</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="flex-1 h-14 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all active:scale-95"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => onDelete(habit.id)}
                                            className="flex-1 h-14 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all active:scale-95"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Corner radius accent */}
                <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-white/20 rounded-br-lg" />
            </motion.div>
        </div>
    );
}
