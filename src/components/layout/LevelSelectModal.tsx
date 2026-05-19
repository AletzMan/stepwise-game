import React from 'react';
import Button from '../ui/Button';
import { LevelData, LEVELS } from '../../game/levels';

interface LevelSelectModalProps {
    levelInfo: LevelData | null;
    completedLevels: Set<number>;
    setShowLevelSelect: (show: boolean) => void;
    handleLoadLevel: (id: number) => void;
}

const LevelSelectModal: React.FC<LevelSelectModalProps> = ({ levelInfo, completedLevels, setShowLevelSelect, handleLoadLevel }) => {
    return (
        <div className="fixed inset-0 z-1000 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fade-in" onClick={() => setShowLevelSelect(false)}>
            <div className="bg-linear-to-br from-bg-secondary to-bg-primary border border-border-custom rounded-md p-8 min-w-[360px] shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_20px_rgba(34,211,238,0.1)] animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <h2 className="font-jetbrains text-[1.1rem] font-semibold text-text-secondary uppercase tracking-[3px] mb-6 text-center">Select Level</h2>
                <div className="flex flex-col gap-3">
                    {LEVELS.map(level => (
                        <Button
                            key={level.id}
                            intent="default"
                            isActive={levelInfo?.id === level.id}
                            className={`justify-start p-4 border-2 ${completedLevels.has(level.id) ? 'border-accent-green/50' : ''}`}
                            onClick={() => handleLoadLevel(level.id)}
                        >
                            <span className="font-jetbrains text-[1.5rem] font-bold text-accent-cyan min-w-[36px]">{level.id}</span>
                            <span className="text-[1rem] font-medium flex-1 text-left">{level.name}</span>
                            {completedLevels.has(level.id) && <span className="text-[1.2rem] text-accent-green">✓</span>}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LevelSelectModal;
