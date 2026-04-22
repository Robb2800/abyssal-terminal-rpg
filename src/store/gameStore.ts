import { create } from 'zustand';
import {
  ASCII_ART, THEMES, getThemeData, GameTheme, ENEMY_MOVES,
  LORE_FRAGMENTS, OriginType, ORIGINS, NarrativeEvent, NARRATIVE_EVENTS
} from '@/lib/dictionaries';
export type GameStatus = 'START' | 'ORIGIN_SELECT' | 'PLAYING' | 'EVENT' | 'GAMEOVER';
export interface GridCell {
  type: 'combat' | 'treasure' | 'empty' | 'event' | 'boss';
  explored: boolean;
  eventId?: string;
}
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
  origin: OriginType | null;
  inventory: string[];
  allies: { automaton: boolean };
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
  currentEvent: NarrativeEvent | null;
  currentAscii: string;
  defenseActive: boolean;
  // Grid System
  grid: GridCell[][];
  position: { x: number, y: number };
  // Roll System
  isRolling: boolean;
  lastRoll: number;
  rollLabel: string;
  // Actions
  setThemeInput: (input: string) => void;
  startGame: () => void;
  selectOrigin: (origin: OriginType) => void;
  move: (dx: number, dy: number) => void;
  triggerRoll: (label: string, callback: (roll: number) => void) => void;
  attack: () => void;
  defend: () => void;
  useSkill: (skillId: 'siphon' | 'analyze' | 'smoke') => void;
  searchRoom: () => void;
  rest: () => void;
  resolveEvent: (choiceId: string) => void;
  addLog: (msg: string) => void;
  reset: () => void;
}
const INITIAL_GRID_SIZE = 5;
const createProceduralGrid = (): GridCell[][] => {
  const grid: GridCell[][] = [];
  for (let y = 0; y < INITIAL_GRID_SIZE; y++) {
    const row: GridCell[] = [];
    for (let x = 0; x < INITIAL_GRID_SIZE; x++) {
      const rng = Math.random();
      let type: GridCell['type'] = 'empty';
      let eventId: string | undefined;
      if (rng < 0.3) type = 'combat';
      else if (rng < 0.45) type = 'treasure';
      else if (rng < 0.6) {
        type = 'event';
        eventId = NARRATIVE_EVENTS[Math.floor(Math.random() * NARRATIVE_EVENTS.length)].id;
      }
      row.push({ type, explored: false, eventId });
    }
    grid.push(row);
  }
  // Fixed Start and Boss
  grid[0][2] = { type: 'empty', explored: true }; // Start
  grid[4][4] = { type: 'boss', explored: false }; // Final challenge
  return grid;
};
export const useGameStore = create<GameState>((set, get) => ({
  status: 'START',
  themeInput: '',
  theme: 'void',
  origin: null,
  inventory: [],
  allies: { automaton: false },
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
  currentEvent: null,
  currentAscii: ASCII_ART.VOID,
  defenseActive: false,
  isRolling: false,
  lastRoll: 0,
  rollLabel: '',
  grid: [],
  position: { x: 2, y: 0 },
  setThemeInput: (input) => set({ themeInput: input }),
  startGame: () => {
    const theme = getThemeData(get().themeInput);
    set({ status: 'ORIGIN_SELECT', theme });
  },
  selectOrigin: (originType) => {
    const originData = ORIGINS[originType];
    const grid = createProceduralGrid();
    set({
      status: 'PLAYING',
      origin: originType,
      inventory: [originData.item],
      strength: 3 + (originData.statBonus.strength || 0),
      agility: 2 + (originData.statBonus.agility || 0),
      grid,
      position: { x: 2, y: 0 },
      currentAscii: ASCII_ART.DOORWAY,
      roomsCleared: 0,
      logs: [`>>> ORIGIN: ${originData.name.toUpperCase()}`, `>>> ${originData.desc}`]
    });
  },
  move: (dx, dy) => {
    const { position, grid, status, origin, mana, maxMana, roomsCleared } = get();
    if (status !== 'PLAYING') return;
    const nx = position.x + dx;
    const ny = position.y + dy;
    if (nx < 0 || nx >= INITIAL_GRID_SIZE || ny < 0 || ny >= INITIAL_GRID_SIZE) return;
    const isFirstVisit = !grid[ny][nx].explored;
    const newGrid = grid.map((row, y) => 
      row.map((cell, x) => (x === nx && y === ny ? { ...cell, explored: true } : cell))
    );
    const originData = origin ? ORIGINS[origin] : null;
    const manaRegen = originData?.statBonus.manaRegen || 1;
    const newMana = Math.min(maxMana, mana + manaRegen);
    set({ 
      position: { x: nx, y: ny }, 
      grid: newGrid, 
      mana: newMana,
      roomsCleared: isFirstVisit ? roomsCleared + 1 : roomsCleared 
    });
    const cell = newGrid[ny][nx];
    const { theme, floor, addLog, playerMaxHp, playerHp } = get();
    if (cell.type === 'combat' || cell.type === 'boss') {
      const themeData = THEMES[theme];
      const name = cell.type === 'boss' ? 'ABYSSAL OVERSEER' : themeData.enemies[Math.floor(Math.random() * themeData.enemies.length)];
      const hpMult = cell.type === 'boss' ? 5 : 1;
      set({
        currentEncounter: {
          name,
          hp: (10 + (floor * 5)) * hpMult,
          maxHp: (10 + (floor * 5)) * hpMult,
          nextMove: ENEMY_MOVES[name]?.[0] || 'Strike',
          revealed: false
        },
        currentAscii: ASCII_ART.SKULL
      });
      addLog(`! ENCOUNTER: A ${name.toUpperCase()} BLOCKS YOUR PATH.`);
    } else if (cell.type === 'treasure') {
      set({ playerHp: Math.min(playerMaxHp, playerHp + 5), currentAscii: ASCII_ART.CHEST });
      addLog(`+ TREASURE: A VIAL OF GLOWING FLUID RESTORES YOUR HEALTH.`);
    } else if (cell.type === 'event' && cell.eventId) {
      const event = NARRATIVE_EVENTS.find(e => e.id === cell.eventId);
      if (event) {
        set({ status: 'EVENT', currentEvent: event, currentAscii: ASCII_ART.EVENT });
      }
    } else {
      set({ currentAscii: ASCII_ART.DOORWAY });
      addLog(`- EMPTY: THE SILENCE IS DEAFENING.`);
    }
  },
  resolveEvent: (choiceId) => {
    const { currentEvent } = get();
    if (!currentEvent) return;
    const choice = currentEvent.choices.find(c => c.id === choiceId);
    if (!choice) return;
    const updates = choice.effect(get());
    set({ ...updates, status: 'PLAYING', currentEvent: null, currentAscii: ASCII_ART.DOORWAY });
    get().addLog(`+ DECISION: ${choice.consequence}`);
  },
  addLog: (msg) => set((state) => ({ logs: [...state.logs, msg] })),
  triggerRoll: (label, callback) => {
    set({ isRolling: true, rollLabel: label, lastRoll: 0 });
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      set({ isRolling: false, lastRoll: roll });
      callback(roll);
      setTimeout(() => { if (get().lastRoll === roll) set({ lastRoll: 0 }); }, 2500);
    }, 1000);
  },
  attack: () => {
    const { currentEncounter, strength, triggerRoll, addLog, playerHp, defenseActive, agility, allies, roomsCleared } = get();
    if (!currentEncounter || get().isRolling) return;
    triggerRoll('ATTACK', (roll) => {
      let critMult = roll === 20 ? 1.5 : 1.0;
      let damage = Math.floor(((roll / 20) * 10 + strength) * critMult);
      if (allies.automaton) {
        damage += 3;
        addLog(`> ALLY: THE AUTOMATON FIRES A BOLT! (+3 DMG)`);
      }
      const newEnemyHp = currentEncounter.hp - damage;
      addLog(`> ATTACK: ROLLED ${roll} + ${strength} STR ${roll === 20 ? '(CRIT!)' : ''} = ${damage} DMG.`);
      if (newEnemyHp <= 0) {
        addLog(`* VICTORY: THE FOE DISSOLVES.`);
        const isBoss = currentEncounter.name === 'ABYSSAL OVERSEER';
        set({ 
          currentEncounter: null, 
          currentAscii: isBoss ? ASCII_ART.VOID : ASCII_ART.VOID,
          roomsCleared: isBoss ? roomsCleared + 10 : roomsCleared 
        });
        if (isBoss) addLog(`+ CONQUEST: THE OVERSEER IS VANQUISHED. YOU ASCEND TO LEGEND.`);
      } else {
        const enemyDmgBase = Math.floor(Math.random() * 5) + 2;
        const agiBonus = defenseActive ? Math.floor(Math.random() * 4) + agility : 0;
        const finalDmg = Math.max(0, (defenseActive ? Math.floor(enemyDmgBase / 2) : enemyDmgBase) - agiBonus);
        const newPlayerHp = playerHp - finalDmg;
        addLog(`< ${currentEncounter.name.toUpperCase()} DEALS ${finalDmg} DMG.`);
        if (newPlayerHp <= 0) {
          set({ status: 'GAMEOVER', playerHp: 0, currentAscii: ASCII_ART.GAMEOVER });
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
    if (!get().isRolling) { 
      set({ defenseActive: true }); 
      get().addLog(`> BRACING FOR IMPACT...`); 
    } 
  },
  useSkill: (skillId) => {
    const { mana, currentEncounter, playerHp, playerMaxHp, triggerRoll, addLog } = get();
    if (!currentEncounter || get().isRolling) return;
    if (skillId === 'siphon') {
      if (mana < 4) return;
      set({ mana: mana - 4 });
      triggerRoll('SIPHON', (roll) => {
        const dmg = Math.floor((roll / 20) * 8) + 2;
        const newEnemyHp = currentEncounter.hp - dmg;
        const newPlayerHp = Math.min(playerMaxHp, playerHp + dmg);
        set({ currentEncounter: newEnemyHp <= 0 ? null : { ...currentEncounter, hp: newEnemyHp }, playerHp: newPlayerHp });
        addLog(`> SIPHON: DRAINED ${dmg} HP.`);
      });
    } else if (skillId === 'analyze') {
      if (mana < 2) return;
      set({ mana: mana - 2, currentEncounter: { ...currentEncounter, revealed: true } });
      addLog(`> ANALYZE: WEAKNESSES REVEALED.`);
    } else if (skillId === 'smoke') {
      if (mana < 6) return;
      set({ mana: mana - 6 });
      triggerRoll('ESCAPE', (roll) => {
        if (roll + get().agility >= 12) {
          set({ currentEncounter: null, currentAscii: ASCII_ART.DOORWAY });
          addLog(`> ESCAPE: YOU VANISH.`);
        } else {
          addLog(`> FAIL: ESCAPE FAILED.`);
        }
      });
    }
  },
  searchRoom: () => {
    const { agility, triggerRoll, addLog, strength } = get();
    triggerRoll('SEARCH', (roll) => {
      if (roll + agility >= 15) {
        if (Math.random() < 0.3) {
          set({ strength: strength + 1 });
          addLog(`+ EMPOWERED: +1 STR.`);
        } else {
          addLog(`+ LORE: ${LORE_FRAGMENTS[Math.floor(Math.random() * LORE_FRAGMENTS.length)]}`);
        }
      } else addLog(`- SEARCH: NOTHING FOUND.`);
    });
  },
  rest: () => {
    const { restUsedOnFloor, playerHp, playerMaxHp, addLog } = get();
    if (restUsedOnFloor) return;
    set({ playerHp: Math.min(playerMaxHp, playerHp + 10), restUsedOnFloor: true });
    addLog(`+ REST: RECOVERED STRENGTH.`);
  },
  reset: () => set({
    status: 'START',
    playerHp: 20,
    playerMaxHp: 20,
    mana: 10,
    maxMana: 20,
    strength: 3,
    agility: 2,
    roomsCleared: 0,
    floor: 1,
    logs: ['>>> REBOOTING...'],
    currentEncounter: null,
    currentEvent: null,
    origin: null,
    inventory: [],
    allies: { automaton: false },
    position: { x: 2, y: 0 },
    restUsedOnFloor: false,
    currentAscii: ASCII_ART.VOID
  })
}));