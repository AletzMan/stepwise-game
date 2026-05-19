import React from 'react';
import Button from '../ui/Button';
import { ChevronRight, Menu, RotateCcw } from 'lucide-react';
import { LevelData } from '../../game/levels';

interface LevelCompleteModalProps {
    levelInfo: LevelData | null;
    statusType: 'info' | 'success' | 'error';
    stars: number;
    executedCommands: React.MutableRefObject<number>;
    setShowStatusLevel: (show: boolean) => void;
    setStatusType: (type: 'info' | 'success' | 'error') => void;
    handleLoadLevel: (id: number) => void;
}

const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
    levelInfo, statusType, stars, executedCommands, setShowStatusLevel, setStatusType, handleLoadLevel
}) => {
    if (statusType !== 'success') return null;

    return (
        <dialog
            className="fixed inset-0 w-svw h-svh z-2000 bg-black/60 backdrop-blur-md flex items-center justify-center animate-fade-in cursor-pointer"
            open
            onClick={() => setShowStatusLevel(false)}
        >
            <div
                className="relative overflow-hidden w-[420px] rounded-md border border-cyan-400/20 bg-linear-to-b from-slate-800 to-slate-900 shadow-[0_20px_80px_rgba(0,0,0,0.7),0_0_40px_rgba(34,211,238,0.15)] animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-400 via-green-400 to-cyan-400" />
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-green-400/10 blur-3xl rounded-full" />

                <div className="relative px-8 pt-10 pb-6 text-center">
                    <div className="mb-2">
                        <p className="text-green-400 text-sm tracking-[0.3em] uppercase font-bold">
                            Mission Complete
                        </p>
                        <h2 className="font-['Titan_One'] text-4xl text-white mt-2">
                            Level {levelInfo?.id}
                        </h2>
                    </div>

                    <div className="relative flex justify-center my-8">
                        <div className="flex gap-4 text-5xl">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className={`scale-90 opacity-30 grayscale brightness-50 ${i !== 1 ? 'pt-2' : ''}`}>
                                    ⭐
                                </div>
                            ))}
                        </div>
                        <div className="absolute inset-0 flex justify-center gap-4 text-5xl">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="star-animate"
                                    style={{ opacity: i < stars ? 1 : 0 }}
                                >
                                    ⭐
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-slate-300 text-lg">
                        Puzzle solved successfully
                    </p>

                    <div className="grid grid-cols-3 gap-3 mt-8">
                        <div className="bg-slate-800/80 border border-slate-700 rounded-md py-3">
                            <p className="text-xs text-slate-400 uppercase">Moves</p>
                            <p className="text-xl font-bold text-white">{executedCommands.current}</p>
                        </div>
                        <div className="bg-slate-800/80 border border-slate-700 rounded-md py-3">
                            <p className="text-xs text-slate-400 uppercase">Time</p>
                            <p className="text-xl font-bold text-white">01:20</p>
                        </div>
                        <div className="bg-slate-800/80 border border-slate-700 rounded-md py-3">
                            <p className="text-xs text-slate-400 uppercase">XP</p>
                            <p className="text-xl font-bold text-cyan-400">+250</p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                        <Button
                            intent="solid"
                            color="green"
                            className="h-14 rounded-md text-lg font-bold tracking-wide shadow-[0_0_20px_rgba(34,197,94,0.35)]"
                            onClick={() => {
                                handleLoadLevel(levelInfo!.id + 1);
                            }}
                        >
                            <span className="text-green-900">Next Level </span><ChevronRight className='text-green-900' size={24} strokeWidth={3} />
                        </Button>
                        <div className="flex gap-3">
                            <Button
                                intent="solid"
                                color="pink"
                                className="flex-1 h-12 rounded-md"
                                onClick={() => {
                                    setStatusType('info');
                                    setShowStatusLevel(false);
                                }}
                            >
                                <Menu className='text-pink-900' size={24} strokeWidth={3} />
                            </Button>
                            <Button
                                intent="solid"
                                color="orange"
                                className="flex-1 h-12 rounded-md"
                                onClick={() => {
                                    handleLoadLevel(levelInfo!.id);
                                }}
                            >
                                <RotateCcw className='text-orange-900  ' size={24} strokeWidth={3} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default LevelCompleteModal;
