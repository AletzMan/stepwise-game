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

// Diccionario de colores base de tu juego para evitar el anidamiento masivo de IFs
const colorMap: Record<ButtonColor, { name: string; hex: string; lightBg: string; shadow: string; text: string }> = {
    cyan: { name: 'accent-cyan', hex: 'var(--color-accent-cyan)', lightBg: 'bg-cyan-300', shadow: 'rgba(34,211,238,0.4)', text: 'text-bg-primary' },
    purple: { name: 'accent-purple', hex: 'var(--color-accent-purple)', lightBg: 'bg-purple-300', shadow: 'rgba(167,139,250,0.4)', text: 'text-bg-primary' },
    red: { name: 'accent-red', hex: 'var(--color-accent-red)', lightBg: 'bg-red-500', shadow: 'rgba(248,113,113,0.4)', text: 'text-white' },
    green: { name: 'accent-green', hex: 'var(--color-accent-green)', lightBg: 'bg-emerald-400', shadow: 'rgba(52,211,153,0.4)', text: 'text-bg-primary' },
    yellow: { name: 'accent-yellow', hex: 'var(--color-accent-yellow)', lightBg: 'bg-yellow-400', shadow: 'rgba(252,211,77,0.4)', text: 'text-bg-primary' },
    orange: { name: 'accent-orange', hex: 'var(--color-accent-orange)', lightBg: 'bg-orange-400', shadow: 'rgba(249,115,22,0.4)', text: 'text-bg-primary' },
    pink: { name: 'accent-pink', hex: 'var(--color-accent-pink)', lightBg: 'bg-pink-400', shadow: 'rgba(244,114,182,0.4)', text: 'text-bg-primary' },
};

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

    // Estilo base con animaciones mejoradas para videojuegos (Feedback táctil fluido)
    const baseStyle = `relative inline-flex items-center justify-center gap-2 
    font-outfit font-black tracking-wider uppercase select-none
    transition-all duration-200 ease-out 
    cursor-pointer rounded-sm border border-b-[4px]
    overflow-hidden 
    hover:-translate-y-[2px] hover:border-b-[4px]
    active:translate-y-[2px] active:border-b-[2px]
    disabled:opacity-40 disabled:pointer-events-none disabled:transform-none`;

    // Mapeo de tamaños con un padding balanceado para gaming
    const sizeStyles = {
        sm: "px-3.5 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3.5 text-base",
        none: "border-none",
    };

    // Efecto premium: Reflejo brillante superior + destello al hacer hover que cruza la pantalla
    const premiumEffects = `
        before:absolute before:inset-0 before:bg-linear-to-b before:from-white/15 before:to-transparent before:pointer-events-none
        after:absolute after:inset-0 after:bg-linear-to-r after:from-transparent after:via-white/20 after:to-transparent after:-translate-x-full hover:after:translate-x-full after:transition-transform after:duration-1000 after:ease-out
    `;

    let intentStyle = "";
    const activeColor = colorMap[color];

    switch (intent) {
        case 'default':
            intentStyle = `bg-bg-tertiary border-border-custom text-text-primary hover:bg-bg-secondary
            shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.4)]
            ${isActive ? 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_15px_rgba(34,211,238,0.25)] text-accent-cyan' : ''}`;
            break;

        case 'primary':
            intentStyle = `bg-emerald-600/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500 hover:text-white hover:border-emerald-500
            shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] ${premiumEffects}`;
            break;

        case 'danger':
            intentStyle = `bg-red-600/20 text-red-400 border-red-500/40 hover:bg-red-500 hover:text-white hover:border-red-500
            shadow-[0_4px_12px_rgba(239,68,68,0.2)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)] ${premiumEffects}`;
            break;

        case 'accent':
            intentStyle = `bg-${activeColor.name}/10 text-${activeColor.name} border-${activeColor.name}/30 hover:bg-${activeColor.name}/20 hover:border-${activeColor.name}
            hover:shadow-[0_0_16px_color-mix(in_srgb,${activeColor.hex}_40%,transparent)] ${premiumEffects}`;
            break;

        case 'solid':
            intentStyle = `bg-${activeColor.name} ${activeColor.text} border-black/20 hover:${activeColor.lightBg}
            shadow-[0_4px_12px_${activeColor.shadow}] hover:shadow-[0_6px_20px_${activeColor.shadow}] ${premiumEffects}`;
            break;

        case 'ghost':
            if (color === 'red') {
                intentStyle = "bg-accent-red/5 text-accent-red border-transparent hover:bg-accent-red/20 hover:border-accent-red/30";
            } else {
                intentStyle = `bg-transparent text-text-muted border-transparent hover:text-text-primary transition-colors duration-200 border-b-transparent ${isActive ? '!text-accent-cyan' : ''}`;
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
            {/* Contenedor del contenido para asegurar que quede por encima del pseudo-elemento before/after */}
            <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
                {children}
            </span>
        </button>
    );
});

Button.displayName = 'Button';
export default Button;