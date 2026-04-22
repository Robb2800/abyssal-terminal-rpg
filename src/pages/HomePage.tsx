import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { CrtOverlay } from '@/components/game/CrtOverlay';
import { Viewport } from '@/components/game/Viewport';
import { Console } from '@/components/game/Console';
import { DiceOverlay } from '@/components/game/DiceOverlay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export function HomePage() {
  const status = useGameStore(s => s.status);
  const themeInput = useGameStore(s => s.themeInput);
  const setThemeInput = useGameStore(s => s.setThemeInput);
  const startGame = useGameStore(s => s.startGame);
  const reset = useGameStore(s => s.reset);
  const roomsCleared = useGameStore(s => s.roomsCleared);
  const floor = useGameStore(s => s.floor);
  return (
    <div className="min-h-screen h-screen flex flex-col bg-black text-[#39ff14] font-mono selection:bg-[#39ff14] selection:text-black overflow-hidden relative">
      <CrtOverlay />
      <DiceOverlay />
      {status === 'START' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 space-y-8 animate-pulse-slow">
          <div className="text-center space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-glow flicker">
              ABYSSAL<br />TERMINAL
            </h1>
            <p className="text-lg opacity-80">v1.1.0 - POLYHEDRAL ENGINE</p>
          </div>
          <div className="max-w-md w-full space-y-6">
            <div className="space-y-2 text-center">
              <label className="text-sm">ENTER THE NATURE OF YOUR NIGHTMARE</label>
              <Input
                value={themeInput}
                onChange={(e) => setThemeInput(e.target.value)}
                placeholder="HAUNTED LIBRARY / COLD CAVERN..."
                className="bg-black border-2 border-[#39ff14] text-[#39ff14] placeholder:text-[#39ff14]/30 focus-visible:ring-0 rounded-none h-12 text-center"
                onKeyDown={(e) => e.key === 'Enter' && startGame()}
              />
            </div>
            <Button
              onClick={startGame}
              className="w-full bg-[#39ff14] text-black hover:bg-black hover:text-[#39ff14] border-2 border-[#39ff14] rounded-none h-16 text-xl font-bold transition-colors"
            >
              [ ENTER THE ABYSS ]
            </Button>
          </div>
          <div className="text-2xs opacity-40 text-center uppercase tracking-widest">
            (C) 1984 ABYSS-SOFT INDUSTRIES. ALL RIGHTS RESERVED.
          </div>
        </div>
      )}
      {status === 'PLAYING' && (
        <div className="flex flex-col h-full w-full">
          <Viewport />
          <Console />
        </div>
      )}
      {status === 'GAMEOVER' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 space-y-12">
          <div className="text-center space-y-6">
            <div className="text-[#39ff14] text-glow whitespace-pre font-bold text-xs md:text-sm animate-bounce">
              {`
   _____  _______  __  __ ______
  / ____||  ___  ||  \\/  ||  ____|
 | |  __ | |   | || \\  / || |__
 | | |_ || |   | || |\\/| ||  __|
 | |__| || |___| || |  | || |____
  \\_____||_______||_|  |_||______|
              `}
            </div>
            <h2 className="text-4xl font-bold uppercase">Your Journey Ends</h2>
            <div className="space-y-2 text-xl font-mono">
              <p>FLOOR REACHED: {floor}</p>
              <p>ROOMS SURVIVED: {roomsCleared}</p>
              <p className="text-red-500 animate-pulse mt-4">The abyss consumes all memory.</p>
            </div>
          </div>
          <Button
            onClick={reset}
            className="px-12 py-8 bg-[#39ff14] text-black hover:bg-black hover:text-[#39ff14] border-2 border-[#39ff14] rounded-none text-2xl font-bold transition-all transform hover:scale-110"
          >
            [ REBOOT SYSTEM ]
          </Button>
        </div>
      )}
    </div>
  );
}