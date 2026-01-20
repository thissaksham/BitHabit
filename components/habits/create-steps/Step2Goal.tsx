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

    const handleValueChange = (newValue: string) => {
        setValue(newValue);
        onChange({ measurement: { value: newValue, unit } });
    };

    const handleUnitChange = (newUnit: string) => {
        setUnit(newUnit);
        onChange({ measurement: { value, unit: newUnit } });
    };

    const incrementValue = () => {
        const numValue = parseInt(value) || 0;
        const newValue = (numValue + 1).toString();
        setValue(newValue);
        onChange({ measurement: { value: newValue, unit } });
    };

    const decrementValue = () => {
        const numValue = parseInt(value) || 0;
        const newValue = Math.max(numValue - 1, 0).toString();
        setValue(newValue);
        onChange({ measurement: { value: newValue, unit } });
    };

    const handleValueInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValueInput(e.target.value);
    };

    const handleValueBlur = () => {
        const newValue = valueInput || "0";
        setValue(newValue);
        setEditingValue(false);
        onChange({ measurement: { value: newValue, unit } });
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

            <div className="space-y-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl w-fit" style={{ backgroundColor: accentColor }}>
                    <button
                        onClick={decrementValue}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                    >
                        <Minus className="w-4 h-4 text-black" />
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
                            className="text-black font-semibold w-20 text-center bg-transparent outline-none placeholder:text-black/50"
                            autoFocus
                        />
                    ) : (
                        <button
                            onClick={startEditingValue}
                            className="text-black font-semibold min-w-[60px] text-center hover:bg-black/10 px-2 py-1 rounded transition-colors"
                        >
                            {value || <span className="text-black/50">eg. 10</span>}
                        </button>
                    )}
                    <button
                        onClick={incrementValue}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                    >
                        <Plus className="w-4 h-4 text-black" />
                    </button>
                </div>

                <input
                    type="text"
                    value={unit}
                    onChange={(e) => handleUnitChange(e.target.value)}
                    placeholder="eg. minutes, pages"
                    className="px-6 py-3 rounded-2xl text-black font-medium outline-none w-full placeholder:text-black/50"
                    style={{ backgroundColor: accentColor }}
                />
            </div>
        </motion.div>
    );
}
