"use client";

import { Sparkles } from "lucide-react";

interface EmptyStateProps {
    onCreateClick: () => void;
}

export default function EmptyState({ onCreateClick }: EmptyStateProps) {
    return (
        <div className="flex items-center justify-center py-20">
            <button
                onClick={onCreateClick}
                className="bg-accent-cream/95 hover:bg-accent-cream text-black px-8 py-4 rounded-2xl border-2 border-white/20 shadow-lg hover:shadow-xl transition-all flex items-center gap-3 active:scale-95"
            >
                <Sparkles className="w-5 h-5" />
                <span className="font-medium text-lg">Create your first Habit</span>
                <Sparkles className="w-5 h-5" />
            </button>
        </div>
    );
}
