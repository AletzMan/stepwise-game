import React from 'react';
import Button from '../ui/Button';
import { ChevronRight, LayoutGrid, RotateCcw, RefreshCw, Star } from 'lucide-react';
import { LevelData } from '../../game/levels';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface LevelCompleteModalProps {
    levelInfo: LevelData | null;
    statusType: 'info' | 'success' | 'error';
    stars: number;
    executedCommands: React.RefObject<number>;
    setShowStatusLevel: (show: boolean) => void;
    setStatusType: (type: 'info' | 'success' | 'error') => void;
    handleLoadLevel: (id: number) => void;
    handleResetLevel: () => void;
}

const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
    levelInfo, statusType, stars, executedCommands, setShowStatusLevel, setStatusType, handleLoadLevel, handleResetLevel
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    if (statusType !== 'success') return null;

    return (
        <dialog
            className="fixed inset-0 w-svw h-svh z-2000 bg-black/60 backdrop-blur-none flex items-center justify-center animate-fade-in cursor-pointer select-none"
            open
        >
            <div
                className="relative overflow-hidden w-[350px] md:w-[500px] rounded-xl border border-accent-cyan/15 bg-linear-to-b from-bg-secondary via-bg-primary to-bg-primary shadow-[0_24px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_-10px_color-mix(in_srgb,var(--color-accent-cyan)_10%,transparent)] animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Línea decorativa superior */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-accent-cyan via-accent-green to-accent-cyan opacity-80" />

                {/* Destello de fondo */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-accent-green/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative px-6 pt-8 pb-6 text-center">

                    {/* Header */}
                    <div className="space-y-1">
                        <p className="text-accent-green text-xs font-black tracking-[0.25em] uppercase drop-shadow-[0_0_8px_color-mix(in_srgb,var(--color-accent-green)_40%,transparent)]">
                            {t('modals.level_complete.title')}
                        </p>
                        <h2 className="font-['Titan_One'] text-4xl text-text-primary tracking-wide">
                            {t('modals.level_complete.level_title', { id: levelInfo?.id })}
                        </h2>
                    </div>

                    {/* Contenedor de Estrellas Original e Idéntico en Estructura */}
                    <div className="relative flex justify-center my-6">
                        {/* Fondo apagado original */}
                        <div className="flex gap-4 text-5xl">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className={`scale-90 opacity-15 grayscale brightness-50 ${i !== 1 ? 'pt-2' : ''}`}>
                                    <Star size={45} fill="currentColor" />
                                </div>
                            ))}
                        </div>
                        {/* Estrellas activas originales con tu clase .star-animate intacta */}
                        <div className="absolute inset-0 flex justify-center gap-4 text-5xl drop-shadow-[0_0_12px_rgba(250,204,21,0.35)]">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="star-animate"
                                    style={{ opacity: i < stars ? 1 : 0 }}
                                >
                                    <div>
                                        <Star size={45} fill="currentColor" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-text-primary/80 text-sm font-medium tracking-wide">
                        {t('modals.level_complete.solved_msg')}
                    </p>

                    {/* Tarjetas de Stats */}
                    <div className="grid grid-cols-3 gap-2.5 mt-6 p-1.5 bg-bg-tertiary/30 border border-border-custom/50 rounded-xl">
                        <div className="bg-bg-tertiary/70 border border-border-custom/40 rounded-lg py-2.5">
                            <p className="text-[10px] font-bold text-text-secondary tracking-wider uppercase">
                                {t('modals.level_complete.stats.moves')}
                            </p>
                            <p className="text-lg font-black text-text-primary mt-0.5">{executedCommands.current}</p>
                        </div>
                        <div className="bg-bg-tertiary/70 border border-border-custom/40 rounded-lg py-2.5">
                            <p className="text-[10px] font-bold text-text-secondary tracking-wider uppercase">
                                {t('modals.level_complete.stats.time')}
                            </p>
                            <p className="text-lg font-black text-text-primary mt-0.5">01:20</p>
                        </div>
                        <div className="bg-bg-tertiary/70 border border-border-custom/40 rounded-lg py-2.5">
                            <p className="text-[10px] font-bold text-text-secondary tracking-wider uppercase">
                                {t('modals.level_complete.stats.xp')}
                            </p>
                            <p className="text-lg font-black text-accent-cyan mt-0.5 drop-shadow-[0_0_6px_color-mix(in_srgb,var(--color-accent-cyan)_30%,transparent)]">
                                +250
                            </p>
                        </div>
                    </div>

                    {/* Acciones / Botones */}
                    <div className="mt-6 space-y-2.5">
                        <Button
                            intent="solid"
                            color="green"
                            className="w-full h-12 rounded-xl text-base font-black tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_color-mix(in_srgb,var(--color-accent-green)_25%,transparent)] hover:shadow-[0_4px_25px_color-mix(in_srgb,var(--color-accent-green)_40%,transparent)] flex items-center justify-center gap-1"
                            onClick={() => {
                                navigate(`/levels/${levelInfo!.id + 1}`);
                            }}
                        >
                            <span>{t('modals.level_complete.btn_next_level')}</span>
                            <ChevronRight size={20} strokeWidth={3} className="animate-pulse" />
                        </Button>

                        <div className="flex gap-2.5">
                            <Button
                                intent="solid"
                                color="pink"
                                className="flex-1 h-11 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                                onClick={() => {
                                    setStatusType('info');
                                    setShowStatusLevel(false);
                                    navigate('/levels');
                                }}
                            >
                                <LayoutGrid size={20} strokeWidth={2.5} />
                            </Button>
                            <Button
                                intent="solid"
                                color="orange"
                                className="flex-1 h-11 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                                onClick={() => {
                                    handleResetLevel();
                                }}
                            >
                                <RotateCcw size={20} strokeWidth={2.5} />
                            </Button>
                            <Button
                                intent="solid"
                                color="red"
                                className="flex-1 h-11 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                                onClick={() => {
                                    handleLoadLevel(levelInfo!.id);
                                }}
                            >
                                <RefreshCw size={20} strokeWidth={2.5} />
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </dialog>
    );
};

export default LevelCompleteModal;