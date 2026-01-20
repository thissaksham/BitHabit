"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Trash2, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface NotificationOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationOverlay({ isOpen, onClose }: NotificationOverlayProps) {
    const [notifications, setNotifications] = useState<any[]>([]);

    const loadNotifications = () => {
        const saved = localStorage.getItem("inAppNotifications");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setNotifications(parsed);
            } catch (e) {
                console.error(e);
                setNotifications([]);
            }
        } else {
            setNotifications([]);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadNotifications();
            // Mark all as read when opening
            const saved = localStorage.getItem("inAppNotifications");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.length > 0) {
                        const updated = parsed.map((n: any) => ({ ...n, read: true }));
                        localStorage.setItem("inAppNotifications", JSON.stringify(updated));
                        window.dispatchEvent(new Event('storage'));
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }, [isOpen]);

    const handleClearAll = () => {
        // Save dismissed notification IDs so catch-up doesn't re-add them
        const dismissed = localStorage.getItem("dismissedNotifications");
        let dismissedList = [];
        if (dismissed) {
            try {
                dismissedList = JSON.parse(dismissed);
            } catch (e) {
                console.error(e);
            }
        }

        // Add all current notifications to dismissed list
        const dismissedIds = notifications.map(n => `${n.habitId}-${n.time}-${n.date}`);
        const updatedDismissed = [...new Set([...dismissedList, ...dismissedIds])];
        localStorage.setItem("dismissedNotifications", JSON.stringify(updatedDismissed));

        localStorage.setItem("inAppNotifications", JSON.stringify([]));
        localStorage.setItem("lastReminderCheck", new Date().toISOString());
        setNotifications([]);
        window.dispatchEvent(new Event('storage'));
    };

    const handleClose = () => {
        onClose();
    };

    const missed = notifications.filter(n => n.isMissed);
    const today = notifications.filter(n => !n.isMissed);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-end justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-mobile bg-[#1c1c1c] rounded-t-[2.5rem] flex flex-col overflow-hidden shadow-2xl"
                    style={{ height: "80vh" }}
                >
                    {/* Header */}
                    <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-white text-xl font-bold">Notifications</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            {notifications.length > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClearAll();
                                    }}
                                    className="p-2 text-white/40 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClose();
                                }}
                                className="p-2 bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center">
                                    <Bell className="w-8 h-8 text-white/20" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">All caught up!</p>
                                    <p className="text-white/40 text-sm">No new reminders today.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {missed.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="px-4 text-orange-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Missed Reminders
                                        </h3>
                                        {missed.map((n) => (
                                            <NotificationItem key={n.id} notification={n} />
                                        ))}
                                    </div>
                                )}

                                {today.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="px-4 text-white/40 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Today
                                        </h3>
                                        {today.map((n) => (
                                            <NotificationItem key={n.id} notification={n} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function NotificationItem({ notification }: { notification: any }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-[2rem] flex items-start gap-4 transition-all ${notification.isMissed ? 'bg-orange-400/10 border border-orange-400/20' : 'bg-white/5 border border-white/5'
                }`}
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${notification.isMissed ? 'bg-orange-400/20' : 'bg-white/10'
                }`}>
                <Bell className={`w-6 h-6 ${notification.isMissed ? 'text-orange-400' : 'text-white'}`} />
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <p className="text-white font-bold leading-tight">Time for {notification.activity}!</p>
                    <span className="text-white/20 text-xs font-mono">{notification.time}</span>
                </div>
                <p className={`text-sm leading-snug ${notification.isMissed ? 'text-orange-400/60' : 'text-white/40'}`}>
                    {notification.isMissed
                        ? `You missed your ${notification.time} reminder. Let's get back on track!`
                        : `This is your scheduled reminder for ${notification.activity}.`
                    }
                </p>
            </div>
        </motion.div>
    );
}
