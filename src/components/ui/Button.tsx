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
interface ColorTheme {
    solidBg: string;
    solidText: string;
    solidHoverBg: string;
    solidShadow: string;
    accentBg: string;
    accentText: string;
    accentBorder: string;
    accentHoverBg: string;
    accentHoverBorder: string;
    accentShadow: string;
}

const colorMap: Record<ButtonColor, ColorTheme> = {
    cyan: {
        solidBg: 'bg-accent-cyan',
        solidText: 'text-bg-primary',
        solidHoverBg: 'hover:bg-cyan-300',
        solidShadow: 'shadow-[0_4px_12px_rgba(34,211,238,0.4)] hover:shadow-[0_6px_20px_rgba(34,211,238,0.4)]',
        accentBg: 'bg-accent-cyan/10',
        accentText: 'text-accent-cyan',
        accentBorder: 'border-accent-cyan/30',
        accentHoverBg: 'hover:bg-accent-cyan/20',
        accentHoverBorder: 'hover:border-accent-cyan',
        accentShadow: 'hover:shadow-[0_0_16px_rgba(34,211,238,0.4)]',
    },
    purple: {
        solidBg: 'bg-accent-purple',
        solidText: 'text-bg-primary',
        solidHoverBg: 'hover:bg-purple-300',
        solidShadow: 'shadow-[0_4px_12px_rgba(167,139,250,0.4)] hover:shadow-[0_6px_20px_rgba(167,139,250,0.4)]',
        accentBg: 'bg-accent-purple/10',
        accentText: 'text-accent-purple',
        accentBorder: 'border-accent-purple/30',
        accentHoverBg: 'hover:bg-accent-purple/20',
        accentHoverBorder: 'hover:border-accent-purple',
        accentShadow: 'hover:shadow-[0_0_16px_rgba(167,139,250,0.4)]',
    },
    red: {
        solidBg: 'bg-accent-red',
        solidText: 'text-white',
        solidHoverBg: 'hover:bg-red-500',
        solidShadow: 'shadow-[0_4px_12px_rgba(248,113,113,0.4)] hover:shadow-[0_6px_20px_rgba(248,113,113,0.4)]',
        accentBg: 'bg-accent-red/10',
        accentText: 'text-accent-red',
        accentBorder: 'border-accent-red/30',
        accentHoverBg: 'hover:bg-accent-red/20',
        accentHoverBorder: 'hover:border-accent-red',
        accentShadow: 'hover:shadow-[0_0_16px_rgba(248,113,113,0.4)]',
    },
    green: {
        solidBg: 'bg-accent-green',
        solidText: 'text-bg-primary',
        solidHoverBg: 'hover:bg-lime-400',
        solidShadow: 'shadow-[0_4px_12px_rgba(124,207,0,0.4)] hover:shadow-[0_6px_20px_rgba(124,207,0,0.4)]',
        accentBg: 'bg-accent-green/10',
        accentText: 'text-accent-green',
        accentBorder: 'border-accent-green/30',
        accentHoverBg: 'hover:bg-accent-green/20',
        accentHoverBorder: 'hover:border-accent-green',
        accentShadow: 'hover:shadow-[0_0_16px_rgba(124,207,0,0.4)]',
    },
    yellow: {
        solidBg: 'bg-accent-yellow',
        solidText: 'text-bg-primary',
        solidHoverBg: 'hover:bg-yellow-400',
        solidShadow: 'shadow-[0_4px_12px_rgba(252,211,77,0.4)] hover:shadow-[0_6px_20px_rgba(252,211,77,0.4)]',
        accentBg: 'bg-accent-yellow/10',
        accentText: 'text-accent-yellow',
        accentBorder: 'border-accent-yellow/30',
        accentHoverBg: 'hover:bg-accent-yellow/20',
        accentHoverBorder: 'hover:border-accent-yellow',
        accentShadow: 'hover:shadow-[0_0_16px_rgba(252,211,77,0.4)]',
    },
    orange: {
        solidBg: 'bg-accent-orange',
        solidText: 'text-bg-primary',
        solidHoverBg: 'hover:bg-orange-400',
        solidShadow: 'shadow-[0_4px_12px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)]',
        accentBg: 'bg-accent-orange/10',
        accentText: 'text-accent-orange',
        accentBorder: 'border-accent-orange/30',
        accentHoverBg: 'hover:bg-accent-orange/20',
        accentHoverBorder: 'hover:border-accent-orange',
        accentShadow: 'hover:shadow-[0_0_16px_rgba(249,115,22,0.4)]',
    },
    pink: {
        solidBg: 'bg-accent-pink',
        solidText: 'text-bg-primary',
        solidHoverBg: 'hover:bg-pink-400',
        solidShadow: 'shadow-[0_4px_12px_rgba(244,114,182,0.4)] hover:shadow-[0_6px_20px_rgba(244,114,182,0.4)]',
        accentBg: 'bg-accent-pink/10',
        accentText: 'text-accent-pink',
        accentBorder: 'border-accent-pink/30',
        accentHoverBg: 'hover:bg-accent-pink/20',
        accentHoverBorder: 'hover:border-accent-pink',
        accentShadow: 'hover:shadow-[0_0_16px_rgba(244,114,182,0.4)]',
    },
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            intentStyle = `${activeColor.accentBg} ${activeColor.accentText} ${activeColor.accentBorder} ${activeColor.accentHoverBg} ${activeColor.accentHoverBorder} ${activeColor.accentShadow} ${premiumEffects}`;
            break;

        case 'solid':
            intentStyle = `${activeColor.solidBg} ${activeColor.solidText} border-black/20 ${activeColor.solidHoverBg} ${activeColor.solidShadow} ${premiumEffects}`;
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