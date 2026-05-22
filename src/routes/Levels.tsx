import { LEVELS } from "../game/levels";
import { LayoutGrid } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/ui/LanguageToggle";
import { LevelCard } from "../components/layout/levels/LevelCard";
import { NavLink } from "react-router";
import { LogoSteps } from "../components/layout/LogoSteps";

export default function Levels() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-bg-primary relative overflow-hidden flex flex-col items-center select-none px-4 py-12 md:py-16">
            <div className="absolute top-0 left-0 z-10 flex flex-row gap-2 items-center">
                <NavLink
                    to="/"
                    title={t('levels.back')}
                    className="flex flex-row gap-1 items-center"
                >
                    <LogoSteps className="w-20 h-14" />

                    <h1 className="font-['Titan_One'] text-lg bg-linear-to-b from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] w-full wrap-break-word">
                        STEP
                        <span className="bg-linear-to-r from-accent-cyan via-accent-cyan to-accent-purple bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                            WISE
                        </span>
                    </h1>

                </NavLink>
            </div>
            <div className="absolute top-4 right-4 z-10 flex flex-row gap-2 items-center">
                <LanguageToggle />
            </div>
            {/* 🌐 PATRÓN DE FONDO: Cuadrícula tecnológica coherente con la Home */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border-custom)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border-custom)_1px,transparent_1px)] bg-size-[4rem_4rem]"
                style={{ maskImage: 'radial-gradient(circle at center, white 30%, transparent 85%)', WebkitMaskImage: 'radial-gradient(circle at center, white 30%, transparent 85%)' }}
            />

            {/* 💥 DESTELLOS ATMOSFÉRICOS AMORTIGUADOS */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-cyan/5 blur-[150px] rounded-full pointer-events-none" />

            {/* 🖥️ CONTENEDOR PRINCIPAL */}
            <div className="max-w-4xl w-full z-10 animate-slide-up flex flex-col items-center">

                {/* Cabecera de la sección */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-bg-secondary border border-border-custom rounded-full mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                    <LayoutGrid size={12} className="text-accent-cyan" />
                    <span className="font-jetbrains text-[10px] font-bold text-text-secondary tracking-[2px] uppercase">
                        {t('levels.tag')}
                    </span>
                </div>

                {/* TÍTULO DE LA PÁGINA */}
                <h1 className="font-['Titan_One'] text-5xl sm:text-7xl tracking-[3px] bg-linear-to-b from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] mb-2 text-center">
                    {t('levels.title')}
                </h1>

                <p className="font-outfit text-sm sm:text-base text-text-secondary tracking-wide mb-10 md:mb-14 text-center max-w-md leading-relaxed">
                    {t('levels.subtitle')}
                </p>

                {/* 🗺️ MAPA DE SECTORES (GRID TÁCTICA) */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,150px))] gap-4 w-full justify-center">
                    {LEVELS.map((level, index) => {
                        // Simulación de estados para darle dinamismo visual a la UI
                        // (Puedes reemplazar esto luego con tu lógica real de progreso/LocalStorage) 
                        const isUnlocked = index <= 2;
                        const isCompleted = index < 1;

                        return (
                            <LevelCard
                                key={level.id}
                                level={level.id}
                                status={isCompleted ? "completed" : isUnlocked ? "unlocked" : "locked"}
                                stars={index + 1}
                            />
                        );
                    })}
                </div>

            </div>

            {/* Marcos decorativos laterales */}
            <div className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-border-custom to-transparent hidden sm:block" />
            <div className="absolute inset-y-0 right-0 w-px bg-linear-to-b from-transparent via-border-custom to-transparent hidden sm:block" />
        </div>
    );
}