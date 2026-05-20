import React from 'react';
import Button from '../ui/Button';
import { LevelData } from '../../game/levels';
import { Menu, Languages } from 'lucide-react'; // Usamos Lucide para mantener la consistencia de iconos
import { useTranslation } from 'react-i18next';

interface HeaderProps {
    levelInfo: LevelData | null;
    showLevelSelect: boolean;
    setShowLevelSelect: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ levelInfo, showLevelSelect, setShowLevelSelect }) => {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(nextLang);
        localStorage.setItem('language', nextLang);
    };

    return (
        <header className="relative flex items-center justify-between py-2 px-6 bg-linear-to-r from-bg-secondary via-bg-primary/90 to-bg-secondary border-b border-border-custom/60 backdrop-blur-md min-h-[58px] select-none">
            {/* Línea decorativa sutil inferior de tecnología */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent-cyan/20 to-transparent" />

            {/* Izquierda: Logo */}
            <div className="flex items-center gap-2">
                {/* Un pequeño detalle estético: un punto de luz de "sistema activo" */}
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_var(--color-accent-cyan)]" />
                <h1 className="font-titan-one text-xl font-light tracking-[0.2em] bg-linear-to-r from-accent-cyan via-accent-cyan to-accent-purple bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                    STEPWISE
                </h1>
            </div>

            {/* Centro: Info del Nivel Estilizada */}
            <div className="flex items-center justify-center">
                {levelInfo && (
                    <div className="flex items-center gap-3 py-1 px-4 bg-linear-to-r from-accent-cyan/5 via-accent-cyan/10 to-accent-cyan/5 border-x border-accent-cyan/30 rounded-md shadow-[inset_0_0_10px_rgba(34,211,238,0.05)]">
                        <span className="font-jetbrains text-[0.7rem] font-black text-accent-cyan uppercase tracking-[0.15em] border-r border-accent-cyan/20 pr-3">
                            {t('header.level', { id: levelInfo.id })}
                        </span>
                        <span className="font-outfit text-sm font-bold text-text-primary tracking-wide pl-1">
                            {t(`levels.${levelInfo.id}.name`, { defaultValue: levelInfo.name })}
                        </span>
                    </div>
                )}
            </div>

            {/* Derecha: Acciones */}
            <div className="flex items-center gap-2">
                {/* Botón de Idioma */}
                <Button
                    intent="accent"
                    color="cyan"
                    size="sm"
                    onClick={toggleLanguage}
                    className="font-black tracking-wider transition-all duration-300 gap-1.5 min-w-[70px] justify-center"
                >
                    <Languages size={14} strokeWidth={2.5} />
                    <span className="font-jetbrains text-xs">{i18n.language === 'es' ? 'ES' : 'EN'}</span>
                </Button>

                {/* Botón de Niveles */}
                <Button
                    intent="accent"
                    color="purple"
                    size="sm"
                    isActive={showLevelSelect}
                    onClick={() => setShowLevelSelect(!showLevelSelect)}
                    className="font-black tracking-wider transition-all duration-300"
                >
                    <Menu size={14} strokeWidth={2.5} className={showLevelSelect ? "rotate-90 transition-transform duration-300" : "transition-transform duration-300"} />
                    <span>{t('header.levels_btn')}</span>
                </Button>
            </div>
        </header>
    );
};

export default Header;
