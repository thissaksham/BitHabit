"use client";

import { X, Check, Zap, Bell, BellOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import { getFrequencyText } from "@/lib/habitUtils";

interface HabitCardProps {
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
            times: string[];
            days: number[];
        };
        allCompletions?: string[]; // ISO date strings
        completedDays?: number[]; // indices 0-6
        frequency?: {
            times: number;
            days: number;
        };
    };
    onToggleDay?: (dayIndex: number) => void;
    onClick?: () => void;
    isBouncing?: boolean;
}

const HabitCard = memo(({ habit, onToggleDay, onClick, isBouncing = false }: HabitCardProps) => {
    const days = [0, 1, 2, 3, 4, 5, 6];

    return (
        <motion.div
            onClick={onClick}
            className="w-full p-6 rounded-[2.5rem] flex flex-col gap-4 shadow-sm cursor-pointer transition-transform active:scale-[0.98]"
            style={{ backgroundColor: habit.color }}
            animate={isBouncing ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
            <div className="grid grid-cols-[100px_1fr] items-center">
                <div className="flex items-center gap-1 text-black">
                    <span className="font-bold text-xl tracking-tighter whitespace-nowrap">
                        {habit.displayMode === 'streak' ? (habit.streak || 0) : (habit.allCompletions?.length || 0)}
                    </span>
                    {habit.displayMode === 'streak' ? (
                        <Zap className="w-5 h-5 flex-shrink-0 fill-black" />
                    ) : (
                        <X className="w-4 h-4 flex-shrink-0" strokeWidth={6} />
                    )}
                </div>

                <div className="grid grid-cols-7 justify-items-center">
                    {days.map((day) => {
                        const isCompleted = habit.completedDays?.includes(day);
                        return (
                            <div key={day} className="flex flex-col items-center justify-center w-8 h-8">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleDay?.(day);
                                    }}
                                    className="relative flex items-center justify-center w-full h-full transition-all active:scale-75"
                                >
                                    <AnimatePresence>
                                        {isCompleted ? (
                                            <motion.div
                                                key="tick"
                                                initial={{ scale: 0, opacity: 0, y: 8 }}
                                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                                exit={{ scale: 0, opacity: 0, y: -8 }}
                                                transition={{ type: "spring", damping: 10, stiffness: 400 }}
                                                className="absolute"
                                            >
                                                <Check className="w-5 h-5 text-black" strokeWidth={6} />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="circle"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                transition={{ duration: 0.1 }}
                                                className="w-2.5 h-2.5 rounded-full border-[2.5px] border-black/50"
                                            />
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-black text-2xl font-bold leading-none truncate">{habit.activity}</h2>
                    <div className="flex-shrink-0">
                        {habit.reminders?.times && habit.reminders.times.length > 0 ? (
                            <Bell className="w-5 h-5 text-black" strokeWidth={4} />
                        ) : (
                            <BellOff className="w-5 h-5 text-black" strokeWidth={4} />
                        )}
                    </div>
                </div>
                {(habit.measurement?.value || habit.frequency) && (
                    <p className="text-black/60 text-lg font-medium leading-tight">
                        {getFrequencyText(habit)}
                    </p>
                )}
            </div>
        </motion.div>
    );
});

HabitCard.displayName = "HabitCard";

export default HabitCard;
