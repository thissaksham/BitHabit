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
}

export default function Toast({
    message,
    type = "success",
    isVisible,
    onClose,
    duration = 2000
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
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                    }}
                    className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] ${colors[type]} backdrop-blur-lg rounded-2xl px-6 py-4 shadow-2xl border border-white/20`}
                >
                    <div className="flex items-center gap-3 text-white">
                        {icons[type]}
                        <span className="font-medium text-sm">{message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
