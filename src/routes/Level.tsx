import { useRef, useState, useEffect, useCallback } from 'react';
import { IRefPhaserGame, PhaserGame } from '../PhaserGame';
import { EventBus } from '../game/EventBus';
import { Command, LEVELS, LevelData } from '../game/levels';
import Header from '../components/layout/Header';
import LevelCompleteModal from '../components/layout/LevelCompleteModal';
import '@fontsource/titan-one';
import Button from '../components/ui/Button';
import CommandButton from '../components/ui/CommandButton';
import { Play, Square, EraserIcon, RotateCcw, RotateCw, Layers } from 'lucide-react';
import LevelErrorModal from '../components/layout/LevelErrorModel';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useGameStore } from '../store/gameStore';
import { driver, DriveStep } from 'driver.js';
import { TUTORIAL_CONFIG, TUTORIAL_STEPS_LVL1, TUTORIAL_STEPS_LVL11, TUTORIAL_STEPS_LVL21, TUTORIAL_STEPS_LVL26, TUTORIAL_STEPS_LVL31, TUTORIAL_STEPS_LVL38 } from '../game/data/tutorialStep';
import { COMMAND_CONFIG } from '../game/data/constants';
import { ProgramSlot } from '../game/types/game';
import SortableCommand from '../components/levels/SortableCommand';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { useMediaQuery } from '../hooks/useMediaQuery';

export interface QueueItem {
    id: number;
    cmd: Command;
    value?: number;
}

let _queueIdCounter = 0;
function nextQueueId() {
    return _queueIdCounter++;
}

