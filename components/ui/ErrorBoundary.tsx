"use client";

import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    handleClearData = () => {
        if (confirm('This will clear all your local data. Are you sure?')) {
            localStorage.clear();
            window.location.href = '/';
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-teal-950 via-cyan-950 to-teal-900 flex items-center justify-center p-6">
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-white/20">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-400" />
                            </div>

                            <div>
                                <p className="text-white/60 mb-6 max-w-md mx-auto">
                                    Something went wrong. It&apos;s not you, it&apos;s us.
                                    <br />
                                    We&apos;ve been notified and are looking into it.
                                    <br />
                                    Don&apos;t worry, your data is safe. Try one of the options below:
                                </p>
                            </div>

                            {this.state.error && (
                                <details className="w-full bg-black/20 rounded-xl p-4 text-left">
                                    <summary className="text-white/80 text-xs cursor-pointer">
                                        Technical details
                                    </summary>
                                    <p className="text-white/60 text-xs mt-2 font-mono break-all">
                                        {this.state.error.message}
                                    </p>
                                </details>
                            )}

                            <div className="w-full space-y-3">
                                <button
                                    onClick={this.handleReset}
                                    className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-white/90 transition-all active:scale-95"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={this.handleClearData}
                                    className="w-full bg-red-500/20 text-red-400 py-3 rounded-xl font-semibold hover:bg-red-500/30 transition-all active:scale-95 border border-red-500/30"
                                >
                                    Clear All Data & Restart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
