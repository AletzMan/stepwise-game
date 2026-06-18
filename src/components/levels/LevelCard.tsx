import React from "react";
import { NavLink } from "react-router";
import { Lock, Star } from "lucide-react";
import { t } from "i18next";
import { DifficultyLevel } from "../../game/types/game";



interface ThemeVariant {
    bg: string;
    shadow: string;
    tag: string;
}

interface DifficultyTheme {
    completed: ThemeVariant;
    unlocked: ThemeVariant;
}

interface LevelCardProps {
    level: number;
    status: "locked" | "unlocked" | "completed";
    stars: number;
    difficulty?: DifficultyLevel;
}

export const LevelCard: React.FC<LevelCardProps> = ({ level, status, stars, difficulty = 1 }) => {
    const isLocked = status === "locked";
    const isCompleted = status === "completed";
    const isUnlocked = status === "unlocked";

    const difficultyThemes: Record<DifficultyLevel, DifficultyTheme> = {
        1: {
            completed: { bg: "bg-cyan-500", shadow: "shadow-[0_4px_0_0_#0891b2] active:shadow-[0_0px_0_0_#0891b2]", tag: "bg-cyan-950/70 text-cyan-100" },
            unlocked: { bg: "bg-cyan-700", shadow: "shadow-[0_4px_0_0_#155e75] active:shadow-[0_0px_0_0_#155e75]", tag: "bg-cyan-950/80 text-cyan-300" },
        },
        2: {
            completed: { bg: "bg-emerald-500", shadow: "shadow-[0_4px_0_0_#059669] active:shadow-[0_0px_0_0_#059669]", tag: "bg-emerald-950/70 text-emerald-100" },
            unlocked: { bg: "bg-emerald-700", shadow: "shadow-[0_4px_0_0_#065f46] active:shadow-[0_0px_0_0_#065f46]", tag: "bg-emerald-950/80 text-emerald-300" },
        },
        3: {
            completed: { bg: "bg-yellow-500", shadow: "shadow-[0_4px_0_0_#ca8a04] active:shadow-[0_0px_0_0_#ca8a04]", tag: "bg-yellow-950/70 text-yellow-100" },
            unlocked: { bg: "bg-yellow-600", shadow: "shadow-[0_4px_0_0_#a16207] active:shadow-[0_0px_0_0_#a16207]", tag: "bg-yellow-950/80 text-yellow-200" },
        },
        4: {
            completed: { bg: "bg-orange-500", shadow: "shadow-[0_4px_0_0_#c2410c] active:shadow-[0_0px_0_0_#c2410c]", tag: "bg-orange-950/70 text-orange-100" },
            unlocked: { bg: "bg-orange-700", shadow: "shadow-[0_4px_0_0_#9a3412] active:shadow-[0_0px_0_0_#9a3412]", tag: "bg-orange-950/80 text-orange-300" },
        },
        5: {
            completed: { bg: "bg-rose-600", shadow: "shadow-[0_4px_0_0_#be123c] active:shadow-[0_0px_0_0_#be123c]", tag: "bg-rose-950/70 text-rose-100" },
            unlocked: { bg: "bg-rose-800", shadow: "shadow-[0_4px_0_0_#9f1239] active:shadow-[0_0px_0_0_#9f1239]", tag: "bg-rose-950/80 text-rose-300" },
        },
    };

    const theme = difficultyThemes[difficulty] || difficultyThemes[1];
    const currentBgTheme = isLocked ? null : isCompleted ? theme.completed : theme.unlocked;
    const currentTag = isLocked ? "bg-zinc-800/50 text-zinc-400" : currentBgTheme?.tag;

    const cardStyles = {
        completed: `${theme.completed.bg} ${theme.completed.shadow} active:translate-y-[4px] hover:scale-[1.02] cursor-pointer`,
        unlocked: `${theme.unlocked.bg} ${theme.unlocked.shadow} active:translate-y-[4px] hover:scale-[1.02] cursor-pointer`,
        locked: "bg-zinc-700 shadow-[0_4px_0_0_#3f3f46] text-zinc-400 opacity-80 cursor-not-allowed"
    };

    const innerClasses = `
        relative flex flex-col justify-between items-center p-2 pt-6 w-full h-full 
        rounded-xl overflow-hidden text-center text-white font-sans
        transition-all duration-150 ease-out select-none 
        ${cardStyles[status]}
    `;

    // Extraemos el contenido para no duplicarlo
    const cardContent = (
        <>
            {!isLocked && (
                <div className="absolute inset-x-0 top-0 h-[40%] bg-linear-to-b from-white/10 to-transparent pointer-events-none" />
            )}

            <span className={`absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider font-sans 
                            rounded-md px-2 py-0.5 min-w-[60px] z-10
                            ${currentTag}`}>
                {t(`levels.status.${status}`)}
            </span>

            <div className="relative flex items-center justify-center w-full my-auto z-10">
                {isLocked ? (
                    <div className="p-3 bg-zinc-800/50 rounded-full border border-zinc-500/20 shadow-inner">
                        <Lock size={22} className="text-zinc-400" strokeWidth={2} />
                    </div>
                ) : (
                    <div className={`
                        w-12 h-12 rounded-full bg-linear-to-b from-black/10 to-black/30 
                        flex items-center justify-center shadow-inner 
                        group-hover:scale-[1.05] transition-transform duration-200
                        ${isUnlocked ? "border border-white/50" : "border border-white/10"}
                    `}>
                        <span className="text-[26px] font-black tracking-tight font-sans drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">
                            {level}
                        </span>
                    </div>
                )}
            </div>

            <div className={`w-full rounded-xl py-1.5 px-2 flex justify-center items-center shadow-inner z-10 
                            ${isLocked ? 'border border-zinc-600/20' : 'bg-black/20 backdrop-blur-sm border border-white/5'}`}>
                <div className="flex gap-1 items-end justify-center h-5">
                    {[0, 1, 2].map((i) => {
                        const isActive = i < stars && !isLocked;
                        const isCenter = i === 1;

                        return (
                            <Star
                                key={i}
                                size={isCenter ? 16 : 13}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={`
                                    transition-all duration-300
                                    ${isCenter ? "mb-0.5" : ""} 
                                    ${isActive
                                        ? "fill-amber-400 text-amber-200 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]"
                                        : "fill-transparent text-white/20"
                                    }
                                `}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );

    return (
        <div className="relative w-32 h-32 pt-1.5 mx-auto select-none group">
            {isLocked ? (
                <div className={innerClasses}>
                    {cardContent}
                </div>
            ) : (
                <NavLink to={`/levels/${level}`} className={innerClasses}>
                    {cardContent}
                </NavLink>
            )}
        </div>
    );
};