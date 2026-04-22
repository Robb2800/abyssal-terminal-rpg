export const ASCII_ART = {
  SKULL: `
      .-------.
     /   _   \\
    |  (o) (o)  |
    |    <    |
     \\  '---'  /
      '-------'
  `,
  CHEST: `
    ._____________.
    |  _________  |
    | |         | |
    | |   [X]   | |
    | |_________| |
    |_____________|
  `,
  DOORWAY: `
     __________
    |  ______  |
    | |      | |
    | |      | |
    | |      | |
    | |______| |
    |__________|
  `,
  GAMEOVER: `
   _____  _______  __  __ ______
  / ____||  ___  ||  \\/  ||  ____|
 | |  __ | |   | || \\  / || |__
 | | |_ || |   | || |\\/| ||  __|
 | |__| || |___| || |  | || |____
  \\_____||_______||_|  |_||______|
   ____  __      __ ______  _____
  / __ \\ \\ \\    / /|  ____||  __ \\
 | |  | | \\ \\  / / | |__   | |__) |
 | |  | |  \\ \\/ /  |  __|  |  _  /
 | |__| |   \\  /   | |____ | | \\ \\
  \\____/     \\/    |______||_|  \\_\\
  `,
  VOID: `
    . . . . .
     . . . .
    . . . . .
  `,
  EVENT: `
     .--------.
    /  ????  \\
   |  ?    ?  |
    \\  ????  /
     '--  --'
        \\/
  `
};
export type GameTheme = 'library' | 'cavern' | 'prison' | 'void';
export const THEMES: Record<GameTheme, { enemies: string[], rooms: string[] }> = {
  library: {
    enemies: ['Paper-Cut Wraith', 'Ink-Stained Golem', 'Dust-Mite Swarm', 'Silent Librarian'],
    rooms: ['A corridor of rotting parchment.', 'Shelves that stretch into the dark.', 'The smell of old leather and decay.', 'A reading room with flickering candles.']
  },
  cavern: {
    enemies: ['Stalactite Spider', 'Echoing Shadow', 'Glow-Worm King', 'Cave-In Elemental'],
    rooms: ['Damp walls dripping with slime.', 'A narrow passage through cold stone.', 'The sound of rushing water below.', 'A wide chamber filled with moss.']
  },
  prison: {
    enemies: ['Rust-Iron Jailer', 'Chain-Rattle Specter', 'Starved Prisoner', 'Executioner Drone'],
    rooms: ['Rusty bars and cold floors.', 'The echo of distant screams.', 'A cell that hasn\'t been opened in years.', 'The scent of iron and misery.']
  },
  void: {
    enemies: ['Entropy Fractal', 'Memory Eater', 'Silent Whisper', 'Null Pointer'],
    rooms: ['A space where logic fails.', 'Infinite darkness in all directions.', 'White noise echoing through your soul.', 'Nothingness that feels heavy.']
  }
};
export const ENEMY_MOVES: Record<string, string[]> = {
  'Paper-Cut Wraith': ['Serrated Slice', 'Ink Blight', 'Ghostly Shiver'],
  'Ink-Stained Golem': ['Heavy Slam', 'Staining Grasp', 'Paper Weight'],
  'Stalactite Spider': ['Venom Drip', 'Web Trap', 'Ceiling Drop'],
  'Echoing Shadow': ['Sonic Screech', 'Mimic Strike', 'Dark Pulse'],
  'Rust-Iron Jailer': ['Chain Lash', 'Iron Lockdown', 'Rusty Puncture'],
  'Entropy Fractal': ['Geometric Void', 'Logic Loop', 'Chaos Beam'],
  'Null Pointer': ['Reference Error', 'Memory Leak', 'Stack Overflow']
};
export const LORE_FRAGMENTS = [
  "The walls hum with a frequency that makes your teeth ache.",
  "You find a scrap of a map. It shows no exit, only deeper levels.",
  "A faint carving in the stone reads: 'The light was a lie.'",
  "The shadows here don't follow the flicker of your torch.",
  "You feel the weight of a thousand dead eyes watching your every step.",
  "A rusted coin from an empire that never existed lies in the dust."
];
export type OriginType = 'collector' | 'exile' | 'seeker';
export const ORIGINS: Record<OriginType, {
  name: string,
  desc: string,
  item: string,
  bonus: string,
  statBonus: { strength?: number, agility?: number, manaRegen?: number }
}> = {
  collector: {
    name: 'Debt Collector',
    desc: 'I seek a reckoning for the debts unpaid by the stars.',
    item: 'Golden Compass',
    bonus: '+1 STR, Wealth Sense',
    statBonus: { strength: 1, manaRegen: 1 }
  },
  exile: {
    name: 'Exile',
    desc: 'I seek a new throne in the ruins of the old world.',
    item: 'Sharpened Crown',
    bonus: '+1 AGI, Regal Presence',
    statBonus: { agility: 1, manaRegen: 1 }
  },
  seeker: {
    name: 'Seeker',
    desc: 'I seek the fundamental truth hidden in the static.',
    item: 'Ancient Lens',
    bonus: '+2 MP Regen, True Sight',
    statBonus: { manaRegen: 2 }
  }
};
export interface NarrativeChoice {
  id: string;
  text: string;
  consequence: string;
  effect: (state: any) => Partial<any>;
}
export interface NarrativeEvent {
  id: string;
  title: string;
  prose: string;
  choices: NarrativeChoice[];
}
export const NARRATIVE_EVENTS: NarrativeEvent[] = [
  {
    id: 'automaton',
    title: 'THE WOUNDED AUTOMATON',
    prose: 'A brass-plated construct lies slumped against a pillar, sparking with arcane energy. Its optic sensor flickers with a desperate blue light.',
    choices: [
      {
        id: 'take_core',
        text: 'EXTRACT POWER CORE',
        consequence: 'Gain +5 Strength, but the room is forever CURSED.',
        effect: (s) => ({ strength: s.strength + 5, inventory: [...s.inventory, 'Cracked Core'] })
      },
      {
        id: 'repair',
        text: 'REPAIR CIRCUITRY (-10 MP)',
        consequence: 'The Automaton joins you as an ally.',
        effect: (s) => ({ mana: Math.max(0, s.mana - 10), allies: { ...s.allies, automaton: true } })
      }
    ]
  },
  {
    id: 'shrine',
    title: 'VOID SHRINE',
    prose: 'An altar of black glass pulses with the rhythm of a slow-beating heart. It demands a sacrifice of memory or flesh.',
    choices: [
      {
        id: 'sacrifice_blood',
        text: 'OFFER VITALITY (-5 HP)',
        consequence: 'Gain permanent +5 Max Mana.',
        effect: (s) => ({ playerHp: Math.max(1, s.playerHp - 5), maxMana: s.maxMana + 5 })
      },
      {
        id: 'sacrifice_mana',
        text: 'OFFER ESSENCE (-5 MP)',
        consequence: 'Gain permanent +2 Agility.',
        effect: (s) => ({ mana: Math.max(0, s.mana - 5), agility: s.agility + 2 })
      }
    ]
  }
];
export const MAP_SYMBOLS = {
  PLAYER: '[P]',
  EXPLORED: '[X]',
  UNEXPLORED: '[ ]',
  EVENT: '[?]',
  BOSS: '[B]',
  TREASURE: '[T]'
};
export const getThemeData = (themeStr: string): GameTheme => {
  const lower = themeStr.toLowerCase();
  if (lower.includes('book') || lower.includes('library') || lower.includes('read')) return 'library';
  if (lower.includes('cave') || lower.includes('cavern') || lower.includes('stone')) return 'cavern';
  if (lower.includes('jail') || lower.includes('prison') || lower.includes('chain')) return 'prison';
  return 'void';
};