import React from 'react';
import Button from '../ui/Button';
import { RotateCcw, AlertTriangle, LayoutGrid, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LevelErrorModalProps {
    message: string;
    show: boolean;
    setShowStatusLevel: (show: boolean) => void;
    handleRetryLevel: () => void;
    handleRestartLevel: () => void;
    // Si manejas un estado para regresar al menú/niveles
    onGoToMenu?: () => void;
}

const LevelErrorModal: React.FC<LevelErrorModalProps> = ({
    message,
    show,
    setShowStatusLevel,
    handleRetryLevel,
    handleRestartLevel,
    onGoToMenu
}) => {
    const { t } = useTranslation();

    if (!show) return null;

    return (
        <dialog
            className="fixed inset-0 w-svw h-svh z-2000 bg-black/60  flex items-center justify-center animate-fade-in cursor-pointer select-none"
            open
        >
            <div
                className="relative overflow-hidden w-[350px] lg:w-[500px] rounded-xl border border-accent-red/15 bg-linear-to-b from-bg-secondary to-bg-primary shadow-[0_24px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_color-mix(in_srgb,var(--color-accent-red)_8%,transparent)] animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Línea decorativa superior con tu rojo de acento */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-accent-red via-accent-orange to-accent-red opacity-80" />

                {/* Destello de fondo rojo/alerta sutil */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-accent-red/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative px-6 pt-8 pb-6 text-center">

                    {/* Icono de Alerta Estilizado */}
                    <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red drop-shadow-[0_0_8px_color-mix(in_srgb,var(--color-accent-red)_30%,transparent)]">
                            <AlertTriangle size={24} strokeWidth={2.5} />
                        </div>
                    </div>

                    {/* Encabezado */}
                    <div className="space-y-1">
                        <p className="text-accent-red text-xs font-black tracking-[0.25em] uppercase drop-shadow-[0_0_8px_color-mix(in_srgb,var(--color-accent-red)_30%,transparent)]">
                            {t('modals.level_error.title')}
                        </p>
                        <h2 className="font-['Titan_One'] text-3xl text-text-primary tracking-wide">
                            {t('modals.level_error.oops')}
                        </h2>
                    </div>

                    {/* El mensaje de error (Tu prop principal) */}
                    <div className="my-5 p-3 bg-bg-panel border border-border-custom rounded-md min-h-[60px] flex items-center justify-center">
                        <p className="text-text-secondary text-sm font-medium tracking-wide leading-relaxed">
                            {message || t('modals.level_error.default_msg')}
                        </p>
                    </div>

                    {/* Acciones principales */}
                    <div className="mt-6 space-y-2.5">
                        {/* Botón primario: REINTENTAR (Usa el color amarillo/naranja mecánico) */}
                        <Button
                            intent="solid"
                            color="yellow"
                            className="w-full h-12 rounded-md text-base font-black tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_color-mix(in_srgb,var(--color-accent-yellow)_20%,transparent)] flex items-center justify-center gap-2"
                            onClick={() => {
                                setShowStatusLevel(false);
                                handleRetryLevel();
                            }}
                        >
                            <RotateCcw size={18} strokeWidth={3} />
                            <span>{t('modals.level_error.btn_retry')}</span>
                        </Button>

                        <div className="flex gap-2.5">
                            {/* Botón secundario para volver al selector si se rinden */}
                            {onGoToMenu && (
                                <Button
                                    intent="solid"
                                    color="purple"
                                    className="flex-1 h-11 rounded-md font-bold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                    onClick={() => {
                                        setShowStatusLevel(false);
                                        onGoToMenu();
                                    }}
                                >
                                    <LayoutGrid size={18} strokeWidth={2.5} />
                                    <span>{t('modals.level_error.btn_select_level')}</span>
                                </Button>
                            )}
                            <Button
                                intent="solid"
                                color="red"
                                className="flex-1 h-11 rounded-md font-bold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                onClick={() => {
                                    setShowStatusLevel(false);
                                    handleRestartLevel();
                                }}
                            >
                                <RefreshCw size={18} strokeWidth={2.5} />
                                <span>{t('modals.level_error.btn_restart', { defaultValue: 'Restart' })}</span>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </dialog>
    );
};

export default LevelErrorModal;