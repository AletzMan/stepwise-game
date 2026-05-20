import { useRef, useState, useEffect, useCallback } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus';
import { Command, LEVELS, LevelData } from './game/levels';
import Header from './components/layout/Header';
import LevelSelectModal from './components/layout/LevelSelectModal';
import LevelCompleteModal from './components/layout/LevelCompleteModal';
import '@fontsource/titan-one';
import Button from './components/ui/Button';
import CommandButton from './components/ui/CommandButton';
import { Play, Square, ArrowUp, CornerUpLeft, CornerUpRight, ArrowRight, Pickaxe, Box, EraserIcon } from 'lucide-react';
import LevelErrorModal from './components/layout/LevelErrorModel';
import { useTranslation } from 'react-i18next';

// Configuración de visualización de comandos
const COMMAND_CONFIG: Record<Command, { label: string; icon: React.ReactNode; color: string }> = {
    WALK: { label: 'Walk', icon: <ArrowRight size={16} strokeWidth={3} />, color: '#22d3ee' },
    JUMP: { label: 'Jump', icon: <ArrowUp size={16} strokeWidth={3} />, color: '#a78bfa' },
    TURN_LEFT: { label: 'Left', icon: <CornerUpLeft size={16} strokeWidth={3} />, color: '#fbbf24' },
    TURN_RIGHT: { label: 'Right', icon: <CornerUpRight size={16} strokeWidth={3} />, color: '#fb923c' },
    ACTIVATE: { label: 'Pick', icon: <Pickaxe size={16} strokeWidth={0} fill='currentColor' />, color: '#34d399' },
    F1: { label: 'F1', icon: <Box size={16} strokeWidth={3} />, color: '#f472b6' },
    F2: { label: 'F2', icon: <Box size={16} strokeWidth={3} />, color: '#c084fc' },
    F3: { label: 'F3', icon: <Box size={16} strokeWidth={3} />, color: '#67e8f9' },
};



type ProgramSlot = 'main' | 'f1' | 'f2' | 'f3';

