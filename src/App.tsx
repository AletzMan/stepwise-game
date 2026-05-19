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
import { Play, BrushCleaning, Square, ArrowUp, CornerUpLeft, CornerUpRight, ArrowRight, Pickaxe, FunctionSquare } from 'lucide-react';

// Configuración de visualización de comandos
const COMMAND_CONFIG: Record<Command, { label: string; icon: React.ReactNode; color: string }> = {
    WALK: { label: 'Walk', icon: <ArrowRight size={16} />, color: '#22d3ee' },
    JUMP: { label: 'Jump', icon: <ArrowUp size={16} />, color: '#a78bfa' },
    TURN_LEFT: { label: 'Left', icon: <CornerUpLeft size={16} />, color: '#fbbf24' },
    TURN_RIGHT: { label: 'Right', icon: <CornerUpRight size={16} />, color: '#fb923c' },
    ACTIVATE: { label: 'Act', icon: <Pickaxe size={16} />, color: '#34d399' },
    F1: { label: 'F1', icon: <span className='font-jetbrains text-xs'>ƒ1</span>, color: '#f472b6' },
    F2: { label: 'F2', icon: <span className='font-jetbrains text-xs'>ƒ2</span>, color: '#c084fc' },
    F3: { label: 'F3', icon: <span className='font-jetbrains text-xs'>ƒ3</span>, color: '#67e8f9' },
};



