"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info" | "warning";
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function Toast({
    message,
    type = "success",
    isVisible,
    onClose,
    duration = 2000,
    action
}: ToastProps) {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const icons = {
        success: <CheckCircle2 className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />
    };

    const colors = {
        success: "bg-green-500/90",
        error: "bg-red-500/90",
        info: "bg-blue-500/90",
        warning: "bg-orange-500/90"
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                    }}
                    className={`absolute bottom-24 left-4 right-4 z-[200] ${colors[type]} backdrop-blur-lg rounded-2xl px-6 py-4 shadow-2xl border border-white/20 text-center`}
                >
                    <div className="flex items-center gap-4 text-white">
                        <div className="flex items-center gap-3">
                            {icons[type]}
                            <span className="font-medium text-sm">{message}</span>
                        </div>
                        {action && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick();
                                }}
                                className="bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border border-white/20"
                            >
                                {action.label}
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
