// Definiciones de datos de nivel para el juego de rompecabezas estilo Lightbot

export type Command = 'WALK' | 'JUMP' | 'TURN_LEFT' | 'TURN_RIGHT' | 'ACTIVATE' | 'F1' | 'F2' | 'F3';

export interface TileInfo {
    h: number; // Altura (nivel Z)
    t: number; // Tipo (índice de frame de la casilla)
}

export interface LevelData {
    id: number;
    description: string;
    map: TileInfo[][];
    startPos: { x: number; y: number };
    startDirection: number; // 0=SE, 1=SO, 2=NO, 3=NE
    availableCommands: Command[];
    goalCommands: number; // Numero de comandos necesarios para completar el nivel
    mainSlots: number;
    f1Slots: number;
    f2Slots: number;
    f3Slots: number;
}

// Constantes del tipo de casilla
export const TILE = {
    GRAY: 0, YELLOW: 1, RED: 2, PURPLE: 3, BLUE: 4,
    STONE_GRAY: 6, STONE_YELLOW: 7,
    GARDEN_PALM: 12, GARDEN_PLANT: 13, GARDEN_STONE: 14, GARDEN: 15, GARDEN_FENCE_NORTH: 16, GARDEN_FENCE_COMPLETE: 17,
    CASCADE_1: 18, CASCADE_2: 19, CASCADE_3: 20, CASCADE_4: 21, CASCADE_5: 22, CASCADE_6: 23,
    WOOD: 24,
};

// Tipos de casilla bloqueados (no se puede caminar/saltar sobre ellos)
export const BLOCKED_TILES = [
    TILE.GARDEN, TILE.GARDEN_FENCE_COMPLETE,
    TILE.GARDEN_PALM, TILE.GARDEN_PLANT, TILE.GARDEN_STONE, TILE.GARDEN_FENCE_NORTH,
    TILE.CASCADE_1, TILE.CASCADE_2, TILE.CASCADE_3, TILE.CASCADE_4, TILE.CASCADE_5, TILE.CASCADE_6,
    TILE.WOOD,
];

const T = TILE;





export const LEVELS: LevelData[] = [
    {
        id: 1,
        description: 'Walk forward and activate the goal tiles. Simple!',
        map: [[{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }]],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'ACTIVATE'],
        goalCommands: 4,
        mainSlots: 14,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 2,
        description: 'Use JUMP to reach higher ground. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE'],
        goalCommands: 9,
        mainSlots: 14,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 3,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN_PALM }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN_PLANT }, { h: 0, t: T.GRAY }],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'ACTIVATE', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE'],
        goalCommands: 12,
        mainSlots: 14,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 4,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 1, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 2, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 3, t: T.BLUE }, { h: 0, t: T.GARDEN_PALM }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
        ],
        startPos: { x: 4, y: 0 },
        startDirection: 2, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE'],
        goalCommands: 8,
        mainSlots: 12,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 5,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE },],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'ACTIVATE'],
        goalCommands: 4,
        mainSlots: 6,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 6,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE },],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'ACTIVATE'],
        goalCommands: 4,
        mainSlots: 6,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 7,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE },],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'ACTIVATE'],
        goalCommands: 4,
        mainSlots: 6,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 8,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE },],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'ACTIVATE'],
        goalCommands: 4,
        mainSlots: 6,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 9,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE },],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'ACTIVATE'],
        goalCommands: 4,
        mainSlots: 6,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 10,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE },],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'ACTIVATE'],
        goalCommands: 4,
        mainSlots: 6,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 11,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE },],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'ACTIVATE'],
        goalCommands: 4,
        mainSlots: 6,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 12,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE },],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'ACTIVATE'],
        goalCommands: 4,
        mainSlots: 6,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 13,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE },],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'ACTIVATE'],
        goalCommands: 4,
        mainSlots: 6,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 14,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE },],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'ACTIVATE'],
        goalCommands: 4,
        mainSlots: 6,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    }
];

export function getLevel(id: number): LevelData | undefined {
    return LEVELS.find(l => l.id === id);
}
