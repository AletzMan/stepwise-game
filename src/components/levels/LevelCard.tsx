import React from "react";
import { NavLink } from "react-router";
import { Lock } from "lucide-react";
import { t } from "i18next";

interface LevelCardProps {
    level: number;
    status: "locked" | "unlocked" | "completed";
    stars: number;
}

export const LevelCard: React.FC<LevelCardProps> = ({ level, status, stars }) => {
    const isLocked = status === "locked";
    const isCompleted = status === "completed";

    const cardStyles = {
        // Retoque en la sombra activa para que sea un verde oscuro orgánico en lugar de negro puro
        completed: "bg-lime-600 shadow-[0_4px_0_0_#335505] active:translate-y-[4px] active:shadow-[0_2px_0_0_#1c3002]",
        unlocked: "bg-sky-600 shadow-[0_4px_0_0_#1d4ed8] active:translate-y-[4px] active:shadow-[0_2px_0_0_#1d4ed8]",
        locked: "bg-slate-600 shadow-[0_4px_0_0_#334155] cursor-not-allowed brightness-60"
    };

    return (
        <div className="relative w-32 h-32 pt-1.5 mx-auto select-none group">
            {!isLocked && (
                <div className="absolute inset-0 opacity-30 group-hover:opacity-65 transition-opacity duration-300 pointer-events-none" />
            )}

            <NavLink
                to={!isLocked ? `/levels/${level}` : "#"}
                onClick={(e) => isLocked && e.preventDefault()}
                className={`
                    relative flex flex-col justify-between items-center p-2 pt-6 w-full h-full 
                    rounded-xl overflow-hidden text-center text-white font-sans
                    transition-all duration-150 ease-out select-none 
                    ${cardStyles[status]}
                    ${!isLocked ? "hover:brightness-135 cursor-pointer" : ""} 
                `}
            >
                {!isLocked && (
                    <div className="absolute inset-x-0 top-0 h-[35%] bg-linear-to-b from-white/20 to-transparent pointer-events-none" />
                )}

                {/* Retoque: Template literal limpio para la traducción */}
                <span className={`absolute top-1.5 left-1.5 text-[9px] font-black uppercase tracking-widest font-sans 
                                rounded-full px-2.5 py-0.5 min-w-[65px] border border-white/10 shadow-sm
                                ${status === 'locked' ? 'bg-black/40 text-slate-400' : status === 'completed' ? 'bg-lime-900/90 text-lime-200' : 'bg-sky-900/90 text-sky-200'}`}>
                    {t(`levels.status.${status}`)}
                </span>

                <div className="relative flex items-center justify-center w-full my-auto">
                    {isLocked ? (
                        <div className="p-2.5 bg-black/20 rounded-full border border-white/10 ">
                            <Lock size={21} className="text-slate-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.4)]" strokeWidth={3} />
                        </div>
                    ) : (
                        <div className={`w-10 h-10 rounded-full bg-linear-to-b from-black/10 to-black/30 border-2 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200 ${isCompleted ? 'border-lime-700' : 'border-sky-700'}`}>
                            <span className="text-2xl font-black tracking-tight font-sans drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]">
                                {level}
                            </span>
                        </div>
                    )}
                </div>

                {/* CONTENEDOR DE ESTRELLAS OPTIMIZADO */}
                <div className="w-full bg-black/20 backdrop-blur-xs rounded-xl pt-1.5 pb-2 px-2 flex justify-center items-center shadow-inner border border-white/5">
                    <div className="flex gap-1.5 items-center justify-center h-4">
                        {[0, 1, 2].map((i) => {
                            const isActive = i < stars;
                            const isCenter = i === 1;

                            const animationClass = isActive ? "star-animate" : "";

                            // MEJORA: Si la estrella NO está activa, no se levanta ni se desfasa (mantiene alineación plana y ordenada)
                            const centerClass = isCenter && isActive ? "text-base scale-120 mx-0.5" : "text-sm";
                            const sideClass = !isCenter && isActive ? "pt-3" : "";

                            return (
                                <span
                                    key={i}
                                    className={`
                                        transition-all duration-300 transform
                                        ${animationClass}
                                        ${centerClass}
                                        ${sideClass}
                                        ${isActive
                                            ? "opacity-100 drop-shadow-[0_0_6px_#f59e0b] filter brightness-110"
                                            : "opacity-15 grayscale scale-85 pointer-events-none"
                                        }
                                    `}
                                >
                                    ⭐
                                </span>
                            );
                        })}
                    </div>
                </div>

            </NavLink>
        </div>
    );
};