import React, { useState } from 'react';
import Button from '../ui/Button';
import { LevelData } from '../../game/levels';
import { LayoutGrid, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../ui/LanguageToggle';
import FullscreenToggle from '../ui/FullscreenToggle';
import { NavLink, useNavigate } from 'react-router';
import { LogoSteps } from './LogoSteps';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
    levelInfo: LevelData | null;
    isMobileLandscape?: boolean;
}

const Header: React.FC<HeaderProps> = ({ levelInfo, isMobileLandscape = false }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

    return (
        <>
            {!isMobileLandscape && (
                <header id="header" className="relative flex items-center justify-between gap-1 py-0.5 px-2 bg-linear-to-r from-bg-secondary via-bg-primary/90 to-bg-secondary rounded-sm border border-border-custom min-h-[58px] select-none">
                    {/* Línea decorativa sutil inferior de tecnología */}
                    <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent-cyan/30 to-transparent" />

                    <div className="flex flex-row gap-1 items-center sm:min-w-[148px]">
                        <NavLink
                            to="/"
                            title={t('levels.back')}
                            className="flex flex-row gap-1 items-center"
                        >
                            <LogoSteps className="w-14 lg:w-20 h-14" />

                            <h1 className="font-['Titan_One'] text-lg hidden sm:block bg-linear-to-b from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] w-full wrap-break-word">
                                STEP
                                <span className="bg-linear-to-r from-accent-cyan via-accent-cyan to-accent-purple bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                                    WISE
                                </span>
                            </h1>

                        </NavLink>
                    </div>

                    {/* Centro: Info del Nivel Estilizada */}
                    <div className="flex items-center justify-center w-full">
                        {levelInfo && (
                            <div className="flex flex-col lg:flex-row max-lg:w-40 items-center gap-3 py-1 max-lg:py-2 lg:px-4 bg-linear-to-r from-accent-cyan/5 via-accent-cyan/10 to-accent-cyan/5 border-x border-accent-cyan/30 rounded-md shadow-[inset_0_0_10px_rgba(34,211,238,0.05)]">
                                <span className="font-jetbrains text-[1rem] text-center font-black text-accent-cyan uppercase tracking-[0.15em]">
                                    {t('header.level', { id: levelInfo.id })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Derecha: Acciones - Ocultas en landscape de celular */}
                    <div className="flex flex-col-reverse sm:flex-row items-center gap-2 max-lg:landscape:hidden">
                        {/* Botón de Niveles */}
                        <Button
                            intent="accent"
                            color="purple"
                            size="sm"
                            onClick={() => navigate('/levels')}
                            className="font-black tracking-wider transition-all duration-300"
                        >
                            <LayoutGrid size={14} strokeWidth={2.5} className="transition-transform duration-300" />
                            <span className='hidden lg:block'>{t('header.levels_btn')}</span>
                        </Button>

                        {/* Botón de Idioma */}
                        <LanguageToggle />

                        {/* Botón de Pantalla Completa */}
                        <FullscreenToggle />
                    </div>
                </header>
            )}

            {/* Speed Dial para celular en horizontal */}
            {isMobileLandscape && (
                <div className="fixed bottom-4 left-4 z-50 flex flex-col-reverse gap-2 items-start">
                    <Button
                        intent="accent"
                        color="cyan"
                        size="sm"
                        onClick={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
                        className="w-8! h-8! p-0! rounded-full flex items-center justify-center shadow-lg"
                    >
                        <motion.div
                            initial={false}
                            animate={{ rotate: isSpeedDialOpen ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isSpeedDialOpen ? <X size={18} /> : <Menu size={18} />}
                        </motion.div>
                    </Button>

                    <AnimatePresence>
                        {isSpeedDialOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col gap-2 items-start pb-2"
                            >
                                {/* Botón de Niveles */}
                                <Button
                                    intent="accent"
                                    color="purple"
                                    size="sm"
                                    onClick={() => {
                                        setIsSpeedDialOpen(false);
                                        navigate('/levels');
                                    }}
                                    className="w-8! h-8! p-0! rounded-full flex items-center justify-center shadow-lg"
                                    title={t('header.levels_btn')}
                                >
                                    <LayoutGrid size={14} strokeWidth={2.5} />
                                </Button>

                                {/* Botón de Idioma */}
                                <div onClick={() => setIsSpeedDialOpen(false)}>
                                    <LanguageToggle className="w-8! h-8! p-0! rounded-full shadow-lg" />
                                </div>

                                {/* Botón de Pantalla Completa */}
                                <div onClick={() => setIsSpeedDialOpen(false)}>
                                    <FullscreenToggle className="w-8! h-8! p-0! rounded-full shadow-lg" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </>
    );
};

export default Header;

