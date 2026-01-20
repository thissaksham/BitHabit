"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface Step1ActivityProps {
    data: any;
    onChange: (data: any) => void;
    accentColor: string;
}

const activities = ["Read", "Meditate", "Exercise", "Write", "Code", "Learn"];

const colorOptions = [
    "#b8a3d8", // purple
    "#f5e6b8", // yellow
    "#f5d4b8", // peach
    "#b8e6d8", // mint
    "#f5b8c8", // pink
    "#b8d8f5", // blue
    "#d8f5b8", // lime
    "#f5c8b8", // coral
    "#d8b8f5", // lavender
    "#b8f5d8", // seafoam
    "#f5d8a8", // orange
    "#c8b8f5", // violet
];

export default function Step1Activity({
    data,
    onChange,
    accentColor,
}: Step1ActivityProps) {
    const [selectedActivity, setSelectedActivity] = useState(data.activity || "");
    const [times, setTimes] = useState(data.frequency?.times || 1);
    const [days, setDays] = useState(data.frequency?.days || 7);
    const [editingTimes, setEditingTimes] = useState(false);
    const [editingDays, setEditingDays] = useState(false);
    const [timesInput, setTimesInput] = useState("");
    const [daysInput, setDaysInput] = useState("");
    const [selectedColor, setSelectedColor] = useState(data.color || accentColor);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const handleActivityChange = (activity: string) => {
        setSelectedActivity(activity);
        onChange({ activity, frequency: { times, days }, color: selectedColor });
    };

    const handleCustomActivityChange = (value: string) => {
        if (value.length > 15) return;
        setSelectedActivity(value);
        onChange({ activity: value, frequency: { times, days }, color: selectedColor });
    };

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        setShowColorPicker(false);
        onChange({ activity: selectedActivity, frequency: { times, days }, color });
    };

    const incrementTimes = () => {
        const newTimes = times + 1;
        setTimes(newTimes);
        onChange({ activity: selectedActivity, frequency: { times: newTimes, days }, color: selectedColor });
    };

    const decrementTimes = () => {
        const newTimes = Math.max(times - 1, 1);
        setTimes(newTimes);
        onChange({ activity: selectedActivity, frequency: { times: newTimes, days }, color: selectedColor });
    };

    const incrementDays = () => {
        const newDays = days + 1;
        setDays(newDays);
        onChange({ activity: selectedActivity, frequency: { times, days: newDays }, color: selectedColor });
    };

    const decrementDays = () => {
        const newDays = Math.max(days - 1, 1);
        setDays(newDays);
        onChange({ activity: selectedActivity, frequency: { times, days: newDays }, color: selectedColor });
    };

    const handleTimesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimesInput(e.target.value);
    };

    const handleDaysInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDaysInput(e.target.value);
    };

    const handleTimesBlur = () => {
        const value = parseInt(timesInput) || 1;
        const newTimes = Math.max(value, 1);
        setTimes(newTimes);
        setEditingTimes(false);
        onChange({ activity: selectedActivity, frequency: { times: newTimes, days }, color: selectedColor });
    };

    const handleDaysBlur = () => {
        const value = parseInt(daysInput) || 1;
        const newDays = Math.max(value, 1);
        setDays(newDays);
        setEditingDays(false);
        onChange({ activity: selectedActivity, frequency: { times, days: newDays }, color: selectedColor });
    };

    const startEditingTimes = () => {
        setTimesInput(times.toString());
        setEditingTimes(true);
    };

    const startEditingDays = () => {
        setDaysInput(days.toString());
        setEditingDays(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-white text-xl font-semibold">I want to</h3>
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={selectedActivity}
                        onChange={(e) => handleCustomActivityChange(e.target.value)}
                        placeholder="Type activity"
                        className="px-5 py-2 rounded-full text-black font-bold text-lg outline-none w-44 placeholder:text-black/50 transition-all"
                        style={{ backgroundColor: selectedColor }}
                        maxLength={15}
                    />
                    <span className="text-white/40 text-xs font-mono tabular-nums">
                        {selectedActivity.length}/15
                    </span>
                </div>
                <div className="relative ml-auto">
                    <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="w-8 h-8 rounded-full border-2 border-white/20 hover:border-white/40 transition-colors"
                        style={{ backgroundColor: selectedColor }}
                    />
                    {showColorPicker && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowColorPicker(false)}
                            />
                            <div className="absolute right-0 mt-2 p-3 bg-card-dark rounded-xl shadow-xl border border-white/10 z-50">
                                <div className="flex flex-wrap gap-2 w-[200px]">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => handleColorChange(color)}
                                            className="w-6 h-6 rounded-full border-2 transition-all hover:scale-110 flex-shrink-0"
                                            style={{
                                                backgroundColor: color,
                                                borderColor: selectedColor === color ? 'white' : 'rgba(255,255,255,0.2)'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Activity selection */}
            <div>
                <div className="text-white/60 text-sm mb-3">or select from below</div>
                <div className="flex flex-wrap gap-3">
                    {activities.map((activity) => (
                        <button
                            key={activity}
                            onClick={() => handleActivityChange(activity)}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${selectedActivity === activity
                                ? "text-black"
                                : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                            style={{
                                backgroundColor:
                                    selectedActivity === activity ? selectedColor : undefined,
                            }}
                        >
                            {activity}
                        </button>
                    ))}
                </div>
            </div>

            {/* Frequency with stepper */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ backgroundColor: selectedColor }}>
                        <button
                            onClick={decrementTimes}
                            className="w-11 h-11 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                        >
                            <Minus className="w-5 h-5 text-black" />
                        </button>
                        {editingTimes ? (
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={timesInput}
                                onChange={handleTimesInputChange}
                                onBlur={handleTimesBlur}
                                className="text-black font-bold text-xl w-16 text-center bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                autoFocus
                            />
                        ) : (
                            <button
                                onClick={startEditingTimes}
                                className="text-black font-bold text-xl min-w-[44px] h-11 text-center hover:bg-black/10 px-2 rounded-xl transition-colors"
                            >
                                {times}
                            </button>
                        )}
                        <button
                            onClick={incrementTimes}
                            className="w-11 h-11 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                        >
                            <Plus className="w-5 h-5 text-black" />
                        </button>
                    </div>
                    <span className="text-white text-lg">times in</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ backgroundColor: selectedColor }}>
                        <button
                            onClick={decrementDays}
                            className="w-11 h-11 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                        >
                            <Minus className="w-5 h-5 text-black" />
                        </button>
                        {editingDays ? (
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={daysInput}
                                onChange={handleDaysInputChange}
                                onBlur={handleDaysBlur}
                                className="text-black font-bold text-xl w-16 text-center bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                autoFocus
                            />
                        ) : (
                            <button
                                onClick={startEditingDays}
                                className="text-black font-bold text-xl min-w-[44px] h-11 text-center hover:bg-black/10 px-2 rounded-xl transition-colors"
                            >
                                {days}
                            </button>
                        )}
                        <button
                            onClick={incrementDays}
                            className="w-11 h-11 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                        >
                            <Plus className="w-5 h-5 text-black" />
                        </button>
                    </div>
                    <span className="text-white text-lg">days.</span>
                </div>
            </div>
        </motion.div>
    );
}
