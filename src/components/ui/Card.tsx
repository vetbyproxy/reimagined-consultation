import React from 'react';
import { cn } from "../../lib/utils";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title?: React.ReactNode;
    action?: React.ReactNode;
    contentClassName?: string;
    noPadding?: boolean;
}

export function Card({ title, action, children, className, contentClassName, noPadding = false, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "bg-white border border-provet-neutral-200 rounded-xl shadow-sm flex flex-col transition-shadow hover:shadow-md",
                className
            )}
            {...props}
        >
            {(title || action) && (
                <div className="bg-white px-5 py-4 flex justify-between items-center border-b border-provet-neutral-100 shrink-0 rounded-t-xl">
                    {title && <h3 className="text-provet-neutral-800 font-bold text-sm uppercase tracking-wide">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={cn("flex-1", noPadding ? "p-0 flex flex-col" : "p-5", contentClassName)}>
                {children}
            </div>
        </div>
    );
}
