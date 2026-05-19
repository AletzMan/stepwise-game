import { useRef, useState, useEffect, useCallback } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus';
import { Command, LEVELS } from './game/levels';

// Configuración de visualización de comandos
const COMMAND_CONFIG: Record<Command, { label: string; icon: string; color: string }> = {
    WALK: { label: 'Walk', icon: '⬆', color: '#22d3ee' },
    JUMP: { label: 'Jump', icon: '⤴', color: '#a78bfa' },
    TURN_LEFT: { label: 'Left', icon: '↺', color: '#fbbf24' },
    TURN_RIGHT: { label: 'Right', icon: '↻', color: '#fb923c' },
    ACTIVATE: { label: 'Act', icon: '⚡', color: '#34d399' },
    F1: { label: 'F1', icon: 'ƒ1', color: '#f472b6' },
    F2: { label: 'F2', icon: 'ƒ2', color: '#c084fc' },
    F3: { label: 'F3', icon: 'ƒ3', color: '#67e8f9' },
};

interface LevelInfo {
    id: number;
    name: string;
    description: string;
    availableCommands: Command[];
    mainSlots: number;
    f1Slots: number;
    f2Slots: number;
    f3Slots: number;
}

type ProgramSlot = 'main' | 'f1' | 'f2' | 'f3';

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
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
        const onLevelLoaded = (info: LevelInfo) => {
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
            }, 750);
            setIsRunning(false);
        };

        const onExecutionComplete = (data: { success: boolean; message: string }) => {
            if (!data.success) {
                setStatusMessage('Program finished — not all goals activated');
                setStatusType('error');
            }
            setTimeout(() => {
                setShowStatusLevel(true);
            }, 750);
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
                className={`queue-section ${isActive ? 'active' : ''}`}
                onClick={() => !isRunning && setActiveSlot(slot)}
                style={{ '--queue-color': color } as React.CSSProperties}
            >
                <div className="queue-header">
                    <span className="queue-label">{label}</span>
                    <span className="queue-count">{queue.length}/{maxSlots}</span>
                    {!isRunning && queue.length > 0 && (
                        <button className="queue-clear" onClick={(e) => { e.stopPropagation(); clearQueue(slot); }}>✕</button>
                    )}
                </div>
                <div className="queue-slots">
                    {Array.from({ length: maxSlots }).map((_, i) => {
                        const cmd = queue[i];
                        const isHighlighted = isRunning && currentDepth === 0 && slot === 'main' && i === currentStep;
                        return (
                            <div
                                key={i}
                                className={`queue-slot ${cmd ? 'filled' : 'empty'} ${isHighlighted ? 'highlighted' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (cmd && !isRunning) removeCommand(slot, i);
                                }}
                                style={cmd ? { '--cmd-color': COMMAND_CONFIG[cmd].color } as React.CSSProperties : {}}
                            >
                                {cmd ? (
                                    <span className="slot-icon">{COMMAND_CONFIG[cmd].icon}</span>
                                ) : (
                                    <span className="slot-placeholder">·</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div id="app">
            <div className="game-wrapper">
                {/* Encabezado */}
                <header className="game-header">
                    <div className="header-left">
                        <h1 className="game-title">STEPWISE</h1>
                    </div>
                    <div className="header-center">
                        {levelInfo && (
                            <div className="level-badge">
                                <span className="level-number">Level {levelInfo.id}</span>
                                <span className="level-name">{levelInfo.name}</span>
                            </div>
                        )}
                    </div>
                    <div className="header-right">
                        <button
                            className="btn-levels"
                            onClick={() => setShowLevelSelect(!showLevelSelect)}
                        >
                            ☰ Levels
                        </button>
                    </div>
                </header>

                {/* Superposición de selección de nivel */}
                {showLevelSelect && (
                    <div className="level-select-overlay" onClick={() => setShowLevelSelect(false)}>
                        <div className="level-select-panel" onClick={(e) => e.stopPropagation()}>
                            <h2>Select Level</h2>
                            <div className="level-grid">
                                {LEVELS.map(level => (
                                    <button
                                        key={level.id}
                                        className={`level-card ${completedLevels.has(level.id) ? 'completed' : ''} ${levelInfo?.id === level.id ? 'current' : ''}`}
                                        onClick={() => handleLoadLevel(level.id)}
                                    >
                                        <span className="level-card-number">{level.id}</span>
                                        <span className="level-card-name">{level.name}</span>
                                        {completedLevels.has(level.id) && <span className="level-card-check">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Superposición de estado del nivel */}
                {showStatusLevel && (
                    <dialog className="status-overlay" open onClick={() => setShowStatusLevel(false)}>
                        {statusType === 'success' && <div className="status-panel" onClick={(e) => e.stopPropagation()}>
                            <h2 className="status-title">Level complete!</h2>
                            <p className="status-message">You solved Level {levelInfo?.id}!</p>
                            <div className="stars">
                                {Array.from({ length: stars }).map((_, i) => (
                                    <div key={i} className="star">⭐</div>
                                ))}
                            </div>
                            <button className="status-button" onClick={() => { handleLoadLevel(levelInfo!.id + 1); }}>
                                Next
                            </button>
                            <button className="status-button" onClick={() => { setStatusType('info'); setShowStatusLevel(false); }}>
                                Menu
                            </button>
                        </div>}
                        {statusType === 'error' && <div className="status-panel" onClick={(e) => e.stopPropagation()}>
                            <h2 className="status-title">Oops!</h2>
                            <p className="status-message">You didn't solve Level {levelInfo?.id}!</p>
                            <button className="status-button" onClick={() => { setStatusType('info'); setShowStatusLevel(false); }}>
                                Try again
                            </button>
                        </div>}
                        {statusType === 'info' && <div className="status-panel" onClick={(e) => e.stopPropagation()}>
                            <h2 className="status-title">{levelInfo?.name}</h2>
                            <p className="status-message">{levelInfo?.description}</p>
                            <button className="status-button" onClick={() => { setStatusType('info'); setShowStatusLevel(false); }}>
                                Start
                            </button>
                        </div>}
                    </dialog>
                )}



                {/* Contenido principal */}
                <div className="game-content">
                    {/* Lienzo de Phaser (Canvas) */}
                    <div className="canvas-container">
                        <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
                    </div>

                    {/* Panel de programación */}
                    <div className="program-panel">
                        {/* Barra de estado */}
                        <div className={`status-bar status-${statusType}`}>
                            <span className="status-text">{statusMessage}</span>
                        </div>

                        {/* Paleta de comandos */}
                        <div className="command-palette">
                            <div className="palette-label">Commands</div>
                            <div className="palette-buttons">
                                {getAvailableCommandsForSlot(activeSlot).map(cmd => {
                                    const config = COMMAND_CONFIG[cmd];
                                    return (
                                        <button
                                            key={cmd}
                                            className="cmd-button"
                                            style={{ '--cmd-color': config.color } as React.CSSProperties}
                                            onClick={() => addCommand(cmd)}
                                            disabled={isRunning}
                                        >
                                            <span className="cmd-icon">{config.icon}</span>
                                            <span className="cmd-label">{config.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Colas de instrucciones */}
                        <div className="queues-container">
                            {renderQueue('main', 'MAIN', '#22d3ee')}
                            {renderQueue('f1', 'F1', '#f472b6')}
                            {renderQueue('f2', 'F2', '#c084fc')}
                            {renderQueue('f3', 'F3', '#67e8f9')}
                        </div>

                        {/* Botones de control */}
                        <div className="control-buttons-wrapper">
                            <div className="speed-selector">
                                <span className="speed-label">Speed</span>
                                <div className="speed-options">
                                    {[0.5, 1, 2].map(s => (
                                        <button
                                            key={s}
                                            className={`speed-btn ${speed === s ? 'active' : ''}`}
                                            onClick={() => setSpeed(s)}
                                        >
                                            {s === 0.5 ? '1x' : s === 1 ? '2x' : '4x'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="control-buttons">
                                {!isRunning ? (
                                    <button
                                        className="btn-run"
                                        onClick={handleRun}
                                        disabled={mainQueue.length === 0}
                                    >
                                        ▶ Run
                                    </button>
                                ) : (
                                    <button className="btn-stop" onClick={handleStop}>
                                        ■ Stop
                                    </button>
                                )}
                                <button className="btn-reset" onClick={handleReset}>
                                    ↺ Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
