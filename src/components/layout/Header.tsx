import React from 'react';
import Button from '../ui/Button';
import { LevelData } from '../../game/levels';

interface HeaderProps {
    levelInfo: LevelData | null;
    showLevelSelect: boolean;
    setShowLevelSelect: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ levelInfo, showLevelSelect, setShowLevelSelect }) => {
    return (
        <header className="flex items-center justify-between py-2 px-5 bg-linear-to-br from-bg-secondary to-bg-tertiary border border-border-custom rounded-md shadow-[0_0_20px_rgba(34,211,238,0.1)] min-h-[56px]">
            <div className="header-left">
                <h1 className="font-jetbrains text-[1.3rem] font-extrabold tracking-[4px] bg-linear-to-br from-accent-cyan to-accent-purple bg-clip-text text-transparent">STEPWISE</h1>
            </div>
            <div className="flex items-center justify-center">
                {levelInfo && (
                    <div className="flex items-center gap-2.5 py-1 px-4 bg-accent-cyan/8 border border-accent-cyan/20 rounded-[20px]">
                        <span className="font-jetbrains text-[0.75rem] font-semibold text-accent-cyan uppercase tracking-[1px]">Level {levelInfo.id}</span>
                        <span className="text-[0.9rem] font-medium text-text-primary">{levelInfo.name}</span>
                    </div>
                )}
            </div>
            <div className="header-right">
                <Button
                    intent="accent"
                    color="purple"
                    size="sm"
                    onClick={() => setShowLevelSelect(!showLevelSelect)}
                >
                    ☰ Levels
                </Button>
            </div>
        </header>
    );
};

export default Header;
