import { useRef, useEffect } from 'react';
import { Card } from "../ui/Card";
import { Activity, Pause } from "lucide-react";
import { Tooltip } from "../ui/Tooltip";

interface TranscriptLine {
    id: string;
    speaker: 'vet' | 'owner';
    text: string;
}

interface LiveStreamPanelProps {
    transcript: TranscriptLine[];
    isTyping: boolean;
    isPaused: boolean;
}

// Simple POC dictionary for highlighting
const HIGHLIGHTS: Record<string, string> = {
    "drinking a lot more water": "bg-provet-purple-bg text-provet-purple font-medium border-b-2 border-provet-purple-light",
    "pee much more often": "bg-provet-purple-bg text-provet-purple font-medium border-b-2 border-provet-purple-light",
    "looks a bit thinner": "bg-provet-purple-bg text-provet-purple font-medium border-b-2 border-provet-purple-light",
    "mucous membranes": "bg-yellow-50 text-amber-600 font-medium border-b-2 border-amber-200",
    "tacky": "bg-yellow-50 text-amber-600 font-bold border-b-2 border-amber-200",
    "dehydrated": "bg-yellow-50 text-amber-600 font-bold border-b-2 border-amber-200",
    "palpating the kidneys": "bg-blue-50 text-provet-blue-royal font-medium border-b-2 border-provet-blue-royal",
    "small and irregular": "bg-red-50 text-provet-status-critical font-medium border-b-2 border-provet-status-critical",
    "small irregular kidneys": "bg-red-50 text-provet-status-critical font-medium border-b-2 border-provet-status-critical",
    "kidney disease": "bg-red-50 text-provet-status-critical font-bold border-b-2 border-provet-status-critical",
    "elevated": "bg-provet-status-warning text-white px-1",
};

export function LiveStreamPanel({ transcript, isTyping, isPaused }: LiveStreamPanelProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) {
            // Use ResizeObserver or simple timeout to ensure scroll goes to bottom after render
            const timeout = setTimeout(() => {
                scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [transcript, isTyping]);

    const renderTextWithHighlights = (text: string) => {
        const phrases = Object.keys(HIGHLIGHTS).sort((a, b) => b.length - a.length);
        if (phrases.length === 0) return <span>{text}</span>;

        const pattern = new RegExp(`(${phrases.join('|')})`, 'gi');
        const parts = text.split(pattern);

        return (
            <span>
                {parts.map((part, i) => {
                    const lowerPart = part.toLowerCase();
                    const highlightClass = HIGHLIGHTS[lowerPart] ||
                        Object.entries(HIGHLIGHTS).find(([key]) => key.toLowerCase() === lowerPart)?.[1];

                    if (highlightClass) {
                        return <span key={i} className={`rounded mx-0.5 ${highlightClass}`}>{part}</span>;
                    }
                    return part;
                })}
            </span>
        );
    };

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <span>Live Consultation</span>
                    <Tooltip content="Real-time speech-to-text transcript powered by AI. Clinically relevant phrases are highlighted automatically — watch for purple (symptoms), amber (exam findings), and red (critical findings)." side="bottom" />
                </div>
            }
            className="h-full flex flex-col border-none shadow-none bg-transparent"
            contentClassName="flex flex-col h-full"
            noPadding={true}
            action={
                <div className="flex items-center text-xs font-bold uppercase tracking-wider">
                    {isPaused ? (
                        <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                            <Pause className="w-3 h-3 mr-1" /> PAUSED
                        </div>
                    ) : (
                        <div className="flex items-center text-provet-status-critical">
                            <span className="w-2 h-2 bg-provet-status-critical rounded-full mr-2 animate-pulse"></span>
                            Recording
                        </div>
                    )}
                </div>
            }
        >
            <div className="flex-1 flex flex-col space-y-4 min-h-0 relative">
                {/* Paused Overlay Effect */}
                {isPaused && (
                    <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center pointer-events-none">
                        <div className="bg-white shadow-lg border border-provet-neutral-200 px-4 py-2 rounded-full text-provet-neutral-500 text-sm font-medium flex items-center">
                            <Pause className="w-4 h-4 mr-2" /> Simulation Paused
                        </div>
                    </div>
                )}

                {/* Audio Viz */}
                <div className="h-20 bg-white rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 border border-provet-neutral-200 shadow-sm">
                    <div className="absolute inset-0 flex items-center justify-center space-x-1 opacity-40">
                        {[...Array(16)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1.5 bg-provet-purple-light rounded-full animate-pulse"
                                style={{
                                    height: `${Math.random() * 60 + 20}%`,
                                    animationDuration: `${Math.random() * 0.8 + 0.4}s`
                                }}
                            />
                        ))}
                    </div>
                    <Activity className="text-provet-purple w-6 h-6 z-10" />
                </div>

                {/* Transcript Wrapper */}
                <div className="flex-1 overflow-hidden relative border border-provet-neutral-200 rounded-xl bg-white shadow-inner">
                    <div ref={scrollRef} className="absolute inset-0 overflow-y-auto p-4 space-y-4">
                        {transcript.length === 0 && (
                            <div className="text-provet-neutral-400 text-sm italic text-center mt-10">
                                Waiting for audio stream...
                            </div>
                        )}

                        {transcript.map((line) => (
                            <div key={line.id} className="flex space-x-3">
                                <div className="shrink-0 mt-1">
                                    {line.speaker === 'vet' ? (
                                        <div className="w-8 h-8 rounded-full bg-provet-purple text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                            Dr
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-provet-neutral-200 text-provet-neutral-600 flex items-center justify-center text-xs font-bold border border-provet-neutral-300">
                                            Own
                                        </div>
                                    )}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[90%] shadow-sm ${line.speaker === 'vet'
                                    ? 'bg-provet-neutral-50 border border-provet-neutral-200 text-provet-neutral-900 rounded-tl-none'
                                    : 'bg-white border border-provet-neutral-200 text-provet-neutral-800 rounded-bl-none'
                                    }`}>
                                    {renderTextWithHighlights(line.text)}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex space-x-2 p-2 ml-10">
                                <div className="w-1.5 h-1.5 bg-provet-neutral-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-provet-neutral-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-1.5 h-1.5 bg-provet-neutral-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
