import { create } from 'zustand';
import { ASCII_ART, THEMES, getThemeData, GameTheme, ENEMY_MOVES, LORE_FRAGMENTS } from '@/lib/dictionaries';
export type GameStatus = 'START' | 'PLAYING' | 'GAMEOVER';
interface Encounter {
  name: string;
  hp: number;
  maxHp: number;
  nextMove: string;
  revealed: boolean;
}
interface GameState {
  status: GameStatus;
  themeInput: string;
  theme: GameTheme;
  floor: number;
  playerHp: number;
  playerMaxHp: number;
  mana: number;
  maxMana: number;
  strength: number;
  agility: number;
  roomsCleared: number;
  restUsedOnFloor: boolean;
  logs: string[];
  currentEncounter: Encounter | null;
  currentAscii: string;
  defenseActive: boolean;
  // Roll System
  isRolling: boolean;
  lastRoll: number;
  rollLabel: string;
  // Actions
  setThemeInput: (input: string) => void;
  startGame: () => void;
  nextRoom: () => void;
  triggerRoll: (label: string, callback: (roll: number) => void) => void;
  attack: () => void;
  defend: () => void;
  useSkill: (skillId: 'siphon' | 'analyze' | 'smoke') => void;
  searchRoom: () => void;
  rest: () => void;
  addLog: (msg: string) => void;
  reset: () => void;
}
export const useGameStore = create<GameState>((set, get) => ({
  status: 'START',
  themeInput: '',
  theme: 'void',
  floor: 1,
  playerHp: 20,
  playerMaxHp: 20,
  mana: 10,
  maxMana: 20,
  strength: 3,
  agility: 2,
  roomsCleared: 0,
  restUsedOnFloor: false,
  logs: ['>>> SYSTEM INITIALIZED...', '>>> AWAITING SEED INPUT...'],
  currentEncounter: null,
  currentAscii: ASCII_ART.VOID,
  defenseActive: false,
  isRolling: false,
  lastRoll: 0,
  rollLabel: '',
  setThemeInput: (input) => set({ themeInput: input }),
  startGame: () => {
    const { themeInput } = get();
    const theme = getThemeData(themeInput);
    set({
      status: 'PLAYING',
      theme,
      floor: 1,
      logs: [`>>> ENTERING THE ABYSS: ${theme.toUpperCase()}`, '>>> DARKNESS ENVELOPS YOU.'],
      playerHp: 20,
      playerMaxHp: 20,
      mana: 10,
      maxMana: 20,
      strength: 3,
      agility: 2,
      roomsCleared: 0,
      restUsedOnFloor: false,
      currentEncounter: null,
      currentAscii: ASCII_ART.DOORWAY
    });
  },
  addLog: (msg) => set((state) => ({ logs: [...state.logs, msg] })),
  triggerRoll: (label, callback) => {
    set({ isRolling: true, rollLabel: label, lastRoll: 0 });
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      set({ isRolling: false, lastRoll: roll });
      callback(roll);
      // Auto-clear the result display after a delay for cleaner UI
      setTimeout(() => {
        if (get().lastRoll === roll) {
          set({ lastRoll: 0 });
        }
      }, 2500);
    }, 1000);
  },
  nextRoom: () => {
    const { theme, roomsCleared, addLog, mana, maxMana } = get();
    const newRoomsCleared = roomsCleared + 1;
    const newFloor = Math.floor(newRoomsCleared / 5) + 1;
    const prevFloor = Math.floor(roomsCleared / 5) + 1;
    const newMana = Math.min(maxMana, mana + 3);
    if (newFloor > prevFloor) {
      addLog(`>>> DESCENDING TO FLOOR ${newFloor}...`);
      set({ restUsedOnFloor: false });
    }
    const rng = Math.random();
    if (rng < 0.5) {
      const themeData = THEMES[theme];
      const enemyName = themeData.enemies[Math.floor(Math.random() * themeData.enemies.length)];
      const moves = ENEMY_MOVES[enemyName] || ['Generic Strike'];
      set({
        currentEncounter: { 
          name: enemyName, 
          hp: 10 + (newFloor * 5), 
          maxHp: 10 + (newFloor * 5),
          nextMove: moves[Math.floor(Math.random() * moves.length)],
          revealed: false
        },
        currentAscii: ASCII_ART.SKULL,
        mana: newMana
      });
      addLog(`! ENCOUNTER: A ${enemyName.toUpperCase()} LURKS HERE.`);
    } else if (rng < 0.75) {
      set({
        playerHp: Math.min(get().playerMaxHp, get().playerHp + 5),
        currentAscii: ASCII_ART.CHEST,
        currentEncounter: null,
        mana: newMana
      });
      addLog(`+ TREASURE: YOU FIND A RESTORATIVE VIAL. HP RESTORED.`);
    } else {
      const themeData = THEMES[theme];
      const desc = themeData.rooms[Math.floor(Math.random() * themeData.rooms.length)];
      set({ currentAscii: ASCII_ART.DOORWAY, currentEncounter: null, mana: newMana });
      addLog(`- EMPTY: ${desc}`);
    }
    set({ roomsCleared: newRoomsCleared, floor: newFloor });
  },
  attack: () => {
    const { currentEncounter, strength, triggerRoll, addLog, playerHp, defenseActive, agility } = get();
    if (!currentEncounter || get().isRolling) return;
    triggerRoll('ATTACK', (roll) => {
      const damage = Math.floor((roll / 20) * 10) + strength;
      const newEnemyHp = currentEncounter.hp - damage;
      addLog(`> ATTACK: ROLLED ${roll} + ${strength} STR = ${damage} DMG.`);
      if (newEnemyHp <= 0) {
        addLog(`* VICTORY: THE FOE DISSOLVES INTO ASH.`);
        set({ currentEncounter: null, currentAscii: ASCII_ART.VOID });
      } else {
        const enemyDmgBase = Math.floor(Math.random() * 5) + 2;
        const agiBonus = defenseActive ? Math.floor(Math.random() * 4) + agility : 0;
        const finalDmg = Math.max(0, (defenseActive ? Math.floor(enemyDmgBase / 2) : enemyDmgBase) - agiBonus);
        const newPlayerHp = playerHp - finalDmg;
        addLog(`< ${currentEncounter.name.toUpperCase()} USES ${currentEncounter.nextMove.toUpperCase()} FOR ${finalDmg} DMG.`);
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
    });
  },
  defend: () => {
    if (get().isRolling) return;
    set({ defenseActive: true });
    get().addLog(`> YOU BRACE FOR THE IMPACT. (AGI BONUS ACTIVE)`);
  },
  useSkill: (skillId) => {
    const { mana, currentEncounter, playerHp, playerMaxHp, strength, agility, triggerRoll, addLog } = get();
    if (!currentEncounter || get().isRolling) return;
    if (skillId === 'siphon') {
      if (mana < 4) { addLog(`? INSUFFICIENT MANA`); return; }
      set({ mana: mana - 4 });
      triggerRoll('SIPHON', (roll) => {
        const dmg = Math.floor((roll / 20) * 8) + 2;
        addLog(`> SIPHON: ROLLED ${roll}. DRAINED ${dmg} HP FROM FOE.`);
        const newEnemyHp = currentEncounter.hp - dmg;
        const newPlayerHp = Math.min(playerMaxHp, playerHp + dmg);
        if (newEnemyHp <= 0) {
          set({ currentEncounter: null, currentAscii: ASCII_ART.VOID, playerHp: newPlayerHp });
          addLog(`* VICTORY: THE FOE IS TOTALLY CONSUMED.`);
        } else {
          set({ currentEncounter: { ...currentEncounter, hp: newEnemyHp }, playerHp: newPlayerHp });
        }
      });
    } else if (skillId === 'analyze') {
      if (mana < 2) { addLog(`? INSUFFICIENT MANA`); return; }
      set({ mana: mana - 2, currentEncounter: { ...currentEncounter, revealed: true } });
      addLog(`> ANALYZE: FOE VULNERABILITIES EXPOSED.`);
    } else if (skillId === 'smoke') {
      if (mana < 6) { addLog(`? INSUFFICIENT MANA`); return; }
      set({ mana: mana - 6 });
      triggerRoll('ESCAPE', (roll) => {
        const total = roll + agility;
        if (total >= 12) {
          addLog(`> ESCAPE: ROLLED ${roll} + ${agility} AGI. YOU VANISH IN SMOKE.`);
          set({ currentEncounter: null, currentAscii: ASCII_ART.DOORWAY });
        } else {
          addLog(`> FAIL: ROLLED ${roll} + ${agility} AGI. THE SMOKE CLEAR TOO SOON.`);
          const enemyDmg = (Math.floor(Math.random() * 5) + 2) * 2;
          const newPlayerHp = playerHp - enemyDmg;
          addLog(`< CRITICAL STRIKE! ${currentEncounter.name.toUpperCase()} HITS FOR ${enemyDmg} DMG.`);
          if (newPlayerHp <= 0) set({ status: 'GAMEOVER', playerHp: 0 });
          else set({ playerHp: newPlayerHp });
        }
      });
    }
  },
  searchRoom: () => {
    const { agility, triggerRoll, addLog, strength } = get();
    if (get().isRolling) return;
    triggerRoll('SEARCH', (roll) => {
      const total = roll + agility;
      if (total >= 15) {
        const rng = Math.random();
        if (rng < 0.3) {
          set({ strength: strength + 1 });
          addLog(`+ EMPOWERED: FOUND AN ANCIENT WHETSTONE. +1 STR.`);
        } else {
          const lore = LORE_FRAGMENTS[Math.floor(Math.random() * LORE_FRAGMENTS.length)];
          addLog(`+ LORE: ${lore}`);
        }
      } else {
        addLog(`- SEARCH: YOU FIND ONLY DUST AND DESPAIR.`);
      }
    });
  },
  rest: () => {
    const { restUsedOnFloor, playerHp, playerMaxHp, addLog, theme } = get();
    if (restUsedOnFloor) { addLog(`? ALREADY RESTED ON THIS FLOOR.`); return; }
    const heal = Math.floor(playerMaxHp * 0.5);
    set({ playerHp: Math.min(playerMaxHp, playerHp + heal), restUsedOnFloor: true });
    addLog(`+ REST: YOU RECOVER SOME STRENGTH. (+${heal} HP)`);
    if (Math.random() < 0.15) {
      const enemyName = THEMES[theme].enemies[0];
      set({
        currentEncounter: { name: `Ambushing ${enemyName}`, hp: 10, maxHp: 10, nextMove: 'Surprise Strike', revealed: false },
        currentAscii: ASCII_ART.SKULL
      });
      addLog(`! AMBUSH: YOUR SLUMBER IS INTERRUPTED!`);
    }
  },
  reset: () => set({
    status: 'START',
    playerHp: 20,
    mana: 10,
    roomsCleared: 0,
    floor: 1,
    logs: ['>>> SYSTEM REBOOTING...', '>>> AWAITING NEW SEED...'],
    currentEncounter: null,
    themeInput: '',
    lastRoll: 0,
    isRolling: false
  })
}));