"use client";

import { format, subDays, eachDayOfInterval, isToday } from "date-fns";

export default function WeekCalendar() {
    const today = new Date();
    const last7Days = eachDayOfInterval({
        start: subDays(today, 6),
        end: today,
    });

    const currentMonth = format(today, "MMMM");

    return (
        <div className="py-6 px-6">
            <div className="grid grid-cols-[100px_1fr] items-center">
                <div className="text-white/60 text-sm font-bold">{currentMonth}</div>
                <div className="grid grid-cols-7 justify-items-center">
                    {last7Days.map((date, index) => {
                        const isDayToday = isToday(date);

                        return (
                            <div key={index} className="flex flex-col items-center gap-1">
                                <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider">
                                    {format(date, "eeeeee")}
                                </div>
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${isDayToday
                                        ? "bg-white text-black font-bold"
                                        : "text-white/60 font-medium"
                                        }`}
                                >
                                    {format(date, "d")}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
