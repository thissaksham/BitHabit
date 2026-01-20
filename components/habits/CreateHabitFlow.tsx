"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Step1Activity from "./create-steps/Step1Activity";
import Step2Measurement from "./create-steps/Step2Measurement";
import Step3Reminder from "./create-steps/Step3Reminder";

interface CreateHabitFlowProps {
    onClose: () => void;
    onComplete: (habit: any) => void;
    initialData?: any;
    initialStep?: number;
}

export default function CreateHabitFlow({
    onClose,
    onComplete,
    initialData,
    initialStep = 1,
}: CreateHabitFlowProps) {
    const accentColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD", "#D4A5A5", "#9B59B6", "#3498DB", "#E67E22", "#2ECC71", "#F1C40F", "#95A5A6"];

    // Pick random color for new habits
    const randomColor = accentColors[Math.floor(Math.random() * accentColors.length)];

    const [currentStep, setCurrentStep] = useState(initialStep);
    const [habitData, setHabitData] = useState<any>(initialData || {
        activity: "",
        frequency: { times: 1, days: 7 },
        measurement: { value: "", unit: "" },
        reminders: [],
        color: randomColor,
    });

    const currentColor = habitData.color;

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // Ensure color is stored if it's currently just a default accent
            const finalData = { ...habitData, color: habitData.color || currentColor };
            onComplete(finalData);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full max-w-mobile bg-card-dark rounded-t-3xl overflow-hidden"
                style={{ maxHeight: "85vh" }}
            >
                {/* Header with accent color */}
                <div
                    className="h-24 rounded-t-3xl flex items-center justify-between px-6 relative overflow-hidden"
                    style={{ backgroundColor: currentColor }}
                >
                    <h2 className="text-black text-xl font-bold absolute left-1/2 -translate-x-1/2">
                        Create
                    </h2>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors ml-auto"
                    >
                        <X className="w-6 h-6 text-black" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto scrollbar-hide h-[400px]" style={{ maxHeight: "calc(85vh - 180px)" }}>
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <Step1Activity
                                key="step1"
                                data={habitData}
                                onChange={(data) => setHabitData({ ...habitData, ...data })}
                                accentColor={currentColor}
                            />
                        )}
                        {currentStep === 2 && (
                            <Step2Measurement
                                key="step2"
                                data={habitData}
                                onChange={(data: any) => setHabitData({ ...habitData, ...data })}
                                accentColor={currentColor}
                            />
                        )}
                        {currentStep === 3 && (
                            <Step3Reminder
                                key="step3"
                                data={habitData}
                                onChange={(data: any) => setHabitData({ ...habitData, ...data })}
                                accentColor={currentColor}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-6 py-6 pb-24 border-t border-white/10">
                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`w-2 h-2 rounded-full transition-colors ${step === currentStep
                                    ? "bg-white"
                                    : step < currentStep
                                        ? "bg-white/50"
                                        : "bg-white/20"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Next button */}
                    {/* Next button */}
                    <button
                        onClick={handleNext}
                        disabled={
                            (currentStep === 1 && !habitData.activity) ||
                            (currentStep === 3 && (
                                (habitData.reminders?.days?.length > 0 && (!habitData.reminders?.times || habitData.reminders.times.length === 0)) ||
                                ((!habitData.reminders?.days || habitData.reminders.days.length === 0) && habitData.reminders?.times?.length > 0)
                            ))
                        }
                        className="w-full bg-white text-black py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                        {currentStep === 3 ? (
                            (!habitData.reminders?.days || habitData.reminders.days.length === 0) && (!habitData.reminders?.times || habitData.reminders.times.length === 0)
                                ? "SKIP & CREATE"
                                : (initialData ? "SAVE" : "CREATE")
                        ) : currentStep === 2 && !habitData.measurement?.value && !habitData.measurement?.unit ? "SKIP" : "NEXT"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
