"use client";

import { useState } from "react";


export default function Llm() {
    const [data , setData] = useState<string | null>(null);
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    const fetchData = async () => {
        if (!input.trim()) {
            setError('Please enter a message');
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const response = await fetch('/api/llm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input.trim() }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({ error: 'Unknown error' }));
                setError(err?.error || 'Request failed');
                setData(null);
                return;
            }

            const result = await response.json();
            setData(result.response ?? null);
        } 
        catch (error) {
            console.error(error);
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold text-white flex items-center gap-2">
                            🛡️ Advanced Fraud Detection
                        </h1>
                        <p className="text-sm text-gray-300 mt-1">AI-powered analysis to identify potential scams, phishing attempts, and fraudulent communications with detailed recommendations.</p>
                    </div>
                </div>

                <label htmlFor="message" className="sr-only">Message to analyze</label>
                <div className="relative mt-6">
                    <textarea
                        id="message"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste message or email content here..."
                        className="w-full min-h-[160px] bg-transparent text-white placeholder:text-gray-400 rounded-xl p-4 pr-28 resize-none border border-white/6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                        onClick={fetchData}
                        disabled={loading}
                        aria-label="Analyze message"
                        className="absolute right-3 bottom-3 inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md disabled:opacity-50"
                    >
                        {loading ? (
                            // spinner
                            <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
                            </svg>
                        )}
                        <span className="hidden sm:inline">{loading ? 'Analyzing' : 'Analyze'}</span>
                    </button>
                </div>

                {error && (
                    <div className="mt-4 text-sm text-red-400">{error}</div>
                )}

                {data && (
                    <div className="mt-6 bg-white/5 p-6 rounded-xl border border-white/10 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="font-semibold text-lg flex items-center gap-2">
                                📋 Analysis Results
                            </div>
                            <div className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
                                AI-Generated Report
                            </div>
                        </div>
                        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                            <div 
                                className="prose prose-invert max-w-none text-gray-100 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: data
                                        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 text-white">$1</h1>')
                                        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-6 text-blue-300 border-b border-gray-600 pb-2">$1</h2>')
                                        .replace(/^\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-white">$1</strong>')
                                        .replace(/^• (.*$)/gim, '<li class="ml-4 mb-2 text-gray-200">• $1</li>')
                                        .replace(/\n/g, '<br>')
                                }}
                            />
                        </div>
                        <div className="mt-4 text-xs text-yellow-400 flex items-center gap-1">
                            ⚠️ Always verify suspicious communications through official channels before taking any action.
                        </div>
                    </div>
                )}

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-xs text-blue-300 space-y-2">
                        <div className="font-semibold flex items-center gap-1">
                            💡 Pro Tips:
                        </div>
                        <ul className="space-y-1 ml-4">
                            <li>• Paste suspicious emails, messages, or communications for analysis</li>
                            <li>• The AI analyzes psychological manipulation tactics and fraud patterns</li>
                            <li>• Always verify through official channels before taking action</li>
                            <li>• Report confirmed fraud to relevant authorities</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    )
}