"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, ChevronDown, Pause, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { recordFocusSession, getFocusStats, formatDuration } from "@/lib/habitUtils";

export default function FocusPage() {
    const [mode, setMode] = useState<"focus" | "break">("focus");
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [initialTime, setInitialTime] = useState(25);
    const [timeframe, setTimeframe] = useState("Today");
    const [showDropdown, setShowDropdown] = useState(false);
    const [stats, setStats] = useState({ cycles: 0, durationSeconds: 0 });

    const timeframes = ["Today", "This Week", "This Month", "All Time"];

    const focusPresets = [15, 20, 25, 30, 40, 45, 50, 60, 90];
    const breakPresets = [3, 5, 8, 10, 15, 20, 30];
    const timeOptions = mode === "focus" ? focusPresets : breakPresets;

    const refreshStats = useCallback(() => {
        const newStats = getFocusStats(timeframe, mode);
        setStats(newStats);
    }, [timeframe, mode]);

    useEffect(() => {
        refreshStats();
    }, [refreshStats]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setMinutes(initialTime);
        setSeconds(0);
    };

    const handleTimerComplete = useCallback(() => {
        setIsActive(false);
        const durationSeconds = initialTime * 60;
        const success = recordFocusSession(mode, durationSeconds);

        if (success) {
            refreshStats();
            // Play notification sound if desired
            try {
                const audio = new Audio('/sounds/complete.mp3'); // Placeholder path
                audio.play().catch(() => { });
            } catch (e) { }
        }
    }, [initialTime, mode, refreshStats]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        handleTimerComplete();
                        clearInterval(interval);
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, minutes, seconds, handleTimerComplete]);

    return (
        <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 5rem)' }}>
            {/* Custom Header with Toggle (Matches PageHeader styling) */}
            <div className="flex items-center justify-between px-6 pt-8 pb-2">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setMode("focus");
                            setMinutes(15);
                            setSeconds(0);
                            setInitialTime(15);
                            setIsActive(false);
                        }}
                        className={`text-2xl font-bold transition-colors ${mode === "focus" ? "text-white" : "text-white/30"
                            }`}
                    >
                        Focus
                    </button>
                    <button
                        onClick={() => {
                            setMode("break");
                            setMinutes(3);
                            setSeconds(0);
                            setInitialTime(3);
                            setIsActive(false);
                        }}
                        className={`text-2xl font-bold transition-colors ${mode === "break" ? "text-white" : "text-white/30"
                            }`}
                    >
                        Break
                    </button>
                </div>


            </div>

            <div className="flex-1 flex flex-col justify-center px-6 space-y-8">

                {/* Stats */}
                <div className="flex items-center justify-center gap-8">
                    {/* Timeframe Dropdown (Left) */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
                        >
                            {timeframe}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {showDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowDropdown(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 mt-2 w-32 bg-[#1c1c1c] rounded-xl border border-white/10 overflow-hidden z-20 shadow-xl"
                                    >
                                        {timeframes.map((tf) => (
                                            <button
                                                key={tf}
                                                onClick={() => {
                                                    setTimeframe(tf);
                                                    setShowDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${timeframe === tf ? "text-white" : "text-white/60"
                                                    }`}
                                            >
                                                {tf}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Cycles (Middle) */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-1 h-10">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="text-white text-3xl font-bold">{stats.cycles}</span>
                        </div>
                        <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">Cycles</span>
                    </div>

                    {/* Time (Right) */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center h-10 mb-1">
                            <span className="text-white text-3xl font-bold">{formatDuration(stats.durationSeconds)}</span>
                        </div>
                        <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">{mode === "focus" ? "Focus Time" : "Break Time"}</span>
                    </div>
                </div>

                {/* Timer Display */}
                <div className="text-center">
                    <div className="text-white text-7xl font-bold mb-6">
                        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                    </div>

                    {/* Time Options */}
                    <div className="flex flex-wrap justify-center gap-3 px-4 max-w-lg mx-auto">
                        {timeOptions.map((time) => (
                            <button
                                key={time}
                                onClick={() => {
                                    setMinutes(time);
                                    setSeconds(0);
                                    setInitialTime(time);
                                    setIsActive(false);
                                }}
                                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold transition-all ${minutes === time
                                    ? "bg-white text-black"
                                    : "text-white/40 hover:text-white/60"
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>



                {/* Controls */}
                <div className="flex justify-center items-center gap-4 pt-8">
                    {/* Reset Button (Conditional) */}
                    {(isActive || minutes !== initialTime || seconds !== 0) && (
                        <button
                            onClick={resetTimer}
                            className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white"
                        >
                            <RotateCcw className="w-6 h-6" />
                        </button>
                    )}

                    {/* Start/Pause Button */}
                    <button
                        onClick={toggleTimer}
                        className="px-16 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-white/90 transition-all active:scale-95 flex items-center gap-3"
                    >
                        {isActive ? (
                            <>
                                <Pause className="w-5 h-5" fill="currentColor" />
                                PAUSE
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5" fill="currentColor" />
                                START
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
