"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface Step2MeasurementProps {
    data: any;
    onChange: (data: any) => void;
    accentColor: string;
}

export default function Step2Measurement({
    data,
    onChange,
    accentColor,
}: Step2MeasurementProps) {
    const [value, setValue] = useState(data.measurement?.value || "");
    const [unit, setUnit] = useState(data.measurement?.unit || "");
    const [editingValue, setEditingValue] = useState(false);
    const [valueInput, setValueInput] = useState("");

    const decrementValue = () => {
        const numValue = parseInt(value) || 0;
        const newValue = Math.max(numValue - 1, 0).toString();
        setValue(newValue);
        onChange({ measurement: { value: newValue, unit } });
    };

    const handleValueInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val !== "" && (!/^\d*$/.test(val) || parseInt(val) > 999)) return;
        setValueInput(val);
    };

    const handleValueBlur = () => {
        const numValue = parseInt(valueInput) || 0;
        const newValue = Math.min(Math.max(numValue, 0), 999).toString();
        setValue(newValue);
        setEditingValue(false);
        onChange({ measurement: { value: newValue, unit } });
    };

    const incrementValue = () => {
        const numValue = parseInt(value) || 0;
        if (numValue >= 999) return;
        const newValue = (numValue + 1).toString();
        setValue(newValue);
        onChange({ measurement: { value: newValue, unit } });
    };

    const handleUnitChange = (newUnit: string) => {
        if (newUnit.length > 10) return;
        setUnit(newUnit);
        onChange({ measurement: { value, unit: newUnit } });
    };

    const startEditingValue = () => {
        setValueInput(value.toString());
        setEditingValue(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <h3 className="text-white text-xl font-semibold">Define a smallest unit</h3>

            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl w-fit" style={{ backgroundColor: accentColor }}>
                        <button
                            onClick={decrementValue}
                            className="w-11 h-11 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                        >
                            <Minus className="w-5 h-5 text-black" />
                        </button>
                        {editingValue ? (
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={valueInput}
                                onChange={handleValueInputChange}
                                onBlur={handleValueBlur}
                                placeholder="eg. 10"
                                className="text-black font-bold text-xl w-24 text-center bg-transparent outline-none placeholder:text-black/50"
                                autoFocus
                            />
                        ) : (
                            <button
                                onClick={startEditingValue}
                                className="text-black font-bold text-xl min-w-[80px] h-11 text-center hover:bg-black/10 px-2 rounded-xl transition-colors"
                            >
                                {value || <span className="text-black/50">eg. 10</span>}
                            </button>
                        )}
                        <button
                            onClick={incrementValue}
                            className="w-11 h-11 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                        >
                            <Plus className="w-5 h-5 text-black" />
                        </button>
                    </div>
                    <span className="text-white/40 text-xs px-2">Max 999</span>
                </div>

                <div className="relative flex items-center gap-3">
                    <input
                        type="text"
                        value={unit}
                        onChange={(e) => handleUnitChange(e.target.value)}
                        placeholder="eg. minutes, pages"
                        className="px-6 py-4 rounded-3xl text-black font-bold text-lg outline-none w-full placeholder:text-black/50"
                        style={{ backgroundColor: accentColor }}
                        maxLength={10}
                    />
                    <span className="text-white/40 text-xs font-mono tabular-nums whitespace-nowrap">
                        {unit.length}/10
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
