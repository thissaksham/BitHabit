"use client";

import { X, Check, RotateCcw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";

interface JournalEntryModalProps {
    onClose: () => void;
    onSave: (content: string) => void;
    onDelete?: () => void;
    initialContent?: string;
    date?: Date;
    placeholder?: string;
}

export default function JournalEntryModal({
    onClose,
    onSave,
    onDelete,
    initialContent = "",
    date = new Date(),
    placeholder = ""
}: JournalEntryModalProps) {
    const [content, setContent] = useState(initialContent);

    const handleClose = () => {
        if (content.trim()) {
            onSave(content);
        }
        onClose();
    };

    const handleReset = () => {
        setContent("");
    };

    const handleSave = () => {
        if (content.trim()) {
            onSave(content);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full max-w-mobile bg-[#1c1c1c] rounded-t-3xl overflow-hidden flex flex-col"
                style={{ height: "90vh" }}
            >
                {/* Header */}
                <div className="h-24 flex-shrink-0 flex items-center justify-between px-6 relative overflow-hidden bg-[#1c1c1c]">
                    <h2 className="text-white text-xl font-bold absolute left-1/2 -translate-x-1/2 pointer-events-none">
                        {format(date, "EEE, d MMM")}
                    </h2>

                    {/* Left Actions */}
                    <div className="flex items-center gap-2 z-10">
                        {onDelete && (
                            <button
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this note?")) {
                                        onDelete();
                                    }
                                }}
                                className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors border border-red-500/20"
                            >
                                <Trash2 className="w-5 h-5 text-red-400" />
                            </button>
                        )}
                        {content.trim() && (
                            <button
                                onClick={handleReset}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
                            >
                                <RotateCcw className="w-5 h-5 text-white" />
                            </button>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 z-10">
                        {content.trim() ? (
                            <button
                                onClick={handleSave}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
                            >
                                <Check className="w-5 h-5 text-white" />
                            </button>
                        ) : (
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <textarea
                        autoFocus
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={placeholder}
                        className="w-full flex-1 bg-transparent text-white text-lg resize-none outline-none placeholder:text-white/40 px-6 py-8 overflow-y-auto"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
