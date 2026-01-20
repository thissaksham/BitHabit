"use client";

import PageHeader from "@/components/layout/PageHeader";
import { Download, Upload, ShieldCheck, Database, RefreshCcw, Coffee, Heart } from "lucide-react";
import { dataService } from "@/lib/dataService";
import { useState, useRef } from "react";
import Toast from "@/components/ui/Toast";
import { motion } from "framer-motion";

export default function OtherPage() {
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" as any });
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (message: string, type: string = "success") => {
        setToast({ visible: true, message, type });
    };

    const handleExport = async () => {
        try {
            const data = await dataService.getAllData();
            dataService.downloadBackup(data);
            showToast("Data exported successfully!");
        } catch (e) {
            showToast("Failed to export data", "error");
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                const success = await dataService.restoreData(data);
                if (success) {
                    showToast("Data restored! Refreshing app...");
                    setTimeout(() => window.location.href = "/", 1500);
                } else {
                    showToast("Invalid backup file format", "error");
                    setIsImporting(false);
                }
            } catch (err) {
                showToast("Failed to parse backup file", "error");
                setIsImporting(false);
            }
        };

        reader.readAsText(file);
        // Reset input
        event.target.value = "";
    };

    return (
        <div className="min-h-screen pb-24">
            <PageHeader title="Other" />

            <div className="px-6 space-y-4 mt-6">
                {/* Actions Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Export Card */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        onClick={handleExport}
                        className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-6 rounded-[2rem] border border-white/10 transition-all active:scale-[0.98] text-left group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                            <Download className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-lg leading-tight">Export Backup</h3>
                            <p className="text-white/40 text-sm mt-1">Download as a .json file</p>
                        </div>
                    </motion.button>

                    {/* Import Card */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={handleImportClick}
                        disabled={isImporting}
                        className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-6 rounded-[2rem] border border-white/10 transition-all active:scale-[0.98] text-left group disabled:opacity-50"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                            {isImporting ? (
                                <RefreshCcw className="w-7 h-7 text-orange-400 animate-spin" />
                            ) : (
                                <Upload className="w-7 h-7 text-orange-400" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-lg leading-tight">Import Backup</h3>
                            <p className="text-white/40 text-sm mt-1">Restore from a .json file</p>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json"
                            className="hidden"
                        />
                    </motion.button>

                    {/* Support Card */}
                    <motion.a
                        href="https://buymeacoffee.com/thissaksham"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-6 rounded-[2rem] border border-white/10 transition-all active:scale-[0.98] text-left group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                            <Coffee className="w-7 h-7 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-white font-bold text-lg leading-tight">Buy me a coffee</h3>
                                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                            </div>
                            <p className="text-white/40 text-sm mt-1">Support the developer</p>
                        </div>
                    </motion.a>
                </div>

                {/* System Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="pt-8 space-y-4"
                >
                    <div className="flex items-center gap-3 px-2">
                        <ShieldCheck className="w-5 h-5 text-white/20" />
                        <span className="text-white/20 text-sm font-medium uppercase tracking-widest text-[10px]">Privacy First</span>
                    </div>
                    <p className="px-2 text-white/30 text-[11px] leading-relaxed">
                        Data is processed locally in your browser. No personal information is stored on our servers. Future updates will include automated cloud sync.
                    </p>
                </motion.div>
            </div>

            <Toast
                isVisible={toast.visible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, visible: false })}
            />
        </div>
    );
}

