import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { MAP_SYMBOLS, ORIGINS, INTENT_TYPES } from '@/lib/dictionaries';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Shield, Zap, Target, Activity, Droplets } from 'lucide-react';
export function Viewport() {
  const playerHp = useGameStore(s => s.playerHp);
  const playerMaxHp = useGameStore(s => s.playerMaxHp);
  const mana = useGameStore(s => s.mana);
  const maxMana = useGameStore(s => s.maxMana);
  const strength = useGameStore(s => s.strength);
  const agility = useGameStore(s => s.agility);
  const origin = useGameStore(s => s.origin);
  const floor = useGameStore(s => s.floor);
  const currentAscii = useGameStore(s => s.currentAscii);
  const currentEncounter = useGameStore(s => s.currentEncounter);
  const grid = useGameStore(s => s.grid);
  const position = useGameStore(s => s.position);
  const bossPhase = useGameStore(s => s.bossPhase);
  const originData = origin ? ORIGINS[origin] : null;
  return (
    <div className="h-[60%] w-full flex flex-col border-b-2 border-[#39ff14]/50 relative overflow-hidden bg-[#050505]">
      <div className="grid grid-cols-2 md:grid-cols-3 items-center px-4 py-3 border-b border-[#39ff14]/20 text-[10px] font-bold tracking-widest">
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <Activity size={12} className="text-red-500" />
            <div className="w-20 md:w-32 h-2 border border-[#39ff14] p-0.5">
              <div className="h-full bg-[#39ff14]" style={{ width: `${(playerHp / playerMaxHp) * 100}%` }} />
            </div>
            <span className="tabular-nums">{playerHp}/{playerMaxHp}</span>
          </div>
          <div className="flex gap-2 items-center">
            <Droplets size={12} className="text-blue-500" />
            <div className="w-20 md:w-32 h-2 border border-blue-500 p-0.5">
              <div className="h-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" style={{ width: `${(mana / maxMana) * 100}%` }} />
            </div>
            <span className="tabular-nums text-blue-400">{mana}/{maxMana}</span>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center gap-1 uppercase">
          <div className="text-[#39ff14] font-black text-xs flicker">SECTOR: 00{floor}</div>
          <div className="flex gap-4 opacity-70">
            <div>STR: {strength}</div>
            <div>AGI: {agility}</div>
          </div>
        </div>
        <div className="flex justify-end items-center gap-4">
          <div className="flex flex-col border border-[#39ff14]/30 p-1 bg-black/40 scale-75 md:scale-90 origin-right shadow-[0_0_10px_rgba(57,255,20,0.1)]">
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
                      "text-[8px] md:text-[10px] p-0.5 font-mono transition-colors",
                      isPlayer ? "text-white text-glow font-black animate-pulse" : "text-[#39ff14]/30",
                      cell.explored && !isPlayer && "text-[#39ff14]"
                    )}>{char}</span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <pre className="text-[#39ff14] text-[0.4rem] xs:text-[0.5rem] sm:text-[0.65rem] md:text-sm leading-none whitespace-pre text-glow flicker font-mono animate-pulse-slow max-w-full overflow-hidden">
          {currentAscii}
        </pre>
        {currentEncounter && (
          <div className="mt-6 text-center space-y-2 max-w-xs w-full">
            <div className="text-lg font-black uppercase tracking-widest text-glow">{currentEncounter.name}</div>
            {currentEncounter.name === 'ABYSSAL OVERSEER' && (
              <div className="flex justify-center gap-1 mb-1">
                {[1, 2, 3].map(p => (
                  <div key={p} className={cn("w-full h-1 border border-[#39ff14]/30", p <= bossPhase ? "bg-[#39ff14] shadow-[0_0_5px_#39ff14]" : "bg-black")} />
                ))}
              </div>
            )}
            <div className="w-full h-1.5 bg-[#39ff14]/10 border border-[#39ff14]/50 p-0.5">
               <div className="h-full bg-[#39ff14] shadow-[0_0_10px_#39ff14]" style={{ width: `${(currentEncounter.hp / currentEncounter.maxHp) * 100}%` }} />
            </div>
            <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-tighter">
              <span className={cn(INTENT_TYPES[currentEncounter.intent].color, "animate-pulse")}>
                TARGETING: {currentEncounter.nextMove.toUpperCase()}
              </span>
              <span className="opacity-50">{currentEncounter.revealed ? `STR: ${currentEncounter.hp}` : 'HP: ???'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}