import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import ReminderManager from "@/components/managers/ReminderManager";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
    title: "BitHabit - Track Your Daily Goals",
    description: "Mobile-first habit tracker app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.variable}>
                <ErrorBoundary>
                    <div id="root-container">
                        <div className="abstract-background" />
                        <main className="relative z-10 pb-20">
                            {children}
                        </main>
                        <BottomNav />
                        <ReminderManager />
                    </div>
                </ErrorBoundary>
            </body>
        </html>
    );
}
