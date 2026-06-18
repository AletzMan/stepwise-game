import { LEVELS } from "../game/levels";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/ui/LanguageToggle";
import { LevelCard } from "../components/levels/LevelCard";
import { NavLink } from "react-router";
import { LogoSteps } from "../components/layout/LogoSteps";
import { useGameStore } from "../store/gameStore";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DifficultyLevel } from "../game/types/game";

const DIFFICULTY = [
    { id: 1, label: "easy" },
    { id: 2, label: "medium" },
    { id: 3, label: "hard" },
    { id: 4, label: "expert" },
    { id: 5, label: "legend" }
];
export default function Levels() {
    const { t } = useTranslation();
    const levels = useGameStore((state) => state.levels);
    const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>(1);
    const [direction, setDirection] = useState(0);

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
            {/*  PATRÓN DE FONDO: Cuadrícula tecnológica coherente con la Home */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border-custom)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border-custom)_1px,transparent_1px)] bg-size-[4rem_4rem]"
                style={{ maskImage: 'radial-gradient(circle at center, white 30%, transparent 85%)', WebkitMaskImage: 'radial-gradient(circle at center, white 30%, transparent 85%)' }}
            />

            {/* DESTELLOS ATMOSFÉRICOS AMORTIGUADOS */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-cyan/5 blur-[150px] rounded-full pointer-events-none" />

            {/* CONTENEDOR PRINCIPAL */}
            <div className="max-w-4xl w-full z-10 animate-slide-up flex flex-col items-center">
                {/* TÍTULO DE LA PÁGINA */}
                <h1 className="font-['Titan_One'] text-4xl md:text-7xl tracking-[3px] bg-linear-to-b from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]  text-center">
                    {t('levels.title')}
                </h1>

                <p className="font-outfit text-sm md:text-base text-text-secondary tracking-wide mb-2 md:mb-14 text-center max-w-md leading-relaxed">
                    {t('levels.subtitle')}
                </p>
                <div className="flex items-center justify-center gap-4 md:gap-6 mb-4 md:mb-10">
                    <button
                        disabled={currentDifficulty <= 1}
                        onClick={() => {
                            setDirection(-1);
                            setCurrentDifficulty((prev) => (prev - 1) as DifficultyLevel);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 w-28 sm:w-32 text-xs md:text-sm font-jetbrains font-bold tracking-wider text-text-secondary bg-bg-secondary/40 backdrop-blur-md border border-border-custom rounded-full hover:border-accent-cyan hover:text-accent-cyan hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:-translate-x-1 transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ChevronLeft size={16} />
                        {t('levels.previous')}
                    </button>

                    <div className="w-32 sm:w-44 flex justify-center">
                        <span className="font-['Titan_One'] text-xl sm:text-2xl tracking-[2px] uppercase bg-linear-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                            {t('levels.difficulty.' + DIFFICULTY[currentDifficulty - 1].label)}
                        </span>
                    </div>

                    <button
                        disabled={currentDifficulty >= DIFFICULTY.length}
                        onClick={() => {
                            setDirection(1);
                            setCurrentDifficulty((prev) => (prev + 1) as DifficultyLevel);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 w-28 sm:w-32 text-xs md:text-sm font-jetbrains font-bold tracking-wider text-text-secondary bg-bg-secondary/40 backdrop-blur-md border border-border-custom rounded-full hover:border-accent-cyan hover:text-accent-cyan hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:translate-x-1 transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                        {t('levels.next')}
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* MAPA DE SECTORES (GRID TÁCTICA) */}
                <div className="relative w-full h-[calc(100svh-210px)] md:h-[calc(100svh-350px)] overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentDifficulty}
                            custom={direction}
                            variants={{
                                enter: (dir: number) => ({
                                    x: dir > 0 ? 200 : -200,
                                    opacity: 0
                                }),
                                center: {
                                    x: 0,
                                    opacity: 1
                                },
                                exit: (dir: number) => ({
                                    x: dir > 0 ? -200 : 200,
                                    opacity: 0
                                })
                            }}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="grid grid-cols-[repeat(auto-fit,minmax(128px,128px))] grid-rows-[repeat(auto-fit,minmax(128px,128px))] gap-2 md:gap-4 p-1 w-full justify-center items-center h-full overflow-y-auto"
                        >
                            {currentDifficulty > 4 && (
                                <div className="col-span-full row-span-full bg-bg-secondary border border-border-custom rounded-sm p-4 mt-10 flex flex-col gap-4">
                                    <h1 className="font-['Titan_One'] text-center  text-lg bg-linear-to-b from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] w-full wrap-break-word">
                                        {t('levels.noMoreLevels')}
                                    </h1>
                                    <p className="font-outfit text-sm md:text-base text-text-secondary tracking-wide mb-2 md:mb-14 text-center max-w-md leading-relaxed">
                                        {t('levels.moreLevels').split('.')[0]}
                                    </p>
                                    <span className="font-['Titan_One'] text-center  text-lg bg-linear-to-b from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] w-full wrap-break-word">{t('levels.moreLevels').split('.')[1]}</span>

                                </div>
                            )}
                            {LEVELS.slice((currentDifficulty - 1) * 10, currentDifficulty * 10).map((level, index) => {
                                const status = levels.find(l => l.id === level.id)?.status || 'locked';



                                return (
                                    <LevelCard
                                        key={level.id}
                                        level={level.id}
                                        status={index === 0 && status !== 'completed' ? 'unlocked' : status}
                                        stars={levels.find(l => l.id === level.id)?.stars || 0}
                                        difficulty={currentDifficulty}
                                    />
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>

            {/* Marcos decorativos laterales */}
            <div className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-border-custom to-transparent hidden sm:block" />
            <div className="absolute inset-y-0 right-0 w-px bg-linear-to-b from-transparent via-border-custom to-transparent hidden sm:block" />
        </div>
    );
}