function App() {
    const { t } = useTranslation();
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [levelInfo, setLevelInfo] = useState<LevelData | null>(null);
    const [mainQueue, setMainQueue] = useState<Command[]>([]);
    const [f1Queue, setF1Queue] = useState<Command[]>([]);
    const [f2Queue, setF2Queue] = useState<Command[]>([]);
    const [f3Queue, setF3Queue] = useState<Command[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [activeSlot, setActiveSlot] = useState<ProgramSlot>('main');
    const [executionStack, setExecutionStack] = useState<{ slot: ProgramSlot; index: number }[]>([]);
    const [showLevelSelect, setShowLevelSelect] = useState(false);
    const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
    const [speed, setSpeed] = useState<number>(1);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
    const [showStatusLevel, setShowStatusLevel] = useState(false);
    const [showErrorLevel, setShowErrorLevel] = useState(false);
    const [stars, setStars] = useState<number>(0); // Numero de estrellas ganadas en el nivel actual 
    const executedCommands = useRef<number>(0); // Numero total de comandos ejecutados en el nivel actual

    const getStatusText = useCallback((status: string) => {
        if (status === 'incomplete') {
            return t('app.program_finished_incomplete');
        }
        if (status.startsWith('error:')) {
            const err = status.substring(6);
            return t('app.error_prefix', { message: t(`errors.${err}`, { defaultValue: err }) });
        }
        if (status === 'running') {
            return t('app.running_program');
        }
        if (status === 'description' && levelInfo) {
            return t(`levels.${levelInfo.id}.description`, { defaultValue: levelInfo.description });
        }
        return status;
    }, [t, levelInfo]);

    // Escuchar eventos desde Phaser
    useEffect(() => {
        const onLevelLoaded = (info: LevelData) => {
            setLevelInfo(info);
            setMainQueue([]);
            setF1Queue([]);
            setF2Queue([]);
            setF3Queue([]);
            setIsRunning(false);
            setExecutionStack([]);
            setStatusMessage('description');
            setStatusType('info');
        };

        const onExecutionStart = () => {
            setIsRunning(true);
            setStatusMessage('running');
            setStatusType('info');
            executedCommands.current = 0;
            setExecutionStack([]);
        };

        const onExecutionStep = (data: { command: Command; index: number; depth: number; stack?: { slot: ProgramSlot; index: number }[] }) => {
            executedCommands.current++;
            if (data.stack) {
                setExecutionStack(data.stack);
            }
        };

        const onLevelComplete = (levelId: number) => {
            setCompletedLevels(prev => new Set([...prev, levelId]));
            setStatusMessage('🎉 Level Complete!');
            setStatusType('success');
            setTimeout(() => {
                setShowStatusLevel(true);
                setStars(calculateStars(levelId, executedCommands.current));
            }, 500);
            setIsRunning(false);
            setExecutionStack([]);
        };

        const onExecutionComplete = (data: { success: boolean; message: string }) => {
            if (!data.success) {
                setStatusMessage('incomplete');
                setStatusType('error');
                setTimeout(() => {
                    setShowErrorLevel(true);
                }, 500);
            }
            setIsRunning(false);
            setExecutionStack([]);
        };

        const onExecutionFail = (message: string) => {
            setStatusMessage(`error:${message}`);
            setStatusType('error');
            setIsRunning(false);
            setExecutionStack([]);
            setTimeout(() => {
                setShowErrorLevel(true);
            }, 500);
        };

        const onExecutionEnd = () => {
            setIsRunning(false);
            setExecutionStack([]);
        };

        EventBus.on('level-loaded', onLevelLoaded);
        EventBus.on('execution-start', onExecutionStart);
        EventBus.on('execution-step', onExecutionStep);
        EventBus.on('level-complete', onLevelComplete);
        EventBus.on('execution-complete', onExecutionComplete);
        EventBus.on('execution-fail', onExecutionFail);
        EventBus.on('execution-end', onExecutionEnd);

        return () => {
            EventBus.removeListener('level-loaded', onLevelLoaded);
            EventBus.removeListener('execution-start', onExecutionStart);
            EventBus.removeListener('execution-step', onExecutionStep);
            EventBus.removeListener('level-complete', onLevelComplete);
            EventBus.removeListener('execution-complete', onExecutionComplete);
            EventBus.removeListener('execution-fail', onExecutionFail);
            EventBus.removeListener('execution-end', onExecutionEnd);
        };
    }, []);

    useEffect(() => {
        EventBus.emit('set-speed', speed);
    }, [speed]);

    const getQueue = useCallback((slot: ProgramSlot) => {
        switch (slot) {
            case 'main': return mainQueue;
            case 'f1': return f1Queue;
            case 'f2': return f2Queue;
            case 'f3': return f3Queue;
        }
    }, [mainQueue, f1Queue, f2Queue, f3Queue]);

    const getMaxSlots = useCallback((slot: ProgramSlot) => {
        if (!levelInfo) return 0;
        switch (slot) {
            case 'main': return levelInfo.mainSlots;
            case 'f1': return levelInfo.f1Slots;
            case 'f2': return levelInfo.f2Slots;
            case 'f3': return levelInfo.f3Slots;
        }
    }, [levelInfo]);

    const setQueue = useCallback((slot: ProgramSlot, queue: Command[]) => {
        switch (slot) {
            case 'main': setMainQueue(queue); break;
            case 'f1': setF1Queue(queue); break;
            case 'f2': setF2Queue(queue); break;
            case 'f3': setF3Queue(queue); break;
        }
    }, []);

    const addCommand = (cmd: Command) => {
        if (isRunning) return;
        const queue = getQueue(activeSlot);
        const maxSlots = getMaxSlots(activeSlot);
        if (queue.length < maxSlots) {
            setQueue(activeSlot, [...queue, cmd]);
        }
    };

    const removeCommand = (slot: ProgramSlot, index: number) => {
        if (isRunning) return;
        const queue = [...getQueue(slot)];
        queue.splice(index, 1);
        setQueue(slot, queue);
    };

    const calculateStars = (levelId: number, commands: number): number => {
        const level = LEVELS.find(l => l.id === levelId);
        if (!level) return 0;

        const excess = commands - level.goalCommands;
        if (excess <= 0) return 3;

        const pct = excess / level.goalCommands;
        if (pct <= 0.5) return 2;

        return 1;
    };

    const clearQueue = (slot: ProgramSlot) => {
        if (isRunning) return;
        setQueue(slot, []);
    };

    const handleRun = () => {
        if (isRunning || mainQueue.length === 0) return;
        EventBus.emit('run-program', {
            main: mainQueue,
            f1: f1Queue,
            f2: f2Queue,
            f3: f3Queue,
        });
    };

    const handleStop = () => {
        EventBus.emit('stop-program');
        setIsRunning(false);
        setExecutionStack([]);
    };

    const handleReset = () => {
        EventBus.emit('reset-level');
        setIsRunning(false);
        setExecutionStack([]);
        setStatusMessage('description');
        setStatusType('info');
        setShowStatusLevel(false);
        setShowErrorLevel(false);
    };

    const handleLoadLevel = (levelId: number) => {
        EventBus.emit('load-level', levelId);
        setShowLevelSelect(false);
        setShowStatusLevel(false);
        setShowErrorLevel(false);
    };

    const currentScene = (_scene: Phaser.Scene) => {
        // No-op for now
    };

    // Filtrar comandos: no mostrar F1/F2/F3 en sus propios paneles para evitar la recursión directa
    const getAvailableCommandsForSlot = (slot: ProgramSlot): Command[] => {
        if (!levelInfo) return [];
        return levelInfo.availableCommands.filter(cmd => {
            if (slot === 'f1' && cmd === 'F1') return false;
            if (slot === 'f2' && cmd === 'F2') return false;
            if (slot === 'f3' && cmd === 'F3') return false;
            // Don't show function commands if the function has 0 slots
            if (cmd === 'F1' && levelInfo.f1Slots === 0) return false;
            if (cmd === 'F2' && levelInfo.f2Slots === 0) return false;
            if (cmd === 'F3' && levelInfo.f3Slots === 0) return false;
            return true;
        });
    };

    const renderQueue = (slot: ProgramSlot, label: string, color: string) => {
        const queue = getQueue(slot);
        const maxSlots = getMaxSlots(slot);
        if (maxSlots === 0) return null;

        const isActive = activeSlot === slot;

        return (
            <div
                className={`p-3 bg-bg-secondary/60 border rounded-sm cursor-pointer transition-all duration-300 select-none queue-sec-hover
                ${isActive
                        ? 'border-(--queue-color)/40 bg-linear-to-b from-bg-secondary to-bg-tertiary/80 shadow-[0_4px_20px_-5px_color-mix(in_srgb,var(--queue-color)_15%,transparent)]'
                        : 'border-border-custom/50 hover:border-border-custom'
                    } ${isActive ? 'active' : ''}`}
                onClick={() => !isRunning && setActiveSlot(slot)}
                style={{ '--queue-color': color } as React.CSSProperties}
            >
                {/* Header de la Secuencia */}
                <div className="flex items-center gap-2 mb-2.5">
                    {/* Indicador de Activación visual */}
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-(--queue-color) shadow-[0_0_8px_var(--queue-color)]' : 'bg-text-muted/30'}`} />

                    <span className="font-jetbrains text-[0.7rem] font-black uppercase tracking-[0.15em] text-(--queue-color)">
                        {label}
                    </span>

                    <span className="font-jetbrains text-[0.65rem] font-bold text-text-secondary/80 bg-bg-tertiary/60 px-1.5 py-0.5 rounded-md border border-border-custom/30 ml-auto">
                        {queue.length}<span className="text-text-muted/50 mx-0.5">/</span>{maxSlots}
                    </span>

                    {!isRunning && queue.length > 0 && (
                        <Button
                            intent="ghost"
                            color="red"
                            size="none"
                            className="w-5 h-5 rounded-md text-[10px] hover:bg-accent-red/20 hover:text-accent-red transition-colors flex items-center justify-center font-black"
                            onClick={(e) => { e.stopPropagation(); clearQueue(slot); }}
                        >
                            ✕
                        </Button>
                    )}
                </div>

                {/* Grilla de Slots */}
                <div className="flex flex-wrap gap-1.5 p-1 bg-black/15 border border-black/10 rounded-md">
                    {Array.from({ length: maxSlots }).map((_, i) => {
                        const cmd = queue[i];
                        const isHighlighted = isRunning && executionStack.some(frame => frame.slot === slot && frame.index === i);

                        return (
                            <div
                                key={i}
                                className={`w-9 h-9 flex items-center justify-center rounded-sm transition-all duration-200 relative cursor-pointer
                                ${cmd
                                        ? 'bg-(--cmd-color)/5 border border-b-[3px] border-(--cmd-color)/20 cmd-btn-hover active:translate-y-px active:border-b'
                                        : 'bg-black/20 border border-dashed border-border-custom/30 hover:border-border-custom/60'
                                    } 
                                ${isHighlighted
                                        ? 'animate-pulse-glow border-(--cmd-color)! bg-linear-to-t from-(--cmd-color)/15 to-transparent scale-105 z-10 shadow-[0_0_15px_color-mix(in_srgb,var(--cmd-color)_40%,transparent)]'
                                        : isRunning && 'grayscale opacity-40 scale-95'
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (cmd && !isRunning) removeCommand(slot, i);
                                }}
                                style={cmd ? { '--cmd-color': COMMAND_CONFIG[cmd].color } as React.CSSProperties : {}}
                            >
                                {/* Reflejo cristalino sutil si el slot tiene un comando */}
                                {cmd && (
                                    <div className="absolute inset-x-0 top-0 h-[35%] bg-white/5 rounded-t-sm pointer-events-none" />
                                )}

                                {cmd ? (
                                    <span className="slot-icon text-lg text-(--cmd-color) leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:scale-110">
                                        {COMMAND_CONFIG[cmd].icon} </span>
                                ) : (
                                    <span className="text-[0.75rem] font-bold text-text-muted/20 select-none transition-colors group-hover:text-text-muted/40">+</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };
    return (
        <div id="app" className="w-full h-screen flex justify-center items-center">
            <div className="flex flex-col w-full max-w-[1280px] h-screen p-2 gap-2">
                {/* Encabezado */}
                <Header
                    levelInfo={levelInfo}
                    showLevelSelect={showLevelSelect}
                    setShowLevelSelect={setShowLevelSelect}
                />

                {/* Superposición de selección de nivel */}
                {showLevelSelect && (
                    <LevelSelectModal
                        levelInfo={levelInfo}
                        completedLevels={completedLevels}
                        setShowLevelSelect={setShowLevelSelect}
                        handleLoadLevel={handleLoadLevel}
                    />
                )}

                {/* Superposición de estado del nivel */}
                {showStatusLevel && (
                    <LevelCompleteModal
                        levelInfo={levelInfo}
                        statusType={statusType}
                        stars={stars}
                        executedCommands={executedCommands}
                        setShowStatusLevel={setShowStatusLevel}
                        setStatusType={setStatusType}
                        handleLoadLevel={handleLoadLevel}
                    />
                )}

                {/* Superposición en caso de error*/}
                {showErrorLevel && (
                    <LevelErrorModal
                        message={getStatusText(statusMessage)}
                        show={showErrorLevel}
                        setShowStatusLevel={setShowStatusLevel}
                        handleRetryLevel={() => handleLoadLevel(levelInfo?.id || 0)}
                        onGoToMenu={() => handleLoadLevel(0)}
                    />
                )}

                {/* Contenido principal */}
                <div className="flex flex-col min-[901px]:flex-row gap-2 flex-1 min-h-0">
                    {/* Lienzo de Phaser (Canvas) */}
                    <div className="flex-1 rounded-sm overflow-hidden border border-border-custom bg-bg-secondary flex items-center justify-center max-[900px]:min-h-[300px]">
                        <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
                    </div>

                    {/* Panel de programación */}
                    <div className="w-[324px] max-[900px]:w-full flex flex-col gap-2 min-h-0 max-[900px]:max-h-[45vh]">
                        {/* Barra de estado */}
                        {/*<div className={`py-2.5 px-4 rounded-sm border transition-all duration-300 ${statusType === 'info' ? 'border-accent-cyan/20 bg-accent-cyan/5' : statusType === 'success' ? 'border-accent-green/40 bg-accent-green/8 shadow-[0_0_20px_rgba(52,211,153,0.1)]' : 'border-accent-red/30 bg-accent-red/6'}`}>
                            <span className={`text-[0.8rem] font-normal leading-[1.4] ${statusType === 'info' ? 'text-text-secondary' : statusType === 'success' ? 'text-accent-green font-semibold' : 'text-accent-red'}`}>{statusMessage}</span>
                        </div>*/}

                        {/* Paleta de comandos */}
                        <div className="p-3 bg-linear-to-br from-bg-secondary to-bg-tertiary border border-border-custom rounded-sm">
                            <div className="font-jetbrains text-[0.65rem] font-semibold uppercase tracking-[2px] text-text-muted mb-2.5">
                                {t('app.commands_title')}
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                                {getAvailableCommandsForSlot(activeSlot).map(cmd => {
                                    const config = COMMAND_CONFIG[cmd];
                                    return (
                                        <CommandButton
                                            key={cmd}
                                            className="w-full"
                                            style={{ '--cmd-color': config.color } as React.CSSProperties}
                                            onClick={() => addCommand(cmd)}
                                            disabled={isRunning}
                                        >
                                            <span className="text-[1.2rem] leading-none text-(--cmd-color) font-bold">{config.icon}</span>
                                            <span className="text-[0.6rem] font-semibold text-(--cmd-color) uppercase tracking-[0.5px]">
                                                {t(`commands.${cmd}`, { defaultValue: config.label })}
                                            </span>
                                        </CommandButton>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Colas de instrucciones */}
                        <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto min-h-0 queues-scrollbar">
                            {renderQueue('main', t('app.queues.main'), '#22d3ee')}
                            {renderQueue('f1', t('app.queues.f1'), '#f472b6')}
                            {renderQueue('f2', t('app.queues.f2'), '#c084fc')}
                            {renderQueue('f3', t('app.queues.f3'), '#67e8f9')}
                        </div>

                        {/* Botones de control */}
                        <div className="flex flex-col gap-3 p-3 bg-bg-tertiary border border-border-custom rounded-sm">
                            <div className="flex items-center justify-between py-1 px-2 bg-black/20 rounded-sm">
                                <span className="font-jetbrains text-[0.65rem] font-semibold uppercase text-text-muted">
                                    {t('app.speed')}
                                </span>
                                <div className="flex gap-1">
                                    {[0.5, 1, 2].map(s => (
                                        <Button
                                            key={s}
                                            intent={speed === s ? "solid" : "ghost"}
                                            color={speed === s ? "green" : "cyan"}
                                            size="none"
                                            className="py-1 px-2.5 text-[0.7rem] font-jetbrains rounded-xs! shadow-none"
                                            onClick={() => setSpeed(s)}
                                        >
                                            {s === 0.5 ? '0.5x' : s === 1 ? '1x' : '2x'}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 p-1 bg-black/10 border border-border-custom/20 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                                {!isRunning ? (
                                    <Button
                                        intent="solid"
                                        color="green"
                                        size="md"
                                        className="flex-1 font-black text-sm tracking-widest rounded-lg shadow-[0_4px_15px_color-mix(in_srgb,var(--color-accent-green)_30%,transparent)]"
                                        onClick={handleRun}
                                        disabled={mainQueue.length === 0}
                                    >
                                        <Play size={18} strokeWidth={3} className="fill-bg-primary stroke-bg-primary" />
                                        <span>{t('app.btn_run')}</span>
                                    </Button>
                                ) : (
                                    <Button
                                        intent="solid"
                                        color="red"
                                        size="md"
                                        className="flex-1 font-black text-sm tracking-widest rounded-lg animate-pulse shadow-[0_4px_15px_color-mix(in_srgb,var(--color-accent-red)_30%,transparent)]"
                                        onClick={handleStop}
                                    >
                                        <Square size={18} strokeWidth={3} className="fill-white" />
                                        <span>{t('app.btn_stop')}</span>
                                    </Button>
                                )}

                                <Button
                                    intent="solid"
                                    color="yellow"
                                    size="md"
                                    className="flex-1 font-black text-sm tracking-widest rounded-lg shadow-[0_4px_15px_color-mix(in_srgb,var(--color-accent-yellow)_30%,transparent)]"
                                    onClick={handleReset}
                                >
                                    <EraserIcon size={18} strokeWidth={3} />
                                    <span>{t('app.btn_clear')}</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default App;
