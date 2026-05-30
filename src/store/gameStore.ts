import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameStore {
    levels: {
        id: number
        status: 'locked' | 'unlocked' | 'completed',
        stars: number
    }[],
    setLevels: (levels: GameStore['levels']) => void
}

const persistOptions = {
    name: 'game-store',
}

//Estado persistente  
export const useGameStore = create<GameStore>()(persist((set) => ({
    levels: [],
    setLevels: (levels) => set({ levels })
}), persistOptions))