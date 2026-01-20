"use client";

import { useState, useEffect } from "react";
import { Plus, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JournalEntryModal from "@/components/journal/JournalEntryModal";

export default function JournalPage() {
    const [habits, setHabits] = useState<any[]>([]);
    const [selectedContext, setSelectedContext] = useState("Journal");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showEntryModal, setShowEntryModal] = useState(false);
    const [entries, setEntries] = useState<any[]>([]);
    const [editingEntry, setEditingEntry] = useState<any | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("habits");
        if (saved) {
            try {
                setHabits(JSON.parse(saved));
            } catch (e) {
                console.error(e);
            }
        }

        const savedEntries = localStorage.getItem("journalEntries");
        if (savedEntries) {
            try {
                setEntries(JSON.parse(savedEntries));
            } catch (e) {
                console.error(e);
            }
        }

        // Check for initial context from Habit Detail
        const initialContext = localStorage.getItem("journal_initial_context");
        if (initialContext) {
            setSelectedContext(initialContext);
            localStorage.removeItem("journal_initial_context");
        }
    }, []);

    const handleSaveEntry = (content: string) => {
        let updatedEntries;
        if (editingEntry) {
            updatedEntries = entries.map(e =>
                e.id === editingEntry.id ? { ...e, content } : e
            );
        } else {
            const newEntry = {
                id: Date.now().toString(),
                context: selectedContext,
                date: new Date().toISOString(),
                content
            };
            updatedEntries = [...entries, newEntry];
        }

        setEntries(updatedEntries);
        localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
        setEditingEntry(null);
        setShowEntryModal(false);
    };

    const handleDeleteEntry = () => {
        if (!editingEntry) return;

        const updatedEntries = entries.filter(e => e.id !== editingEntry.id);
        setEntries(updatedEntries);
        localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
        setEditingEntry(null);
        setShowEntryModal(false);
    };
    return (
        <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 5rem)' }}>
            {/* Header with Dropdown */}
            <div className="flex items-center justify-between px-6 pt-8 pb-2 relative z-50">
                <div className="relative">
                    {habits.length > 0 ? (
                        <>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 text-2xl font-bold text-white transition-opacity hover:opacity-80"
                            >
                                {selectedContext}
                                <ChevronDown className={`w-6 h-6 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
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
                                            className="absolute top-full left-0 mt-3 w-64 bg-[#1c1c1c] rounded-2xl border border-white/10 overflow-hidden z-20 shadow-2xl py-2"
                                        >
                                            <button
                                                onClick={() => {
                                                    setSelectedContext("Journal");
                                                    setShowDropdown(false);
                                                }}
                                                className={`w-full text-left px-5 py-3 text-lg transition-colors ${selectedContext === "Journal" ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                                                    }`}
                                            >
                                                Journal
                                            </button>

                                            {habits.length > 0 && <div className="h-px bg-white/10 my-2 mx-4" />}

                                            <div className="max-h-60 overflow-y-auto">
                                                {habits.map((habit) => (
                                                    <button
                                                        key={habit.id}
                                                        onClick={() => {
                                                            setSelectedContext(habit.activity);
                                                            setShowDropdown(false);
                                                        }}
                                                        className={`w-full text-left px-5 py-3 text-lg transition-colors flex items-center gap-3 ${selectedContext === habit.activity ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                                                            }`}
                                                    >
                                                        <span
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: habit.color }}
                                                        />
                                                        <span className="truncate">{habit.activity}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </>
                    ) : (
                        <h1 className="text-2xl font-bold text-white">Journal</h1>
                    )}
                </div>

                <button
                    onClick={() => setShowEntryModal(true)}
                    className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                    <Plus className="w-6 h-6 text-white" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
                {entries.filter((e: any) => e.context === selectedContext).length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <button
                            onClick={() => setShowEntryModal(true)}
                            className="bg-accent-cream/95 hover:bg-accent-cream text-black px-8 py-4 rounded-2xl border-2 border-white/20 shadow-lg hover:shadow-xl transition-all flex items-center gap-3 active:scale-95"
                        >
                            <Sparkles className="w-5 h-5" />
                            <span className="font-medium text-lg">Write your first entry</span>
                            <Sparkles className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 pb-24">
                        {entries
                            .filter((e: any) => e.context === selectedContext)
                            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((entry: any) => (
                                <div
                                    key={entry.id}
                                    onClick={() => {
                                        setEditingEntry(entry);
                                        setShowEntryModal(true);
                                    }}
                                    className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 cursor-pointer hover:bg-white/15 transition-colors active:scale-[0.98]"
                                >
                                    <div className="flex items-center justify-between mb-3 pointer-events-none">
                                        <span className="text-white/60 text-sm font-medium">
                                            {entry.context}
                                        </span>
                                        <span className="text-white/40 text-xs">
                                            {new Date(entry.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-white/80 text-base whitespace-pre-wrap line-clamp-2 pointer-events-none">
                                        {entry.content}
                                    </p>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* Journal Entry Modal */}
            <AnimatePresence>
                {showEntryModal && (
                    <JournalEntryModal
                        onClose={() => {
                            setShowEntryModal(false);
                            setEditingEntry(null);
                        }}
                        onSave={handleSaveEntry}
                        onDelete={editingEntry ? handleDeleteEntry : undefined}
                        initialContent={editingEntry?.content || ""}
                        date={editingEntry ? new Date(editingEntry.date) : new Date()}
                        placeholder={selectedContext === "Journal" ? "How did you feel today? What were your thoughts? What did you achieve?" : ""}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
