import React from 'react';
import Button from '../ui/Button';
import { LevelData } from '../../game/levels';
import { LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../ui/LanguageToggle';
import FullscreenToggle from '../ui/FullscreenToggle';
import { NavLink, useNavigate } from 'react-router';
import { LogoSteps } from './LogoSteps';

interface HeaderProps {
    levelInfo: LevelData | null;
}

const Header: React.FC<HeaderProps> = ({ levelInfo }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
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

            {/* Derecha: Acciones */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-2 ">
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
    );
};

export default Header;
