import { NavLink } from "react-router";
import { Play, CodeXml } from "lucide-react";
import { LogoSteps } from "../components/layout/LogoSteps";

export default function Home() {
    return (
        <div className="min-h-screen bg-bg-primary relative overflow-hidden flex items-center justify-center select-none py-12">

            {/*   PATRÓN DE FONDO: Cuadrícula tecnológica sutil */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border-custom)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border-custom)_1px,transparent_1px)] bg-size-[4rem_4rem]"
                style={{ maskImage: 'radial-gradient(circle at center, white 30%, transparent 80%)', WebkitMaskImage: 'radial-gradient(circle at center, white 30%, transparent 80%)' }}
            />

            {/*  DESTELLOS ATMOSFÉRICOS */}
            <div className="absolute -top-40 -left-40 w-72 h-72 md:w-96 md:h-96 bg-accent-purple/5 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-72 h-72 md:w-96 md:h-96 bg-accent-cyan/5 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />

            {/* 📐 MARCOS DE INTERFAZ DE CIENCIA FICCIÓN: Ocultos en móvil (`hidden md:flex`) para evitar colisiones */}

            <div className="absolute bottom-6 left-6 font-jetbrains text-[10px] text-text-muted tracking-[3px] hidden md:flex items-center gap-2">
                <CodeXml size={12} className="text-accent-orange" />
                <span>© 2026 // CORE_BY: A. GARCÍA ALONSO</span>
            </div>


            {/*   CONTENEDOR CENTRAL */}
            <div className="max-w-3xl w-full text-center px-6 z-10 animate-slide-up flex flex-col items-center">

                {/* Microetiqueta superior */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-bg-secondary border border-border-custom rounded-full mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.3)] max-w-full">
                    <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-accent-green animate-pulse" />
                    <span className="font-jetbrains text-[9px] sm:text-[10px] font-bold text-text-secondary tracking-[1.5px] sm:tracking-[2px] uppercase truncate">
                        Isometric Logic Game
                    </span>
                </div>

                {/*  */}
                <LogoSteps className="w-40 h-40" />
                {/* LOGO DE STEPWISE (Escalado de text-5xl en móvil a text-9xl en escritorio) */}
                <h1 className="font-['Titan_One'] text-4xl sm:text-6xl md:text-8xl tracking-[2px] sm:tracking-[4px] bg-linear-to-b from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] mb-4 w-full wrap-break-word">
                    STEP
                    <span className="bg-linear-to-r from-accent-cyan via-accent-cyan to-accent-purple bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                        WISE
                    </span>
                </h1>

                {/* Subtítulo (Ajuste de text-base a text-xl y márgenes optimizados) */}
                <p className="font-outfit text-base md:text-xl text-text-secondary max-w-xl mx-auto mb-10 md:mb-14 tracking-wide leading-relaxed balance">
                    Un paso a la vez. Piensa la lógica, ordena tus comandos y supera los obstáculos para encontrar la ruta perfecta hacia la meta.
                </p>

                {/*  BOTÓN: Estilo simplificado similar a Button accent */}
                <NavLink
                    to="/levels"
                    className="
                        relative flex items-center justify-center gap-3 sm:gap-4 px-8 sm:px-14 py-4 sm:py-5 w-full sm:w-auto
                        font-outfit font-black text-lg sm:text-2xl tracking-wider text-accent-cyan uppercase
                        bg-accent-cyan/10 border border-accent-cyan/30 rounded-sm border-b-4
                        overflow-hidden transition-all duration-200 ease-out
                        hover:bg-accent-cyan/20 hover:border-accent-cyan hover:border-b-4 hover:translate-y-[-2px]
                        hover:shadow-[0_0_16px_rgba(34,211,238,0.4)]
                        active:translate-y-[2px] active:border-b-2
                    "
                >
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-accent-cyan stroke-accent-cyan transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-sm sm:text-2xl font-black tracking-wide">
                        INICIAR
                    </span>
                </NavLink>

            </div>

            {/* Marcos laterales finos (Ocultos en pantallas muy pequeñas) */}
            <div className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-border-custom to-transparent hidden sm:block" />
            <div className="absolute inset-y-0 right-0 w-px bg-linear-to-b from-transparent via-border-custom to-transparent hidden sm:block" />
        </div>
    );
}