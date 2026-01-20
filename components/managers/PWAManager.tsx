"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/ui/Toast";

export default function PWAManager() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        // Handle installation prompt
        const handler = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
            setToastMessage("Add BitHabit to your home screen for a better experience!");
            setShowToast(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Handle service worker updates
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.onupdatefound = () => {
                    setToastMessage("App update available! Refresh to see the latest changes.");
                    setShowToast(true);
                };
            });
        }

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === "accepted") {
            setInstallPrompt(null);
        }
    };

    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) return;

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            setToastMessage("Notifications enabled! We'll keep you on track.");
            setShowToast(true);
        }
    };

    // Trigger permission request on first load if not set
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            // Wait slightly before prompting
            const timer = setTimeout(requestNotificationPermission, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <Toast
            isVisible={showToast}
            message={toastMessage}
            onClose={() => setShowToast(false)}
            type="info"
        />
    );
}
