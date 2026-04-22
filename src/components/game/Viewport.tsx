import React from 'react';
import { useGameStore } from '@/store/gameStore';
export function Viewport() {
  const playerHp = useGameStore(s => s.playerHp);
  const playerMaxHp = useGameStore(s => s.playerMaxHp);
  const mana = useGameStore(s => s.mana);
  const maxMana = useGameStore(s => s.maxMana);
  const strength = useGameStore(s => s.strength);
  const agility = useGameStore(s => s.agility);
  const roomsCleared = useGameStore(s => s.roomsCleared);
  const floor = useGameStore(s => s.floor);
  const currentAscii = useGameStore(s => s.currentAscii);
  const currentEncounter = useGameStore(s => s.currentEncounter);
  return (
    <div className="h-[60%] w-full flex flex-col border-b-2 border-[#39ff14]/50 relative overflow-hidden bg-[#050505]">
      {/* HUD Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 items-center px-6 py-4 border-b border-[#39ff14]/20 text-xs md:text-sm font-bold tracking-widest">
        <div className="space-y-2">
          <div className="flex gap-4 items-center">
            <span className="w-8">HP:</span>
            <div className="w-32 md:w-48 h-3 border border-[#39ff14] p-0.5">
              <div
                className="h-full bg-[#39ff14] transition-all duration-500 shadow-[0_0_8px_#39ff14]"
                style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
              />
            </div>
            <span className="tabular-nums">{playerHp}/{playerMaxHp}</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="w-8">MP:</span>
            <div className="w-32 md:w-48 h-3 border border-blue-500 p-0.5">
              <div
                className="h-full bg-blue-400 transition-all duration-500 shadow-[0_0_8px_blue]"
                style={{ width: `${(mana / maxMana) * 100}%` }}
              />
            </div>
            <span className="tabular-nums text-blue-400">{mana}/{maxMana}</span>
          </div>
        </div>
        <div className="hidden md:flex justify-center gap-6 text-2xs uppercase">
          <div className="border border-[#39ff14]/40 px-2 py-1">STR: {strength}</div>
          <div className="border border-[#39ff14]/40 px-2 py-1">AGI: {agility}</div>
        </div>
        <div className="text-right">
          FLOOR: <span className="text-glow text-lg">{floor}</span><br />
          ROOMS: <span className="text-glow">{roomsCleared}</span>
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
                NEXT: {currentEncounter.nextMove.toUpperCase()}
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
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#39ff14]/40" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#39ff14]/40" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#39ff14]/40" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#39ff14]/40" />
    </div>
  );
}