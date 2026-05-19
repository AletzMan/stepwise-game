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
            className={`relative flex flex-col items-center justify-center p-2 bg-bg-tertiary border border-border-custom rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_6px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_16px_rgba(0,0,0,0.4)] active:translate-y-0 active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:hover:translate-y-0 cmd-btn-hover ${isActive ? 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : ''} ${className}`}
            style={style}
            {...props}
        >
            {children}
        </button>
    );
});

CommandButton.displayName = 'CommandButton';
export default CommandButton;
