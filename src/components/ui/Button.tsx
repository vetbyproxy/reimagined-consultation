import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    disabled,
    ...props
}: ButtonProps) {

    const variants = {
        primary: "bg-provet-purple hover:bg-provet-purple-light text-white font-semibold shadow-sm hover:shadow",
        secondary: "bg-provet-neutral-100 hover:bg-provet-neutral-200 text-provet-neutral-900 border border-provet-neutral-200",
        danger: "bg-provet-status-critical hover:bg-red-600 text-white shadow-sm",
        outline: "border-2 border-provet-purple text-provet-purple hover:bg-provet-purple-bg",
        ghost: "hover:bg-provet-neutral-100 text-provet-neutral-600 hover:text-provet-purple",
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-lg",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-provet-purple-light disabled:pointer-events-none disabled:opacity-50 active:scale-95",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}
