import React from "react";
import { NavLink } from "react-router";
import { CheckCircle2, Lock, UnlockIcon } from "lucide-react";
import { t } from "i18next";

interface LevelCardProps {
    level: number;
    status: "locked" | "unlocked" | "completed";
    stars: number;
}

export const LevelCard: React.FC<LevelCardProps> = ({ level, status, stars }) => {
    return (
        <div className="relative group">
            {status !== "locked" && (
                <div className="absolute inset-0 bg-linear-to-r from-accent-cyan/0 to-accent-purple/0 group-hover:from-accent-cyan/10 group-hover:to-accent-purple/10 rounded-md blur-md transition-all duration-300 pointer-events-none" />
            )}

            <NavLink
                to={status !== "locked" ? `/levels/${level}` : "#"}
                onClick={(e) => status === "locked" && e.preventDefault()}
                className={`
                                        relative flex flex-col  gap-2 p-2 h-37.5 w-full
                                        bg-bg-secondary border rounded-sm overflow-hidden
                                        transition-all duration-300 ease-out select-none
                                        ${status !== "locked"
                        ? 'border-border-custom/80 hover:border-accent-cyan/20 cursor-pointer active:scale-98 hover:shadow-[0_3px_10px_rgba(34,211,238,0.04)]'
                        : 'border-border-custom/30 cursor-not-allowed'
                    }
                                    `}
            >
                {/* Capa de brillo reflectivo superior interna */}
                {status !== "locked" && (
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-transparent via-accent-cyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}


                <span className="font-jetbrains text-[10px] text-center font-bold text-text-muted tracking-wider uppercase">
                    SEC_0{level}
                </span>


                {/* Contenedor de Estrellas Original e Idéntico en Estructura */}
                <div className="relative flex justify-center">
                    {/* Fondo apagado original */}
                    <div className="flex gap-1 text-xl">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className={`scale-90 opacity-15 grayscale brightness-50 ${i !== 1 ? 'pt-2' : ''}`}>
                                ⭐
                            </div>
                        ))}
                    </div>
                    {/* Estrellas activas originales con tu clase .star-animate intacta */}
                    <div className="absolute inset-0 flex justify-center gap-1 text-xl drop-shadow-[0_0_12px_rgba(250,204,21,0.35)]">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="star-animate"
                                style={{ opacity: i < stars ? 1 : 0 }}
                            >
                                <div  >
                                    ⭐
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bloque Inferior: Nombre del Nivel */}
                <div className="text-center">
                    <h3 className={`font-outfit font-black text-xs h-8 tracking-wide uppercase transition-colors duration-300 ${status !== "locked" ? 'text-text-primary group-hover:text-accent-cyan' : 'text-text-muted'}`}>
                        {t(`levels.${level}.name`)}
                    </h3>
                </div>

                {/* Bloque Superior: Identificador Técnico y Estado */}
                <div className="flex items-center justify-center w-full">

                    {/* Iconografía de Estado */}
                    {status === "completed" && (
                        <div className="flex items-center justify-center gap-1 text-accent-green font-jetbrains text-[9px] font-bold tracking-wider">
                            <CheckCircle2 size={16} strokeWidth={2.5} />
                        </div>
                    )}
                    {status === "unlocked" && (
                        <div className="flex items-center justify-center gap-1 text-accent-cyan font-jetbrains text-[9px] font-bold tracking-wider animate-pulse">
                            <UnlockIcon size={16} strokeWidth={2.5} />
                        </div>
                    )}
                    {status === "locked" && (
                        <div className="flex items-center justify-center gap-1 text-text-muted font-jetbrains text-[9px] font-bold tracking-wider">
                            <Lock size={16} className="text-text-muted" strokeWidth={2.5} />
                        </div>
                    )}
                </div>
            </NavLink>
        </div>
    );
};