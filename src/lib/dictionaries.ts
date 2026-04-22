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
export const getThemeData = (themeStr: string): GameTheme => {
  const lower = themeStr.toLowerCase();
  if (lower.includes('book') || lower.includes('library') || lower.includes('read')) return 'library';
  if (lower.includes('cave') || lower.includes('cavern') || lower.includes('stone')) return 'cavern';
  if (lower.includes('jail') || lower.includes('prison') || lower.includes('chain')) return 'prison';
  return 'void';
};