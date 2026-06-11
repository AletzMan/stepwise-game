import { Maximize, Minimize } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Button from './Button';

interface FullscreenToggleProps {
    className?: string;
}

const FullscreenToggle: React.FC<FullscreenToggleProps> = ({ className = '' }) => {
    const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

    const handleFullscreenChange = useCallback(() => {
        setIsFullscreen(!!document.fullscreenElement);
    }, []);

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [handleFullscreenChange]);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error('Error toggling fullscreen:', err);
        }
    };

    return (
        <Button
            intent="accent"
            color="cyan"
            size="sm"
            onClick={toggleFullscreen}
            className={`font-black tracking-wider transition-all duration-300 gap-1.5 justify-center ${className}`}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
            {isFullscreen
                ? <Minimize size={14} strokeWidth={2.5} />
                : <Maximize size={14} strokeWidth={2.5} />
            }
        </Button>
    );
};

export default FullscreenToggle;
