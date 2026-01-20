"use client";

import { Home, Focus, BookOpen, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { name: "Habits", icon: Home, href: "/" },
    { name: "Focus", icon: Focus, href: "/focus" },
    { name: "Journal", icon: BookOpen, href: "/journal" },
    { name: "Other", icon: Settings, href: "/other" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-black/80 backdrop-blur-lg border-t border-white/10 z-50">
            <div className="flex items-center justify-around h-20 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex flex-col items-center justify-center gap-1 flex-1 min-h-[44px]"
                        >
                            <Icon
                                className={`w-6 h-6 transition-colors ${isActive ? "text-primary" : "text-white/60"
                                    }`}
                            />
                            <span
                                className={`text-xs transition-colors ${isActive ? "text-primary" : "text-white/60"
                                    }`}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
