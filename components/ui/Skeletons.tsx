"use client";

export function HabitSkeleton() {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                    <div className="h-6 w-32 bg-white/20 rounded-lg" />
                    <div className="h-4 w-24 bg-white/10 rounded-lg" />
                </div>
                <div className="h-5 w-5 bg-white/20 rounded" />
            </div>

            {/* Stats skeleton */}
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-white/20 rounded-full" />
                <div className="h-4 w-20 bg-white/10 rounded-lg" />
            </div>
        </div>
    );
}

export function HabitListSkeleton() {
    return (
        <div className="space-y-4">
            <HabitSkeleton />
            <HabitSkeleton />
            <HabitSkeleton />
        </div>
    );
}

export function FocusStatsSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-4 mb-8 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-4 flex flex-col items-center gap-2">
                    <div className="h-8 w-8 bg-white/20 rounded-full" />
                    <div className="h-8 w-12 bg-white/20 rounded-lg" />
                </div>
            ))}
        </div>
    );
}

export function JournalEntrySkeleton() {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 animate-pulse">
            <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-24 bg-white/20 rounded-lg" />
                <div className="h-3 w-16 bg-white/10 rounded-lg" />
            </div>
            <div className="space-y-2">
                <div className="h-3 w-full bg-white/10 rounded-lg" />
                <div className="h-3 w-3/4 bg-white/10 rounded-lg" />
            </div>
        </div>
    );
}

export function JournalListSkeleton() {
    return (
        <div className="space-y-4">
            <JournalEntrySkeleton />
            <JournalEntrySkeleton />
            <JournalEntrySkeleton />
        </div>
    );
}
