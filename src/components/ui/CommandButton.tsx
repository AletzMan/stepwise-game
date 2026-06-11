import React from 'react';

export interface CommandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean;
}

export const CommandButton = React.forwardRef<HTMLButtonElement, CommandButtonProps>(({
    isActive = false,
    className = '',
    children,
    style,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={`
                relative flex flex-row items-center justify-center gap-2 px-3 py-1.5
                font-outfit font-black tracking-wide text-xs uppercase select-none
                bg-bg-tertiary text-text-primary rounded-sm border border-b-3 border-(--cmd-color)/30
                shadow-[0_3px_6px_rgba(0,0,0,0.4)]
                transition-all duration-150 ease-out 
                cursor-pointer overflow-hidden
                
                hover:-translate-y-px hover:border-b-3 hover:bg-bg-secondary
                active:translate-y-[2px] active:border-b-px
                disabled:opacity-20 disabled:pointer-events-none disabled:transform-none
                cmd-btn-hover
                
                /* Reflejo superior estilo cristal/ficha de juego */
                before:absolute before:inset-x-0 before:top-0 before:h-[40%] before:bg-white/5 before:pointer-events-none
                
                ${isActive ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan shadow-[0_0_15px_color-mix(in_srgb,var(--color-accent-cyan)_30%,transparent)]' : ''} 
                ${className}
            `}
            style={style}
            {...props}
        >
            {/* Contenedor interno para asegurar la jerarquía de capas sobre los reflejos */}
            <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
                {children}
            </span>
        </button>
    );
});

CommandButton.displayName = 'CommandButton';
export default CommandButton;