import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    const variants = {
        default: "bg-provet-neutral-100 text-provet-neutral-800 border-provet-neutral-200",
        success: "bg-green-50 text-provet-status-success border-green-200",
        warning: "bg-amber-50 text-provet-status-warning border-amber-200",
        danger: "bg-red-50 text-provet-status-critical border-red-200",
        info: "bg-blue-50 text-provet-status-info border-blue-200",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold border transition-colors",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
