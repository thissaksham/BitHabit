"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/ui/Toast";

export default function PWAManager() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        const checkPrompt = () => {
            const isDismissed = localStorage.getItem("pwa-prompt-dismissed");
            if (isDismissed) return;

            const prompt = (window as any).deferredPrompt;
            if (prompt) {
                console.log("PWA: Using captured prompt");
                setInstallPrompt(prompt);
                setToastMessage("Add BitHabit to your home screen for a better experience!");
                setShowToast(true);
            }
        };

        // Check if already captured
        checkPrompt();

        // Register listener for if it fires after mount
        (window as any).onPwaInstallReady = (e: any) => {
            const isDismissed = localStorage.getItem("pwa-prompt-dismissed");
            if (isDismissed) return;

            console.log("PWA: Prompt ready via callback");
            setInstallPrompt(e);
            setToastMessage("Add BitHabit to your home screen for a better experience!");
            setShowToast(true);
        };

        // Handle service worker updates
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.onupdatefound = () => {
                    setToastMessage("App update available! Refresh to see the latest changes.");
                    setShowToast(true);
                };
            });
        }

        return () => {
            (window as any).onPwaInstallReady = null;
        };
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === "accepted") {
            localStorage.setItem("pwa-prompt-dismissed", "true");
            setInstallPrompt(null);
            setShowToast(false);
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
        <>
            <Toast
                isVisible={showToast}
                message={toastMessage}
                onClose={() => {
                    setShowToast(false);
                    if (installPrompt) {
                        localStorage.setItem("pwa-prompt-dismissed", "true");
                    }
                }}
                type="info"
                duration={installPrompt ? 0 : 5000}
                action={installPrompt ? {
                    label: "Install",
                    onClick: handleInstall
                } : undefined}
            />
        </>
    );
}
