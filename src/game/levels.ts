// Definiciones de datos de nivel para el juego de rompecabezas estilo Lightbot

export type Command = 'WALK' | 'JUMP' | 'TURN_LEFT' | 'TURN_RIGHT' | 'ACTIVATE' | 'F1' | 'F2' | 'F3';

export interface TileInfo {
    h: number; // Altura (nivel Z)
    t: number; // Tipo (índice de frame de la casilla)
}

export interface LevelData {
    id: number;
    name: string;
    description: string;
    map: TileInfo[][];
    startPos: { x: number; y: number };
    startDirection: number; // 0=SE, 1=SO, 2=NO, 3=NE
    goals: { x: number; y: number }[]; // Casillas que deben ser activadas
    availableCommands: Command[];
    mainSlots: number;
    f1Slots: number;
    f2Slots: number;
    f3Slots: number;
}

// Constantes del tipo de casilla
export const TILE = {
    GRAY: 0, YELLOW: 1, RED: 2, PURPLE: 3, BLUE: 4,
    STONE_GRAY: 6, STONE_YELLOW: 7,
    GARDEN: 12, GARDEN_FENCE_WEST: 13, GARDEN_FENCE_SOUTH: 14, GARDEN_FENCE_EAST: 15, GARDEN_FENCE_NORTH: 16, GARDEN_FENCE_COMPLETE: 17,
    GARDEN_FENCE_WEST_SOUTH: 18, GARDEN_FENCE_EAST_SOUTH: 19, GARDEN_FENCE_EAST_NORTH: 20, GARDEN_FENCE_WEST_NORTH: 21, GARDEN_FENCE_WEST_EAST: 22, GARDEN_FENCE_NORTH_SOUTH: 23,
    WOOD: 24,
};

// Tipos de casilla bloqueados (no se puede caminar/saltar sobre ellos)
export const BLOCKED_TILES = [
    TILE.GARDEN, TILE.GARDEN_FENCE_COMPLETE,
    TILE.GARDEN_FENCE_WEST, TILE.GARDEN_FENCE_SOUTH, TILE.GARDEN_FENCE_EAST, TILE.GARDEN_FENCE_NORTH,
    TILE.GARDEN_FENCE_WEST_SOUTH, TILE.GARDEN_FENCE_WEST_EAST, TILE.GARDEN_FENCE_WEST_NORTH,
    TILE.GARDEN_FENCE_EAST_SOUTH, TILE.GARDEN_FENCE_EAST_NORTH, TILE.GARDEN_FENCE_NORTH_SOUTH,
];

const T = TILE;

// ─── NIVEL 1: Primeros pasos ──────────────────────────────────────────────────
const LEVEL_1: LevelData = {
    id: 1,
    name: 'First Steps',
    description: 'Walk forward and activate the goal tiles. Simple!',
    map: [
        [{ h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }],
        [{ h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }],
        [{ h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }],
        [{ h: 0, t: T.GARDEN_FENCE_EAST_NORTH }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }],
        [{ h: 0, t: T.GARDEN_FENCE_NORTH }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }],
        [{ h: 0, t: T.GARDEN_FENCE_NORTH }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }],
        [{ h: 0, t: T.GARDEN_FENCE_WEST_NORTH }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }, { h: 0, t: T.STONE_GRAY }],
    ],
    startPos: { x: 1, y: 1 },
    startDirection: 0, // SO (Sureste / SE en la brújula)
    goals: [
        { x: 4, y: 1 },
        { x: 4, y: 3 },
        { x: 4, y: 5 },
    ],
    availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'ACTIVATE'],
    mainSlots: 12,
    f1Slots: 0,
    f2Slots: 0,
    f3Slots: 0,
};

// ─── NIVEL 2: Subiendo ────────────────────────────────────────────────────────
const LEVEL_2: LevelData = {
    id: 2,
    name: 'Climbing Up',
    description: 'Use JUMP to reach higher ground. Use F1 to save steps!',
    map: [
        [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
        [{ h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.BLUE }, { h: 1, t: T.YELLOW }, { h: 1, t: T.PURPLE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
        [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.YELLOW }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
        [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 2, t: T.PURPLE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
        [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 2, t: T.YELLOW }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
        [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 3, t: T.PURPLE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
        [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
    ],
    startPos: { x: 1, y: 1 },
    startDirection: 0, // SO (Sureste / SE en la brújula)
    goals: [
        { x: 4, y: 5 },
    ],
    availableCommands: ['WALK', 'JUMP', 'TURN_LEFT', 'TURN_RIGHT', 'ACTIVATE', 'F1'],
    mainSlots: 12,
    f1Slots: 8,
    f2Slots: 0,
    f3Slots: 0,
};

export const LEVELS: LevelData[] = [LEVEL_1, LEVEL_2];

export function getLevel(id: number): LevelData | undefined {
    return LEVELS.find(l => l.id === id);
}
