"use client";

import { motion } from "framer-motion";
import { ChevronDown, Plus, HelpCircle } from "lucide-react";
import { useState } from "react";

interface Step4ReminderProps {
    data: any;
    onChange: (data: any) => void;
    accentColor: string;
}

export default function Step4Reminder({
    data,
    onChange,
    accentColor,
}: Step4ReminderProps) {
    const [selectedDays, setSelectedDays] = useState<string[]>(["Sunday", "Monday"]);
    const [sameTime, setSameTime] = useState(true);

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const displayDays = days.slice(0, 3);

    const toggleDay = (day: string) => {
        const newDays = selectedDays.includes(day)
            ? selectedDays.filter((d) => d !== day)
            : [...selectedDays, day];
        setSelectedDays(newDays);
        onChange({ reminders: { days: newDays } });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-white text-xl font-semibold">Remind me at</h3>
                <HelpCircle className="w-6 h-6 text-white/40" />
            </div>

            <div className="flex items-center gap-3">
                <button className="px-6 py-3 rounded-xl bg-white/20 text-white font-medium flex items-center gap-2">
                    Time
                    <ChevronDown className="w-4 h-4" />
                </button>
                <button className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={sameTime}
                    onChange={(e) => setSameTime(e.target.checked)}
                    className="w-6 h-6 rounded border-2 border-white/40 checked:bg-white"
                />
                <span className="text-white">Same times for all days</span>
            </label>

            <div>
                <div className="text-white text-lg mb-3">On</div>
                <div className="space-y-3">
                    {displayDays.map((day) => (
                        <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`w-full px-6 py-4 rounded-2xl font-medium transition-all ${selectedDays.includes(day)
                                    ? "text-black"
                                    : "bg-white/10 text-white border-2 border-white/20"
                                }`}
                            style={{
                                backgroundColor: selectedDays.includes(day)
                                    ? accentColor
                                    : undefined,
                                borderColor: selectedDays.includes(day)
                                    ? accentColor
                                    : undefined,
                            }}
                        >
                            {day}
                        </button>
                    ))}

                    <button className="w-full px-6 py-4 rounded-2xl font-medium bg-white/10 text-white border-2 border-white/20 flex items-center justify-between">
                        <span className="opacity-0">Placeholder</span>
                        <span>Everyday</span>
                        <div className="w-6 h-6 rounded border-2 border-white/40" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
