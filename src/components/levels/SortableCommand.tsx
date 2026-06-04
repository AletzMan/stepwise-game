import type { Command } from "../../game/levels";
import type { ProgramSlot } from "../../game/types/game";
import { COMMAND_CONFIG } from "../../game/data/constants";
import { useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";

interface Props {
    index: number;
    id: number;
    cmd?: Command;
    slot: ProgramSlot;
    isRunning: boolean;
    isHighlighted: boolean;
    removeCommand: (slot: ProgramSlot, index: number) => void;
}

export default function SortableCommand({ index, id, cmd, slot, isRunning, isHighlighted, removeCommand }: Props) {
    const [element, setElement] = useState<Element | null>(null);
    const { isDragging } = useSortable({ id, index, element: cmd ? element : null, disabled: !cmd });

    return (
        <div
            ref={cmd ? setElement : undefined}
            data-shadow={isDragging}
            data-id={id}
            className={`w-9 h-9 flex items-center justify-center rounded-sm transition-all duration-200 relative cursor-pointer
                                ${cmd
                    ? 'bg-(--cmd-color)/5 border border-b-[3px] border-(--cmd-color)/20 cmd-btn-hover active:translate-y-px active:border-b'
                    : 'bg-black/20 border border-dashed border-(--queue-color)/25 hover:border-(--queue-color)/30'
                } 
                                ${isHighlighted
                    ? 'animate-pulse-glow border-(--cmd-color)! bg-linear-to-t from-(--cmd-color)/15 to-transparent scale-105 z-10 shadow-[0_0_15px_color-mix(in_srgb,var(--cmd-color)_40%,transparent)]'
                    : isRunning && 'grayscale opacity-40 scale-95'
                }`}
            onClick={(e) => {
                e.stopPropagation();
                if (cmd && !isRunning) removeCommand(slot, index);
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
                <span className="text-md font-semibold text-(--queue-color)/30 select-none transition-colors group-hover:text-text-muted/40">+</span>
            )}
        </div>
    )
}
