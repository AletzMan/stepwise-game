import React from 'react';

export type ButtonIntent = 'default' | 'primary' | 'danger' | 'accent' | 'ghost' | 'solid';
export type ButtonColor = 'cyan' | 'purple' | 'red' | 'green' | 'yellow' | 'orange' | 'pink';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'none';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    intent?: ButtonIntent;
    color?: ButtonColor;
    size?: ButtonSize;
    isActive?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    intent = 'default',
    color = 'cyan',
    size = 'md',
    isActive = false,
    className = '',
    children,
    style,
    ...props
}, ref) => {

    // Core styling for the new premium design
    const baseStyle = `relative inline-flex items-center justify-center gap-2 
    font-outfit font-bold tracking-wide 
    transition-all duration-300 ease-out 
    cursor-pointer  rounded-sm
    overflow-hidden active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0`;

    // Size mappings 
    const sizeStyles = {
        sm: "px-4 py-1.5 text-[0.8rem] ",
        md: "px-5 py-2.5 text-[0.85rem] ",
        lg: "px-6 py-3 text-[0.95rem] ",
        none: "",
    };

    // Base premium shadows/borders for solid buttons
    const solidPremiumEffects = "shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_6px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_12px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-linear-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700";

    // Intent/Color mappings
    let intentStyle = "";

    switch (intent) {
        case 'default':
            intentStyle = `bg-bg-tertiary border border-border-custom text-text-primary hover:bg-bg-secondary hover:border-text-muted ${solidPremiumEffects} ${isActive ? 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_15px_rgba(34,211,238,0.2)] text-accent-cyan' : ''}`;
            break;
        case 'primary':
            intentStyle = `bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] ${solidPremiumEffects}`;
            break;
        case 'danger':
            intentStyle = `bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] ${solidPremiumEffects}`;
            break;
        case 'accent':
            if (color === 'purple') {
                intentStyle = `bg-accent-purple/10 text-accent-purple border border-accent-purple/30 hover:bg-accent-purple/20 hover:border-accent-purple hover:shadow-[0_0_15px_rgba(167,139,250,0.3)] ${solidPremiumEffects}`;
            } else if (color === 'cyan') {
                intentStyle = `bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 hover:bg-accent-cyan/20 hover:border-accent-cyan hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] ${solidPremiumEffects}`;
            } else if (color === 'red') {
                intentStyle = `bg-accent-red/10 text-accent-red border border-accent-red/30 hover:bg-accent-red/20 hover:border-accent-red hover:shadow-[0_0_15px_rgba(248,113,113,0.3)] ${solidPremiumEffects}`;
            } else if (color === 'green') {
                intentStyle = `bg-accent-green/10 text-accent-green border border-accent-green/30 hover:bg-accent-green/20 hover:border-accent-green hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] ${solidPremiumEffects}`;
            } else if (color === 'yellow') {
                intentStyle = `bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/30 hover:bg-accent-yellow/20 hover:border-accent-yellow hover:shadow-[0_0_15px_rgba(252,211,77,0.3)] ${solidPremiumEffects}`;
            } else if (color === 'orange') {
                intentStyle = `bg-accent-orange/10 text-accent-orange border border-accent-orange/30 hover:bg-accent-orange/20 hover:border-accent-orange hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] ${solidPremiumEffects}`;
            } else if (color === 'pink') {
                intentStyle = `bg-accent-pink/10 text-accent-pink border border-accent-pink/30 hover:bg-accent-pink/20 hover:border-accent-pink hover:shadow-[0_0_15px_rgba(244,114,182,0.3)] ${solidPremiumEffects}`;
            }
            break;
        case 'solid':
            if (color === 'purple') {
                intentStyle = `bg-accent-purple text-bg-primary border border-accent-purple hover:bg-purple-300 hover:border-purple-300 hover:shadow-[0_0_20px_rgba(167,139,250,0.5)] ${solidPremiumEffects}`;
            } else if (color === 'cyan') {
                intentStyle = `bg-accent-cyan text-bg-primary border border-accent-cyan hover:bg-cyan-300 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] ${solidPremiumEffects}`;
            } else if (color === 'red') {
                intentStyle = `bg-accent-red text-white border border-accent-red hover:bg-red-500 hover:border-red-500 hover:shadow-[0_0_20px_rgba(248,113,113,0.5)] ${solidPremiumEffects}`;
            } else if (color === 'green') {
                intentStyle = `bg-accent-green text-bg-primary border border-accent-green hover:bg-emerald-400 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] ${solidPremiumEffects}`;
            } else if (color === 'yellow') {
                intentStyle = `bg-accent-yellow text-bg-primary border border-accent-yellow hover:bg-yellow-400 hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(252,211,77,0.5)] ${solidPremiumEffects}`;
            } else if (color === 'orange') {
                intentStyle = `bg-accent-orange text-bg-primary border border-accent-orange hover:bg-orange-400 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] ${solidPremiumEffects}`;
            } else if (color === 'pink') {
                intentStyle = `bg-accent-pink text-bg-primary border border-accent-pink hover:bg-pink-400 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(244,114,182,0.5)] ${solidPremiumEffects}`;
            }
            break;
        case 'ghost':
            if (color === 'red') {
                intentStyle = "bg-accent-red/5 text-accent-red hover:bg-accent-red/20 border border-transparent hover:border-accent-red/50 hover:shadow-[0_0_10px_rgba(248,113,113,0.2)]";
            } else {
                intentStyle = `bg-transparent text-text-muted border border-transparent hover:text-text-primary transition-colors duration-200 ${isActive ? '!text-accent-cyan' : ''}`;
            }
            break;
    }

    const combinedClassName = [
        baseStyle,
        sizeStyles[size],
        intentStyle,
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            ref={ref}
            className={combinedClassName}
            style={style}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';
export default Button;
