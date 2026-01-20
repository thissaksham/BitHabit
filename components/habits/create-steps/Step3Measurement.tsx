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
    const isManualScroll = useRef(false);

    useEffect(() => {
        if (ref.current && !isManualScroll.current) {
            const selectedIndex = items.indexOf(selected);
            const itemHeight = 48; // h-12
            const scrollTop = selectedIndex * itemHeight;
            ref.current.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }
    }, [selected, items]);

    return (
        <div
            ref={ref}
            className="h-[240px] overflow-y-auto snap-y snap-mandatory scrollbar-hide relative focus:outline-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                const itemHeight = 48;
                const index = Math.round(target.scrollTop / itemHeight);
                if (items[index] !== undefined && items[index] !== selected) {
                    isManualScroll.current = true;
                    onSelect(items[index]);
                    // Reset manual scroll flag after momentum settles
                    setTimeout(() => {
                        isManualScroll.current = false;
                    }, 100);
                }
            }}
        >
            <div className="py-[96px]"> {/* (240 - 48) / 2 = 96px */}
                {items.map((item: any) => (
                    <button
                        key={item}
                        onClick={() => {
                            isManualScroll.current = false;
                            onSelect(item);
                        }}
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
    const [selectedDays, setSelectedDays] = useState<number[]>(data.reminders?.days || [0, 1, 2, 3, 4, 5, 6]);


    // Support multiple times
    const initialTimes = data.reminders?.times || [data.reminders?.time].filter(Boolean) || ["09:00 AM"];
    const [selectedTimes, setSelectedTimes] = useState<string[]>(initialTimes);
    const [editingIndex, setEditingIndex] = useState<number | null>(null); // null means not showing picker, -1 means adding

    // Temporary states for the picker
    const [hour, setHour] = useState(9);
    const [minute, setMinute] = useState(0);
    const [period, setPeriod] = useState<"AM" | "PM">("AM");

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
        if (selectedTimes.length >= (data.frequency?.times || 1)) return;
        setHour(9);
        setMinute(0);
        setPeriod("AM");
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
        const newTime = `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
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
                <HelpCircle className="w-6 h-6 text-white/40" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {selectedTimes.map((time, index) => (
                    <div key={index} className="relative group">
                        <button
                            onClick={() => openPickerForEdit(index)}
                            className="px-6 py-3 rounded-xl bg-white/20 text-white font-medium min-w-[100px] hover:bg-white/30 transition-colors"
                        >
                            {time}
                        </button>
                        {selectedTimes.length > 1 && (
                            <button
                                onClick={() => removeTime(index)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                ))}

                {selectedTimes.length < (data.frequency?.times || 1) && (
                    <button
                        onClick={openPickerForAdd}
                        className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* iOS Wheel Time Picker Modal */}
            {editingIndex !== null && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/50"
                        onClick={() => setEditingIndex(null)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            )}



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
        </motion.div>
    );
}
