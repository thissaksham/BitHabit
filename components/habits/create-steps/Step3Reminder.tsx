"use client";

import { motion } from "framer-motion";
import { Plus, HelpCircle, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Step3ReminderProps {
    data: any;
    onChange: (data: any) => void;
    accentColor: string;
}

const WheelColumn = ({ items, selected, onSelect, formatItem, accentColor }: any) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const selectedIndex = items.indexOf(selected);
            const itemHeight = 48; // h-12
            const scrollTop = selectedIndex * itemHeight;
            // Use 'auto' (instant) instead of 'smooth' to prevent intermediate scroll events 
            // from being captured as user input during initialization.
            ref.current.scrollTo({ top: scrollTop, behavior: 'auto' });
        }
    }, [selected, items]);

    const handleScroll = (e: any) => {
        const target = e.target;
        const itemHeight = 48;
        const index = Math.round(target.scrollTop / itemHeight);
        if (items[index] !== undefined && items[index] !== selected) {
            onSelect(items[index]);
        }
    };

    return (
        <div
            ref={ref}
            className="h-[240px] overflow-y-auto snap-y snap-mandatory scrollbar-hide relative focus:outline-none"
            style={{ shadowWidth: 'none', msOverflowStyle: 'none' } as any}
            onScroll={handleScroll}
        >
            <div className="py-[96px]"> {/* (240 - 48) / 2 = 96px */}
                {items.map((item: any) => (
                    <button
                        key={item}
                        onClick={() => onSelect(item)}
                        className={`w-full h-12 flex items-center justify-center transition-all snap-center outline-none ${item === selected
                            ? 'text-white text-2xl font-bold'
                            : 'text-white/30 text-xl'
                            }`}
                    >
                        {formatItem ? formatItem(item) : item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function Step3Reminder({
    data,
    onChange,
    accentColor,
}: Step3ReminderProps) {
    // Initialize with defaults if not present
    const defaultDays: number[] = [];
    const defaultTimes = ["09:00 AM"];

    const [selectedDays, setSelectedDays] = useState<number[]>(
        data.reminders?.days && data.reminders.days.length > 0 ? data.reminders.days : defaultDays
    );

    const [selectedTimes, setSelectedTimes] = useState<string[]>(
        data.reminders?.times && data.reminders.times.length > 0
            ? data.reminders.times
            : []
    );

    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [hour, setHour] = useState(9);
    const [minute, setMinute] = useState(0);
    const [period, setPeriod] = useState<"AM" | "PM">("AM");

    // Sync initial state to parent on mount so CREATE button is enabled
    useEffect(() => {
        if (!data.reminders?.days || data.reminders.days.length === 0 || !data.reminders?.times) {
            onChange({ reminders: { ...data.reminders, days: selectedDays, times: selectedTimes } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const toggleDay = (dayIndex: number) => {
        const newDays = selectedDays.includes(dayIndex)
            ? selectedDays.filter((d) => d !== dayIndex)
            : [...selectedDays, dayIndex];
        setSelectedDays(newDays);
        onChange({ reminders: { ...data.reminders, days: newDays, times: selectedTimes } });
    };

    const openPickerForAdd = () => {
        if (selectedTimes.length >= 3) return;

        // Calculate current time immediately
        const now = new Date();
        let currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentPeriod = currentHour >= 12 ? "PM" : "AM";
        if (currentHour > 12) currentHour -= 12;
        if (currentHour === 0) currentHour = 12;

        setHour(currentHour);
        setMinute(currentMinute);
        setPeriod(currentPeriod);
        setEditingIndex(-1);
    };

    const openPickerForEdit = (index: number) => {
        const timeStr = selectedTimes[index];
        const [timePart, periodPart] = timeStr.split(' ');
        const [h, m] = timePart.split(':');

        setHour(parseInt(h));
        setMinute(parseInt(m));
        setPeriod(periodPart as "AM" | "PM");
        setEditingIndex(index);
    };

    const handleTimeConfirm = () => {
        const newTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
        let newTimes = [...selectedTimes];

        if (editingIndex === -1) {
            newTimes.push(newTime);
        } else if (editingIndex !== null) {
            newTimes[editingIndex] = newTime;
        }

        setSelectedTimes(newTimes);
        setEditingIndex(null);
        onChange({ reminders: { days: selectedDays, times: newTimes } });
    };

    const removeTime = (index: number) => {
        const newTimes = selectedTimes.filter((_, i) => i !== index);
        setSelectedTimes(newTimes);
        onChange({ reminders: { days: selectedDays, times: newTimes } });
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
            </div>

            <div className="flex flex-wrap items-center gap-4">
                {selectedTimes.map((time, index) => (
                    <div key={index} className="relative w-fit">
                        <button
                            onClick={() => openPickerForEdit(index)}
                            className="px-6 py-3 rounded-xl text-black font-bold min-w-[100px] hover:opacity-90 transition-all active:scale-95"
                            style={{ backgroundColor: accentColor }}
                        >
                            {time}
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeTime(index);
                            }}
                            className="absolute flex items-center justify-center bg-black rounded-full text-white border border-white/20 hover:bg-red-500 transition-colors z-20"
                            style={{
                                width: "25px",
                                height: "25px",
                                top: "-12.5px",
                                right: "-12.5px",
                                padding: 0,
                                minWidth: "25px",
                                minHeight: "25px",
                            }}
                        >
                            <X style={{ width: "14px", height: "14px" }} strokeWidth={3} />
                        </button>
                    </div>
                ))}

                {selectedTimes.length < 3 && (
                    <button
                        onClick={openPickerForAdd}
                        className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* iOS Wheel Time Picker Modal */}
            {
                editingIndex !== null && (
                    <>
                        <div
                            className="fixed inset-0 z-[110] bg-black/50"
                            onClick={() => setEditingIndex(null)}
                        />
                        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                            <div className="bg-card-dark p-6 rounded-2xl border border-white/10 shadow-2xl w-full max-w-sm">
                                <h4 className="text-white text-lg font-semibold mb-4 text-center">
                                    {editingIndex === -1 ? 'Add time' : 'Edit time'}
                                </h4>

                                <div className="relative overflow-hidden rounded-xl bg-transparent">
                                    {/* Selection Box Overlay */}
                                    <div
                                        className="absolute top-1/2 left-0 right-0 h-14 -translate-y-1/2 rounded-xl z-0 pointer-events-none opacity-20"
                                        style={{ backgroundColor: accentColor }}
                                    />

                                    {/* Gradient Fades */}
                                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-card-dark via-card-dark/80 to-transparent z-30 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card-dark via-card-dark/80 to-transparent z-30 pointer-events-none" />

                                    <div className="flex items-center justify-center gap-2 relative z-10 px-4">
                                        {/* Hour Wheel */}
                                        <div className="flex-1">
                                            <WheelColumn
                                                items={hours}
                                                selected={hour}
                                                onSelect={setHour}
                                                formatItem={(h: number) => h.toString().padStart(2, '0')}
                                                accentColor={accentColor}
                                            />
                                        </div>

                                        <div className="text-white text-2xl font-bold px-2 self-center relative z-20">:</div>

                                        {/* Minute Wheel */}
                                        <div className="flex-1">
                                            <WheelColumn
                                                items={minutes}
                                                selected={minute}
                                                onSelect={setMinute}
                                                formatItem={(m: number) => m.toString().padStart(2, '0')}
                                                accentColor={accentColor}
                                            />
                                        </div>

                                        {/* AM/PM Wheel */}
                                        <div className="w-20">
                                            <WheelColumn
                                                items={["AM", "PM"]}
                                                selected={period}
                                                onSelect={setPeriod}
                                                accentColor={accentColor}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleTimeConfirm}
                                    className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors mt-6"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </>
                )
            }

            <div>
                <div className="text-white text-lg mb-3">On</div>
                <div className="flex justify-between gap-2">
                    {dayLabels.map((label, index) => (
                        <button
                            key={index}
                            onClick={() => toggleDay(index)}
                            className={`w-10 h-10 rounded-full font-medium transition-all flex items-center justify-center ${selectedDays.includes(index)
                                ? "text-black"
                                : "bg-white/10 text-white border-2 border-white/20"
                                }`}
                            style={{
                                backgroundColor: selectedDays.includes(index)
                                    ? accentColor
                                    : undefined,
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </motion.div >
    );
}