export function Level() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [levelInfo, setLevelInfo] = useState<LevelData | null>(null);
    const [mainQueue, setMainQueue] = useState<QueueItem[]>([]);
    const [f1Queue, setF1Queue] = useState<QueueItem[]>([]);
    const [f2Queue, setF2Queue] = useState<QueueItem[]>([]);
    const [f3Queue, setF3Queue] = useState<QueueItem[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [activeSlot, setActiveSlot] = useState<ProgramSlot>('main');
    const [executionStack, setExecutionStack] = useState<{ slot: ProgramSlot; index: number }[]>([]);
    const [_completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
    const [speed, setSpeed] = useState<number>(1);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
    const [showStatusLevel, setShowStatusLevel] = useState(false);
    const [showErrorLevel, setShowErrorLevel] = useState(false);
    const [isTopDown, setIsTopDown] = useState(false);
    const [stars, setStars] = useState<number>(0); // Numero de estrellas ganadas en el nivel actual 
    const executedCommands = useRef<number>(0); // Numero total de comandos ejecutados en el nivel actual
    const setLevels = useGameStore((state) => state.setLevels);
    const levels = useGameStore((state) => state.levels);
    const isMobileLandscape = useMediaQuery("(max-width: 932px) and (orientation: landscape)");

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
            return t(`levels.${location.pathname.split('/').pop()!}.description`, { defaultValue: levelInfo.description });
        }
        return status;
    }, [t, levelInfo, location.pathname]);

    // Escuchar eventos desde Phaser
    useEffect(() => {
        const onLevelLoaded = (info: LevelData) => {
            const selectedLevel = LEVELS.find(l => l.id === info.id);
            if (!selectedLevel) {
                return;
            }
            setLevelInfo(selectedLevel);
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
            setExecutionStack([]);
        };

        const onExecutionStep = (data: { command: Command; index: number; depth: number; stack?: { slot: ProgramSlot; index: number }[] }) => {
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
                const stars = calculateStars(levelId, executedCommands.current);
                setStars(stars);
                saveStateLevel('completed', stars);
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
            saveStateLevel('unlocked', 0);
        };

        const onExecutionFail = (message: string) => {
            setStatusMessage(`error:${message}`);
            setStatusType('error');
            setIsRunning(false);
            setExecutionStack([]);
            setTimeout(() => {
                setShowErrorLevel(true);
            }, 500);
            saveStateLevel('unlocked', 0);
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

    const toggleTopPlatform = () => {
        setIsTopDown(false);
        EventBus.emit('toggle-topdown', false);
    };

    const toggleDownPlatform = () => {
        setIsTopDown(true);
        EventBus.emit('toggle-topdown', true);
    }

    // ------------------------------------------------------------
    // TUTORIAL (DRIVER.JS)
    // ------------------------------------------------------------
    useEffect(() => {
        const currentLevel = levels.find(l => l.id === levelInfo?.id);
        const levelsWhitTutorial = [1, 11, 21, 26, 31, 38]
        if (currentLevel && currentLevel?.stars > 0 || (!levelsWhitTutorial.includes(currentLevel?.id ?? 0))) return

        let steps: DriveStep[] = []

        switch (currentLevel?.id) {
            case 1:
                steps = TUTORIAL_STEPS_LVL1
                break
            case 11:
                steps = TUTORIAL_STEPS_LVL11
                break
            case 21:
                steps = TUTORIAL_STEPS_LVL21
                break
            case 26:
                steps = TUTORIAL_STEPS_LVL26
                break
            case 31:
                steps = TUTORIAL_STEPS_LVL31
                break
            case 38:
                steps = TUTORIAL_STEPS_LVL38
                break
            default:
                steps = []
                break
        }

        const timer = setTimeout(() => {
            const driverObj = driver({
                ...TUTORIAL_CONFIG,
                nextBtnText: t('tutorial.buttons.next'),
                prevBtnText: t('tutorial.buttons.prev'),
                doneBtnText: t('tutorial.buttons.done'),
                steps: steps.map(step => ({
                    ...step,
                    popover: {
                        ...step.popover,
                        title: step.popover?.title ? t('tutorial.' + levelInfo?.id + '.' + step.popover.title + '.title') : undefined,
                        description: step.popover?.title ? t('tutorial.' + levelInfo?.id + '.' + step.popover.title + '.description') : undefined
                    }
                }))
            })

            driverObj.drive()
        }, 1000)

        return () => clearTimeout(timer)
    }, [levelInfo?.id])


    const getQueue = useCallback((slot: ProgramSlot): QueueItem[] => {
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
    }, [levelInfo, location.pathname]);

    const setQueue = useCallback((slot: ProgramSlot, queue: QueueItem[]) => {
        switch (slot) {
            case 'main': setMainQueue(queue); break;
            case 'f1': setF1Queue(queue); break;
            case 'f2': setF2Queue(queue); break;
            case 'f3': setF3Queue(queue); break;
        }
    }, []);

    const [showRepeatModal, setShowRepeatModal] = useState(false);
    const [repeatValue, setRepeatValue] = useState(2);

    const addCommand = (cmd: Command) => {
        if (isRunning) return;
        const queue = getQueue(activeSlot);
        const maxSlots = getMaxSlots(activeSlot);
        if (queue.length < maxSlots) {
            if (cmd === 'REPEAT') {
                setShowRepeatModal(true);
            } else {
                setQueue(activeSlot, [...queue, { id: nextQueueId(), cmd }]);
            }
        }
    };

    const handleRepeatConfirm = () => {
        const queue = getQueue(activeSlot);
        setQueue(activeSlot, [...queue, { id: nextQueueId(), cmd: 'REPEAT', value: repeatValue }]);
        setShowRepeatModal(false);
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

        executedCommands.current = mainQueue.length + f1Queue.length + f2Queue.length + f3Queue.length;

        EventBus.emit('run-program', {
            main: mainQueue.map(item => ({ cmd: item.cmd, value: item.value })),
            f1: f1Queue.map(item => ({ cmd: item.cmd, value: item.value })),
            f2: f2Queue.map(item => ({ cmd: item.cmd, value: item.value })),
            f3: f3Queue.map(item => ({ cmd: item.cmd, value: item.value })),
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
        setShowStatusLevel(false);
        setShowErrorLevel(false);
    };

    const sceneReady = useRef(false);

    const currentScene = (_scene: Phaser.Scene) => {
        sceneReady.current = true;
    };

    const saveStateLevel = (status: 'completed' | 'unlocked' | 'locked', stars: number) => {
        const currentLevel = parseInt(location.pathname.split('/').pop()!, 10);
        if (isNaN(currentLevel)) return;

        const levelsMap = new Map(levels.map(lvl => [lvl.id, lvl]));
        const currentLevelSaved = levelsMap.get(currentLevel);

        if (status === 'completed') {
            const nextLevel = currentLevel + 1;

            // REGLA DE ORO: ¿Se deben actualizar las estrellas?
            // 1. Si el nivel no existía antes, se guarda.
            // 2. Si ya existía, solo se actualiza si las nuevas estrellas superan al récord actual.
            const currentStars = currentLevelSaved?.stars || 0;
            const shouldUpdateStars = !currentLevelSaved || stars > currentStars;

            // Actualizamos el nivel actual
            levelsMap.set(currentLevel, {
                id: currentLevel,
                status,
                stars: shouldUpdateStars ? stars : currentStars // Mantiene el récord si no lo superó
            });

            // Desbloqueamos el siguiente nivel si no estaba desbloqueado o completado ya
            const nextLevelSaved = levelsMap.get(nextLevel);
            if (!nextLevelSaved || nextLevelSaved.status === 'locked') {
                levelsMap.set(nextLevel, { id: nextLevel, status: 'unlocked', stars: 0 });
            }

        } else if (status === 'unlocked') {
            // Solo lo marcamos como desbloqueado si no estaba completado antes
            if (currentLevelSaved?.status !== 'completed') {
                levelsMap.set(currentLevel, { id: currentLevel, status, stars });
            }
        }

        // Guardamos el array limpio y ordenado por ID
        setLevels(Array.from(levelsMap.values()).sort((a, b) => a.id - b.id));
    };

    useEffect(() => {
        // Solo emitir 'load-level' si la escena ya está lista.
        // En el primer montaje, Game.create() ya carga el nivel desde la URL,
        // así que no necesitamos hacer nada hasta que cambie el pathname.
        if (sceneReady.current) {
            handleLoadLevel(parseInt(location.pathname.split('/').pop()!, 10));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    // Filtrar comandos: no mostrar F1/F2/F3 en sus propios paneles para evitar la recursión directa
    const getAvailableCommandsForSlot = (slot: ProgramSlot): Command[] => {
        if (!levelInfo) return [];
        const uniqueCommands = Array.from(new Set(levelInfo.availableCommands));
        return uniqueCommands.filter(cmd => {
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
                id={`queue-${slot}`}
                className={`relative p-1.5 bg-bg-secondary/60 border rounded-sm cursor-pointer transition-all duration-300 select-none queue-sec-hover
                ${isActive
                        ? 'border-(--queue-color)/40 bg-linear-to-b from-bg-secondary to-bg-tertiary/80 shadow-[0_4px_20px_-5px_color-mix(in_srgb,var(--queue-color)_15%,transparent)]'
                        : 'border-border-custom/50 hover:border-border-custom'
                    } ${isActive ? 'active' : ''}`}
                onClick={() => !isRunning && setActiveSlot(slot)}
                style={{ '--queue-color': color } as React.CSSProperties}
            >

                {/* 1. BOTÓN ELIMINAR FIJO SUPERIOR (Accesible en móvil, tamaño compacto) */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        clearQueue(slot);
                    }}
                    disabled={isRunning || queue.length === 0}
                    className={`absolute top-0 -right-2.5 -translate-x-1/2 w-5 h-5 flex items-center justify-center rounded-full border transition-all duration-200
                                ${queue.length === 0 || isRunning
                            ? 'opacity-10 text-text-muted/20 border-transparent pointer-events-none'
                            : 'opacity-75 bg-slate-950 border-zinc-700 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 active:scale-90 cursor-pointer'
                        }`}
                    title="Limpiar secuencia"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                </button>
                <div className="flex flex-row gap-2 w-full h-full">

                    {/* PESTAÑA LATERAL BALANCEADA (Perfecta para Mobile y cambios de idioma) */}
                    <div className={`relative flex flex-col items-center justify-between py-4 px-1 rounded-md border shrink-0 w-6 transition-all duration-300 
                        ${isActive
                            ? 'bg-(--queue-color)/10 border-(--queue-color)/40 shadow-[inset_0_0_8px_color-mix(in_srgb,var(--queue-color)_15%,transparent)]'
                            : 'bg-black/20 border-border-custom/20'
                        }`}
                    >


                        {/* 2. TEXTO VERTICAL (Controla dinámicamente el tamaño para que nunca se desborde) */}
                        <span className={`font-jetbrains font-black uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 transition-all duration-300 my-auto
                            ${label.length > 5 ? 'text-[0.55rem]' : 'text-[0.7rem]'}
                            ${isActive ? 'text-(--queue-color) drop-shadow-[0_0_6px_var(--queue-color)]' : 'text-text-secondary/50'}`}
                        >
                            {label}
                        </span>

                        {/* 3. TU CONTADOR FAVORITO (Píldora horizontal fija abajo) */}
                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 font-jetbrains text-[9px] font-bold px-1.5 py-0.5 rounded-full border shadow-md scale-90 transition-all duration-300
                            ${isActive
                                ? 'bg-slate-900 text-white border-(--queue-color)/40'
                                : 'text-text-secondary bg-bg-tertiary border-border-custom/40'
                            }`}
                        >
                            <span>{queue.length}</span>
                            <span className="mx-0.5 opacity-40">/</span>
                            <span className={isActive ? 'text-(--queue-color)' : 'text-text-muted'}>{maxSlots}</span>
                        </div>
                    </div>

                    {/* Grilla de Slots */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <DragDropProvider
                            onDragEnd={(event) => {
                                if (isRunning) return;
                                setQueue(slot, move(queue, event));
                            }}
                        >
                            <div className="flex flex-wrap gap-1.5 p-1 bg-black/15 border border-black/10 rounded-md">
                                {Array.from({ length: maxSlots }).map((_, i) => {
                                    const item = queue[i];
                                    const isHighlighted = isRunning && executionStack.some(frame => frame.slot === slot && frame.index === i);

                                    return (
                                        <SortableCommand
                                            key={item ? item.id : `empty-${i}`}
                                            index={i}
                                            id={item ? item.id : -(i + 1)}
                                            cmd={item?.cmd}
                                            value={item?.value}
                                            slot={slot}
                                            isRunning={isRunning}
                                            isHighlighted={isHighlighted}
                                            removeCommand={removeCommand}
                                        />
                                    );
                                })}
                            </div>
                        </DragDropProvider>
                    </div>
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
                    isMobileLandscape={isMobileLandscape}
                />

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
                        handleResetLevel={handleReset}
                    />
                )}

                {/* Superposición en caso de error*/}
                {showErrorLevel && (
                    <LevelErrorModal
                        message={getStatusText(statusMessage)}
                        show={showErrorLevel}
                        setShowStatusLevel={setShowStatusLevel}
                        handleRetryLevel={handleReset}
                        handleRestartLevel={() => handleLoadLevel(levelInfo?.id || 0)}
                        onGoToMenu={() => navigate('/levels')}
                    />
                )}

                {/* Modal REPEAT */}
                {showRepeatModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="bg-bg-secondary border border-border-custom p-6 rounded-lg shadow-xl w-80">
                            <h3 className="text-white text-lg font-bold mb-4 font-jetbrains">{t('app.repeat_modal_title', { defaultValue: 'Número de repeticiones' })}</h3>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={repeatValue}
                                onChange={(e) => setRepeatValue(parseInt(e.target.value) || 1)}
                                className="w-full bg-bg-tertiary border border-border-custom text-white p-2 rounded mb-4 font-jetbrains"
                            />
                            <div className="flex justify-end gap-2">
                                <Button intent="ghost" color="cyan" size="sm" onClick={() => setShowRepeatModal(false)}>
                                    {t('app.btn_cancel', { defaultValue: 'Cancelar' })}
                                </Button>
                                <Button intent="solid" color="green" size="sm" onClick={handleRepeatConfirm}>
                                    {t('app.btn_confirm', { defaultValue: 'Aceptar' })}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contenido principal */}
                <div className="flex flex-col min-[640px]:flex-row gap-2 flex-1 min-h-0">
                    {/* Lienzo de Phaser (Canvas) */}
                    <div id="phaser-canvas" className="relative flex-1 rounded-sm overflow-hidden border border-border-custom bg-bg-secondary flex items-center justify-center max-[640px]:min-h-[300px]">
                        <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />

                        {/* Velocidad */}
                        <div className="absolute top-1 left-1 flex items-center justify-between py-1 px-2 bg-black/20 rounded-sm">
                            <span className="font-jetbrains text-[0.65rem] font-semibold uppercase text-text-muted">
                                {t('app.speed')}
                            </span>
                            <div id="speed-buttons" className="flex gap-1">
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
                        {/* Cámara */}
                        <div className=" absolute top-1 right-1 flex items-center justify-between py-1 px-2 bg-black/20 rounded-sm">
                            <span className="font-jetbrains text-[0.65rem] font-semibold uppercase text-text-muted">
                                {t('app.camera', { defaultValue: 'Cámara' })}
                            </span>
                            <div id="camera-buttons" className="flex gap-1">
                                <Button
                                    intent={isTopDown ? "solid" : "ghost"}
                                    color="cyan"
                                    size="none"
                                    className="py-1 px-2.5 text-[0.7rem] font-jetbrains rounded-xs! shadow-none"
                                    onMouseDown={toggleDownPlatform}
                                    onMouseUp={toggleTopPlatform}
                                    onMouseLeave={toggleTopPlatform}
                                >
                                    <Layers size={16} />
                                </Button>
                                <Button
                                    intent="ghost"
                                    color="cyan"
                                    size="none"
                                    className="py-1 px-2.5 text-[0.7rem] font-jetbrains rounded-xs! shadow-none"
                                    onClick={() => EventBus.emit('rotate-camera', 3)}
                                >
                                    <RotateCcw size={16} />
                                </Button>
                                <Button
                                    intent="ghost"
                                    color="cyan"
                                    size="none"
                                    className="py-1 px-2.5 text-[0.7rem] font-jetbrains rounded-xs! shadow-none"
                                    onClick={() => EventBus.emit('rotate-camera', 1)}
                                >
                                    <RotateCw size={16} />
                                </Button>
                            </div>
                        </div>

                        <div id="control-buttons" className=" absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3 p-1 bg-black/10 border border-border-custom/20 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                            {!isRunning ? (
                                <Button
                                    intent="solid"
                                    color="green"
                                    size="sm"
                                    className="flex-1 font-black text-xs tracking-widest rounded-lg shadow-[0_4px_15px_color-mix(in_srgb,var(--color-accent-green)_30%,transparent)]"
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
                                    size="sm"
                                    className="flex-1 font-black text-xs tracking-widest rounded-lg animate-pulse shadow-[0_4px_15px_color-mix(in_srgb,var(--color-accent-red)_30%,transparent)]"
                                    onClick={handleStop}
                                >
                                    <Square size={18} strokeWidth={3} className="fill-white" />
                                    <span>{t('app.btn_stop')}</span>
                                </Button>
                            )}

                            <Button
                                intent="solid"
                                color="yellow"
                                size="sm"
                                className="flex-1 font-black text-xs tracking-widest rounded-lg shadow-[0_4px_15px_color-mix(in_srgb,var(--color-accent-yellow)_30%,transparent)]"
                                onClick={() => handleLoadLevel(levelInfo?.id ?? 1)}
                            >
                                <EraserIcon size={18} strokeWidth={3} />
                                <span>{t('app.btn_clear')}</span>
                            </Button>
                        </div>
                    </div>

                    {/* Panel de programación */}
                    <div className="w-[328px] max-[640px]:w-full flex flex-col gap-2 min-h-0 max-[640px]:max-h-[45vh]">

                        {/* Paleta de comandos */}
                        <div id="command-palette" className="p-1.5 bg-linear-to-br from-bg-secondary to-bg-tertiary border border-border-custom rounded-sm">
                            <div className="pl-1 font-jetbrains text-[0.65rem] font-semibold uppercase tracking-[2px] text-text-muted mb-1.5">
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
                            {renderQueue('f2', t('app.queues.f2'), '#a78bfa')}
                            {renderQueue('f3', t('app.queues.f3'), '#2dd4bf')}
                        </div>

                        {/* Botones de control */}
                        {/* <div className="flex flex-col gap-3 p-3 bg-bg-tertiary border border-border-custom rounded-sm">

                        </div> */}
                    </div>
                </div>
            </div>
        </div >
    );
}
