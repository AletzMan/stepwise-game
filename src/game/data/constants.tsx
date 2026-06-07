import { Command } from "../levels";
import { ArrowRight, ArrowUp, CornerUpLeft, CornerUpRight, Zap, Pickaxe, Box, Repeat } from "lucide-react";

export const COMMAND_CONFIG: Record<Command, { label: string; icon: React.ReactNode; color: string }> = {
    WALK: { label: 'Walk', icon: <ArrowRight size={16} strokeWidth={3} />, color: '#94a3b8' },
    JUMP: { label: 'Jump', icon: <ArrowUp size={16} strokeWidth={3} />, color: '#38bdf8' },
    TURN_LEFT: { label: 'Left', icon: <CornerUpLeft size={16} strokeWidth={3} />, color: '#fbbf24' },
    TURN_RIGHT: { label: 'Right', icon: <CornerUpRight size={16} strokeWidth={3} />, color: '#fb923c' },
    ACTIVATE: { label: 'Activate', icon: <Zap size={16} strokeWidth={3} />, color: '#eab308' },
    PICK: { label: 'Pick', icon: <Pickaxe size={16} strokeWidth={0} fill='currentColor' />, color: '#7ccf00' },
    F1: { label: 'F1', icon: <Box size={16} strokeWidth={3} />, color: '#f472b6' },
    F2: { label: 'F2', icon: <Box size={16} strokeWidth={3} />, color: '#a78bfa' },
    F3: { label: 'F3', icon: <Box size={16} strokeWidth={3} />, color: '#2dd4bf' },
    REPEAT: { label: 'Repeat', icon: <Repeat size={16} strokeWidth={3} />, color: '#ef4444' },
};