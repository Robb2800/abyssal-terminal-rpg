import { create } from 'zustand';
import { ASCII_ART, THEMES, getThemeData, GameTheme } from '@/lib/dictionaries';
export type GameStatus = 'START' | 'PLAYING' | 'GAMEOVER';
interface Encounter {
  name: string;
  hp: number;
  maxHp: number;
}
interface GameState {
  status: GameStatus;
  themeInput: string;
  theme: GameTheme;
  playerHp: number;
  playerMaxHp: number;
  roomsCleared: number;
  logs: string[];
  currentEncounter: Encounter | null;
  currentAscii: string;
  defenseActive: boolean;
  // Actions
  setThemeInput: (input: string) => void;
  startGame: () => void;
  nextRoom: () => void;
  attack: () => void;
  defend: () => void;
  addLog: (msg: string) => void;
  reset: () => void;
}
export const useGameStore = create<GameState>((set, get) => ({
  status: 'START',
  themeInput: '',
  theme: 'void',
  playerHp: 20,
  playerMaxHp: 20,
  roomsCleared: 0,
  logs: ['>>> SYSTEM INITIALIZED...', '>>> AWAITING SEED INPUT...'],
  currentEncounter: null,
  currentAscii: ASCII_ART.VOID,
  defenseActive: false,
  setThemeInput: (input) => set({ themeInput: input }),
  startGame: () => {
    const { themeInput } = get();
    const theme = getThemeData(themeInput);
    set({
      status: 'PLAYING',
      theme,
      logs: [`>>> ENTERING THE ABYSS: ${theme.toUpperCase()}`, '>>> DARKNESS ENVELOPS YOU.'],
      playerHp: 20,
      roomsCleared: 0,
      currentEncounter: null,
      currentAscii: ASCII_ART.DOORWAY
    });
  },
  addLog: (msg) => set((state) => ({ logs: [...state.logs, msg] })),
  nextRoom: () => {
    const { theme, roomsCleared, addLog } = get();
    const rng = Math.random();
    if (rng < 0.5) {
      // Encounter
      const themeData = THEMES[theme];
      const enemyName = themeData.enemies[Math.floor(Math.random() * themeData.enemies.length)];
      set({
        currentEncounter: { name: enemyName, hp: 10 + roomsCleared, maxHp: 10 + roomsCleared },
        currentAscii: ASCII_ART.SKULL
      });
      addLog(`! ENCOUNTER: A ${enemyName.toUpperCase()} LURKS HERE.`);
    } else if (rng < 0.75) {
      // Treasure
      set({ 
        playerHp: Math.min(get().playerMaxHp, get().playerHp + 5),
        currentAscii: ASCII_ART.CHEST,
        currentEncounter: null
      });
      addLog(`+ TREASURE: YOU FIND A RESTORATIVE VIAL. HP RESTORED.`);
    } else {
      // Empty
      const themeData = THEMES[theme];
      const desc = themeData.rooms[Math.floor(Math.random() * themeData.rooms.length)];
      set({ currentAscii: ASCII_ART.DOORWAY, currentEncounter: null });
      addLog(`- EMPTY: ${desc}`);
    }
    set({ roomsCleared: roomsCleared + 1 });
  },
  attack: () => {
    const { currentEncounter, addLog, playerHp } = get();
    if (!currentEncounter) return;
    const damage = Math.floor(Math.random() * 8) + 3;
    const newEnemyHp = currentEncounter.hp - damage;
    addLog(`> YOU STRIKE THE ${currentEncounter.name.toUpperCase()} FOR ${damage} DAMAGE.`);
    if (newEnemyHp <= 0) {
      addLog(`* VICTORY: THE FOE DISSOLVES INTO ASH.`);
      set({ currentEncounter: null, currentAscii: ASCII_ART.VOID });
    } else {
      // Enemy counter-attacks
      const enemyDmg = Math.floor(Math.random() * 5) + 2;
      const finalDmg = get().defenseActive ? Math.floor(enemyDmg / 2) : enemyDmg;
      const newPlayerHp = playerHp - finalDmg;
      addLog(`< THE ${currentEncounter.name.toUpperCase()} COUNTERS FOR ${finalDmg} DAMAGE.`);
      if (newPlayerHp <= 0) {
        set({ status: 'GAMEOVER', playerHp: 0, currentAscii: ASCII_ART.GAMEOVER });
        addLog(`!!! FATAL: YOUR SOUL HAS BEEN EXTINGUISHED.`);
      } else {
        set({ 
          currentEncounter: { ...currentEncounter, hp: newEnemyHp },
          playerHp: newPlayerHp,
          defenseActive: false
        });
      }
    }
  },
  defend: () => {
    const { currentEncounter, addLog, playerHp } = get();
    if (!currentEncounter) return;
    set({ defenseActive: true });
    addLog(`> YOU BRACE FOR THE IMPACT.`);
    const enemyDmg = Math.floor(Math.random() * 5) + 2;
    const finalDmg = Math.floor(enemyDmg / 2);
    const newPlayerHp = playerHp - finalDmg;
    addLog(`< THE ${currentEncounter.name.toUpperCase()} STRIKES YOUR GUARD FOR ${finalDmg} DAMAGE.`);
    if (newPlayerHp <= 0) {
      set({ status: 'GAMEOVER', playerHp: 0, currentAscii: ASCII_ART.GAMEOVER });
      addLog(`!!! FATAL: EVEN YOUR GUARD COULD NOT SAVE YOU.`);
    } else {
      set({ playerHp: newPlayerHp, defenseActive: false });
    }
  },
  reset: () => {
    set({
      status: 'START',
      playerHp: 20,
      roomsCleared: 0,
      logs: ['>>> SYSTEM REBOOTING...', '>>> AWAITING NEW SEED...'],
      currentEncounter: null,
      themeInput: ''
    });
  }
}));