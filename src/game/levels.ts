// Definiciones de datos de nivel para el juego de rompecabezas estilo Lightbot

export type Command = 'WALK' | 'JUMP' | 'TURN_LEFT' | 'TURN_RIGHT' | 'ACTIVATE' | 'PICK' | 'F1' | 'F2' | 'F3';

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
    GEM: 6, GRAIN: 7,
    GARDEN_PALM: 12, GARDEN_PLANT: 13, GARDEN_STONE: 14, GARDEN: 15, GARDEN_FENCE_NORTH: 16, GARDEN_FENCE_COMPLETE: 17,
    CASCADE_1: 18, CASCADE_2: 19, CASCADE_3: 20, CASCADE_4: 21, CASCADE_5: 22, CASCADE_6: 23,
    WOOD: 24,
};

// Tipos de casilla bloqueados (no se puede caminar/saltar sobre ellos)
export const BLOCKED_TILES = [
    TILE.GARDEN, TILE.GARDEN_FENCE_COMPLETE,
    TILE.GARDEN_PALM, TILE.GARDEN_PLANT, TILE.GARDEN_STONE, TILE.GARDEN_FENCE_NORTH,
    TILE.CASCADE_1, TILE.CASCADE_2, TILE.CASCADE_3, TILE.CASCADE_4, TILE.CASCADE_5, TILE.CASCADE_6,
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
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'ACTIVATE'],
        goalCommands: 8,
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
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'ACTIVATE'],
        goalCommands: 11,
        mainSlots: 20,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 6,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN_STONE }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE'],
        goalCommands: 16,
        mainSlots: 20,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 7,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 1, t: T.GRAY }, { h: 0, t: T.BLUE }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
        ],
        startPos: { x: 0, y: 0 },
        startDirection: 0, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE'],
        goalCommands: 13,
        mainSlots: 20,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 8,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 3, t: T.GRAY }, { h: 2, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 4, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 4, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 5, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 6, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
        ],
        startPos: { x: 4, y: 0 },
        startDirection: 2, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE'],
        goalCommands: 10,
        mainSlots: 20,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 9,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN_PLANT }, { h: 0, t: T.GARDEN }, { h: 0, t: T.GARDEN }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.GARDEN }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN_PLANT }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
        ],
        startPos: { x: 4, y: 0 },
        startDirection: 2, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE'],
        goalCommands: 18,
        mainSlots: 20,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 10,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 1, t: T.WOOD }, { h: 1, t: T.WOOD }, { h: 1, t: T.BLUE }],
            [{ h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 2, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 3, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 2, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 1, t: T.BLUE }, { h: 1, t: T.WOOD }, { h: 1, t: T.WOOD }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
        ],
        startPos: { x: 5, y: 5 },
        startDirection: 2, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE'],
        goalCommands: 18,
        mainSlots: 21,
        f1Slots: 0,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 11,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
        ],
        startPos: { x: 0, y: 6 },
        startDirection: 3, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE', 'F1'],
        goalCommands: 11,
        mainSlots: 28,
        f1Slots: 14,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 12,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.BLUE }, { h: 1, t: T.GRAY }, { h: 2, t: T.GRAY }, { h: 1, t: T.BLUE }, { h: 2, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 2, t: T.GRAY }, { h: 1, t: T.BLUE }, { h: 2, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.BLUE }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.BLUE }, { h: 1, t: T.GRAY }, { h: 2, t: T.GRAY }, { h: 1, t: T.BLUE }, { h: 2, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }],
        ],
        startPos: { x: 6, y: 6 },
        startDirection: 2, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE', 'F1'],
        goalCommands: 21,
        mainSlots: 21,
        f1Slots: 10,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 13,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
        ],
        startPos: { x: 6, y: 6 },
        startDirection: 2, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE', 'F1'],
        goalCommands: 16,
        mainSlots: 21,
        f1Slots: 14,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 14,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 2, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 2, t: T.WOOD }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 1, t: T.GRAY }, { h: 2, t: T.BLUE }, { h: 2, t: T.WOOD }, { h: 2, t: T.WOOD }, { h: 2, t: T.WOOD }, { h: 2, t: T.BLUE }, { h: 1, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 2, t: T.WOOD }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 2, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
        ],
        startPos: { x: 3, y: 3 },
        startDirection: 3, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE', 'F1'],
        goalCommands: 16,
        mainSlots: 28,
        f1Slots: 14,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 15,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
            [{ h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }],
            [{ h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
            [{ h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }],
            [{ h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
            [{ h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }],
        ],
        startPos: { x: 0, y: 6 },
        startDirection: 3, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE', 'F1'],
        goalCommands: 24,
        mainSlots: 28,
        f1Slots: 14,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 16,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 6, t: T.GRAY }, { h: 5, t: T.GRAY }, { h: 4, t: T.GRAY }, { h: 3, t: T.BLUE }, { h: 2, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }],
            [{ h: 5, t: T.GRAY }, { h: 0, t: T.GARDEN_PLANT }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }],
            [{ h: 4, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN_PLANT }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
            [{ h: 3, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN_PALM }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.BLUE }],
            [{ h: 2, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }],
            [{ h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }],
            [{ h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 1, t: T.BLUE }, { h: 0, t: T.BLUE }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }],
        ],
        startPos: { x: 0, y: 6 },
        startDirection: 3, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE', 'F1'],
        goalCommands: 14,
        mainSlots: 28,
        f1Slots: 14,
        f2Slots: 0,
        f3Slots: 0,
    },
    {
        id: 17,
        description: 'Turn around and walk forward. Use F1 to save steps!',
        map: [
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.BLUE }, { h: 0, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 2, t: T.GRAY }],
            [{ h: 2, t: T.BLUE }, { h: 3, t: T.GRAY }, { h: 4, t: T.GRAY }, { h: 4, t: T.WOOD }, { h: 4, t: T.WOOD }, { h: 4, t: T.BLUE }, { h: 3, t: T.GRAY }],
            [{ h: 2, t: T.WOOD }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN_PLANT }],
            [{ h: 2, t: T.WOOD }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN }],
            [{ h: 2, t: T.BLUE }, { h: 2, t: T.WOOD }, { h: 2, t: T.WOOD }, { h: 2, t: T.GRAY }, { h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN }],
            [{ h: 1, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN }],
            [{ h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GRAY }, { h: 0, t: T.GARDEN_STONE }],
        ],
        startPos: { x: 0, y: 6 },
        startDirection: 3, // SO (Sureste / SE en la brújula)
        availableCommands: ['WALK', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE', 'F1'],
        goalCommands: 28,
        mainSlots: 28,
        f1Slots: 14,
        f2Slots: 0,
        f3Slots: 0,
    },
];

export function getLevel(id: number): LevelData | undefined {
    return LEVELS.find(l => l.id === id);
}
