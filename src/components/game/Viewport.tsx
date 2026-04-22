import React from 'react';
import { useGameStore, GridCell } from '@/store/gameStore';
import { MAP_SYMBOLS, ORIGINS } from '@/lib/dictionaries';
import { cn } from '@/lib/utils';
export function Viewport() {
  const playerHp = useGameStore(s => s.playerHp);
  const playerMaxHp = useGameStore(s => s.playerMaxHp);
  const mana = useGameStore(s => s.mana);
  const maxMana = useGameStore(s => s.maxMana);
  const strength = useGameStore(s => s.strength);
  const agility = useGameStore(s => s.agility);
  const origin = useGameStore(s => s.origin);
  const inventory = useGameStore(s => s.inventory);
  const floor = useGameStore(s => s.floor);
  const currentAscii = useGameStore(s => s.currentAscii);
  const currentEncounter = useGameStore(s => s.currentEncounter);
  const grid = useGameStore(s => s.grid);
  const position = useGameStore(s => s.position);
  const originName = origin ? ORIGINS[origin].name : 'UNKNOWN';
  return (
    <div className="h-[60%] w-full flex flex-col border-b-2 border-[#39ff14]/50 relative overflow-hidden bg-[#050505]">
      {/* HUD Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 items-center px-6 py-4 border-b border-[#39ff14]/20 text-xs md:text-sm font-bold tracking-widest">
        <div className="space-y-2">
          <div className="flex gap-4 items-center">
            <span className="w-8">HP:</span>
            <div className="w-24 md:w-32 h-2 border border-[#39ff14] p-0.5">
              <div
                className="h-full bg-[#39ff14] transition-all duration-500 shadow-[0_0_8px_#39ff14]"
                style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
              />
            </div>
            <span className="tabular-nums">{playerHp}/{playerMaxHp}</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="w-8">MP:</span>
            <div className="w-24 md:w-32 h-2 border border-blue-500 p-0.5">
              <div
                className="h-full bg-blue-400 transition-all duration-500 shadow-[0_0_8px_blue]"
                style={{ width: `${(mana / maxMana) * 100}%` }}
              />
            </div>
            <span className="tabular-nums text-blue-400">{mana}/{maxMana}</span>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center gap-1 text-[10px] uppercase">
          <div className="text-[#39ff14] font-bold">{originName}</div>
          <div className="flex gap-4">
            <div className="opacity-60">STR: {strength}</div>
            <div className="opacity-60">AGI: {agility}</div>
          </div>
          <div className="text-2xs text-blue-400 truncate max-w-[120px]">
            INV: {inventory.join(', ')}
          </div>
        </div>
        <div className="flex justify-end items-center gap-8">
          {/* Mini-Map */}
          <div className="flex flex-col border border-[#39ff14]/30 p-1 bg-black/40 scale-75 md:scale-90 origin-right">
            {grid.map((row, y) => (
              <div key={y} className="flex leading-none">
                {row.map((cell, x) => {
                  const isPlayer = position.x === x && position.y === y;
                  let char = MAP_SYMBOLS.UNEXPLORED;
                  if (isPlayer) char = MAP_SYMBOLS.PLAYER;
                  else if (cell.explored) {
                    if (cell.type === 'boss') char = MAP_SYMBOLS.BOSS;
                    else if (cell.type === 'event') char = MAP_SYMBOLS.EVENT;
                    else if (cell.type === 'treasure') char = MAP_SYMBOLS.TREASURE;
                    else char = MAP_SYMBOLS.EXPLORED;
                  }
                  return (
                    <span key={x} className={cn(
                      "text-[8px] md:text-[10px] p-0.5 font-mono",
                      isPlayer ? "text-white text-glow font-black" : "text-[#39ff14]/40",
                      cell.explored && !isPlayer && "text-[#39ff14]"
                    )}>
                      {char}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="text-right whitespace-nowrap">
            FLOOR: <span className="text-glow text-lg">{floor}</span><br />
            LOC: <span className="text-glow">[{position.x},{position.y}]</span>
          </div>
        </div>
      </div>
      {/* Main Art Viewport */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="animate-pulse-slow">
          <pre className="text-[#39ff14] text-[0.6rem] sm:text-xs md:text-sm leading-none whitespace-pre text-glow flicker font-mono">
            {currentAscii}
          </pre>
        </div>
        {currentEncounter && (
          <div className="mt-8 text-center space-y-1">
            <div className="text-xl font-bold uppercase tracking-[0.2em]">{currentEncounter.name}</div>
            <div className="text-sm opacity-80">
              {currentEncounter.revealed ? `HP: ${currentEncounter.hp} / ${currentEncounter.maxHp}` : '?? / ??'}
            </div>
            {currentEncounter.revealed && (
              <div className="text-2xs text-yellow-400 animate-pulse mt-1">
                INTENT: {currentEncounter.nextMove.toUpperCase()}
              </div>
            )}
            <div className="w-32 h-1 bg-[#39ff14]/20 mx-auto mt-2">
               <div
                className="h-full bg-[#39ff14]"
                style={{ width: `${(currentEncounter.hp / currentEncounter.maxHp) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#39ff14]/40" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#39ff14]/40" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#39ff14]/40" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#39ff14]/40" />
    </div>
  );
}