type ProgramSlot = 'main' | 'f1' | 'f2' | 'f3';

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [levelInfo, setLevelInfo] = useState<LevelData | null>(null);
    const [mainQueue, setMainQueue] = useState<Command[]>([]);
    const [f1Queue, setF1Queue] = useState<Command[]>([]);
    const [f2Queue, setF2Queue] = useState<Command[]>([]);
    const [f3Queue, setF3Queue] = useState<Command[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [activeSlot, setActiveSlot] = useState<ProgramSlot>('main');
    const [currentStep, setCurrentStep] = useState<number>(-1);
    const [currentDepth, setCurrentDepth] = useState<number>(0);
    const [showLevelSelect, setShowLevelSelect] = useState(false);
    const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
    const [speed, setSpeed] = useState<number>(0.5);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
    const [showStatusLevel, setShowStatusLevel] = useState(false);
    const [stars, setStars] = useState<number>(0); // Numero de estrellas ganadas en el nivel actual 
    const executedCommands = useRef<number>(0); // Numero total de comandos ejecutados en el nivel actual

    // Escuchar eventos desde Phaser
    useEffect(() => {
        const onLevelLoaded = (info: LevelData) => {
            setLevelInfo(info);
            setMainQueue([]);
            setF1Queue([]);
            setF2Queue([]);
            setF3Queue([]);
            setIsRunning(false);
            setCurrentStep(-1);
            setStatusMessage(info.description);
            setStatusType('info');
        };

        const onExecutionStart = () => {
            setIsRunning(true);
            setStatusMessage('Running program...');
            setStatusType('info');
            executedCommands.current = 0;
        };

        const onExecutionStep = (data: { command: Command; index: number; depth: number }) => {
            executedCommands.current++;
            setCurrentStep(data.index);
            setCurrentDepth(data.depth);
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
        };

        const onExecutionComplete = (data: { success: boolean; message: string }) => {
            if (!data.success) {
                setStatusMessage('Program finished — not all goals activated');
                setStatusType('error');
            }
            setIsRunning(false);
        };

        const onExecutionFail = (message: string) => {
            setStatusMessage(`Error: ${message}`);
            setStatusType('error');
            setIsRunning(false);
        };

        const onExecutionEnd = () => {
            setIsRunning(false);
            setCurrentStep(-1);
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
    };

    const handleReset = () => {
        EventBus.emit('reset-level');
        setIsRunning(false);
        setCurrentStep(-1);
        setStatusMessage(levelInfo?.description || '');
        setStatusType('info');
        setShowStatusLevel(false);
    };

    const handleLoadLevel = (levelId: number) => {
        EventBus.emit('load-level', levelId);
        setShowLevelSelect(false);
        setShowStatusLevel(false);
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
                className={`p-2.5 bg-bg-secondary border border-border-custom rounded-md cursor-pointer queue-sec-hover ${isActive ? 'active' : ''}`}
                onClick={() => !isRunning && setActiveSlot(slot)}
                style={{ '--queue-color': color } as React.CSSProperties}
            >
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-jetbrains text-[0.7rem] font-bold uppercase tracking-[2px] text-(--queue-color)">{label}</span>
                    <span className="font-jetbrains text-[0.6rem] text-text-muted ml-auto">{queue.length}/{maxSlots}</span>
                    {!isRunning && queue.length > 0 && (
                        <Button intent="ghost" color="red" size="none" className="w-5 h-5 rounded-[4px] text-[10px]" onClick={(e) => { e.stopPropagation(); clearQueue(slot); }}>✕</Button>
                    )}
                </div>
                <div className="flex flex-wrap gap-1">
                    {Array.from({ length: maxSlots }).map((_, i) => {
                        const cmd = queue[i];
                        const isHighlighted = isRunning && currentDepth === 0 && slot === 'main' && i === currentStep;
                        return (
                            <div
                                key={i}
                                className={`w-9 h-9 flex items-center justify-center rounded-sm transition-all duration-150 relative ${cmd ? 'queue-slot-filled' : 'bg-white/2 border border-dashed border-white/8'} ${isHighlighted ? 'animate-pulse-glow border-accent-yellow! shadow-[0_0_12px_rgba(251,191,36,0.3)]' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (cmd && !isRunning) removeCommand(slot, i);
                                }}
                                style={cmd ? { '--cmd-color': COMMAND_CONFIG[cmd].color } as React.CSSProperties : {}}
                            >
                                {cmd ? (
                                    <span className="slot-icon text-[1rem] text-(--cmd-color) leading-none">{COMMAND_CONFIG[cmd].icon}</span>
                                ) : (
                                    <span className="text-[0.8rem] text-text-muted opacity-30">·</span>
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

                {/* Contenido principal */}
                <div className="flex flex-col min-[901px]:flex-row gap-2 flex-1 min-h-0">
                    {/* Lienzo de Phaser (Canvas) */}
                    <div className="flex-1 rounded-md overflow-hidden border border-border-custom bg-bg-secondary shadow-[0_0_20px_rgba(34,211,238,0.1)] flex items-center justify-center max-[900px]:min-h-[300px]">
                        <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
                    </div>

                    {/* Panel de programación */}
                    <div className="w-[320px] max-[900px]:w-full flex flex-col gap-2 min-h-0 max-[900px]:max-h-[45vh]">
                        {/* Barra de estado */}
                        <div className={`py-2.5 px-4 rounded-md border transition-all duration-300 ${statusType === 'info' ? 'border-accent-cyan/20 bg-accent-cyan/5' : statusType === 'success' ? 'border-accent-green/40 bg-accent-green/8 shadow-[0_0_20px_rgba(52,211,153,0.1)]' : 'border-accent-red/30 bg-accent-red/6'}`}>
                            <span className={`text-[0.8rem] font-normal leading-[1.4] ${statusType === 'info' ? 'text-text-secondary' : statusType === 'success' ? 'text-accent-green font-semibold' : 'text-accent-red'}`}>{statusMessage}</span>
                        </div>

                        {/* Paleta de comandos */}
                        <div className="p-3 bg-linear-to-br from-bg-secondary to-bg-tertiary border border-border-custom rounded-md">
                            <div className="font-jetbrains text-[0.65rem] font-semibold uppercase tracking-[2px] text-text-muted mb-2.5">Commands</div>
                            <div className="flex flex-wrap gap-1.5">
                                {getAvailableCommandsForSlot(activeSlot).map(cmd => {
                                    const config = COMMAND_CONFIG[cmd];
                                    return (
                                        <CommandButton
                                            key={cmd}
                                            className="min-w-[52px]"
                                            style={{ '--cmd-color': config.color } as React.CSSProperties}
                                            onClick={() => addCommand(cmd)}
                                            disabled={isRunning}
                                        >
                                            <span className="text-[1.2rem] leading-none text-(--cmd-color)">{config.icon}</span>
                                            <span className="text-[0.6rem] font-medium text-text-muted uppercase tracking-[0.5px] mt-1">{config.label}</span>
                                        </CommandButton>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Colas de instrucciones */}
                        <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto min-h-0 queues-scrollbar">
                            {renderQueue('main', 'MAIN', '#22d3ee')}
                            {renderQueue('f1', 'F1', '#f472b6')}
                            {renderQueue('f2', 'F2', '#c084fc')}
                            {renderQueue('f3', 'F3', '#67e8f9')}
                        </div>

                        {/* Botones de control */}
                        <div className="flex flex-col gap-3 p-3 bg-bg-tertiary border border-border-custom rounded-md">
                            <div className="flex items-center justify-between py-1 px-2 bg-black/20 rounded-sm">
                                <span className="font-jetbrains text-[0.65rem] font-semibold uppercase text-text-muted">Speed</span>
                                <div className="flex gap-1">
                                    {[0.5, 1, 2].map(s => (
                                        <Button
                                            key={s}
                                            intent="ghost"
                                            isActive={speed === s}
                                            size="none"
                                            className="py-1 px-2.5 text-[0.7rem] font-jetbrains rounded-md shadow-none"
                                            onClick={() => setSpeed(s)}
                                        >
                                            {s === 0.5 ? '1x' : s === 1 ? '2x' : '4x'}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {!isRunning ? (
                                    <Button
                                        intent="primary"
                                        className="flex-1 tracking-[1px] font-jetbrains py-3"
                                        onClick={handleRun}
                                        disabled={mainQueue.length === 0}
                                    >
                                        <Play size={20} strokeWidth={2} className='fill-accent-green' /> Run
                                    </Button>
                                ) : (
                                    <Button
                                        intent="danger"
                                        className="flex-1 tracking-[1px] font-jetbrains py-3"
                                        onClick={handleStop}
                                    >
                                        <Square size={20} strokeWidth={2} /> Stop
                                    </Button>
                                )}
                                <Button
                                    intent="solid" color='yellow'
                                    className="flex-1 tracking-[1px] font-jetbrains py-3"
                                    onClick={handleReset}
                                >
                                    <BrushCleaning size={20} strokeWidth={2} /> Clean
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
