import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
    content: string;
    className?: string;
    side?: 'top' | 'bottom';
}

export function Tooltip({ content, className = "", side = 'top' }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className={`relative inline-flex items-center ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onClick={() => setIsVisible(!isVisible)}
        >
            <HelpCircle className="w-4 h-4 text-provet-neutral-400 hover:text-provet-purple cursor-help transition-colors" />

            {isVisible && (
                <div className={`absolute left-1/2 -translate-x-1/2 z-50 w-64 p-3 bg-provet-neutral-900/90 text-white text-xs rounded-lg shadow-xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200 ${side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                    }`}>
                    {content}
                    <div className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${side === 'top' ? 'top-full border-t-provet-neutral-900/90' : 'bottom-full border-b-provet-neutral-900/90'
                        }`}></div>
                </div>
            )}
        </div>
    );
}
