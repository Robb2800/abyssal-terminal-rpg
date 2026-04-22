import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { CrtOverlay } from '@/components/game/CrtOverlay';
import { Viewport } from '@/components/game/Viewport';
import { Console } from '@/components/game/Console';
import { DiceOverlay } from '@/components/game/DiceOverlay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ORIGINS, OriginType } from '@/lib/dictionaries';
import { motion } from 'framer-motion';
export function HomePage() {
  const status = useGameStore(s => s.status);
  const themeInput = useGameStore(s => s.themeInput);
  const setThemeInput = useGameStore(s => s.setThemeInput);
  const startGame = useGameStore(s => s.startGame);
  const selectOrigin = useGameStore(s => s.selectOrigin);
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
            <p className="text-lg opacity-80 uppercase tracking-widest font-bold">Grid Protocol v1.4.0</p>
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
              [ INITIALIZE SYSTEM ]
            </Button>
          </div>
        </div>
      )}
      {status === 'ORIGIN_SELECT' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 space-y-12">
          <h2 className="text-4xl md:text-5xl font-bold text-glow uppercase tracking-tighter text-center">
            Select Your Abyssal Origin
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
            {(Object.keys(ORIGINS) as OriginType[]).map((key, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="border-2 border-[#39ff14]/50 p-6 flex flex-col items-center text-center space-y-4 hover:border-[#39ff14] hover:bg-[#39ff14]/5 group cursor-pointer transition-all"
                onClick={() => selectOrigin(key)}
              >
                <h3 className="text-2xl font-bold uppercase">{ORIGINS[key].name}</h3>
                <p className="text-sm opacity-70 italic">"{ORIGINS[key].desc}"</p>
                <div className="pt-4 space-y-1 text-xs uppercase font-bold text-[#39ff14]">
                  <div>STARTING ITEM: {ORIGINS[key].item}</div>
                  <div>BONUS: {ORIGINS[key].bonus}</div>
                </div>
                <Button className="mt-4 w-full bg-[#39ff14] text-black rounded-none group-hover:scale-105 transition-transform">
                  SELECT ORIGIN
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {(status === 'PLAYING' || status === 'EVENT') && (
        <div className="flex flex-col h-full w-full">
          <Viewport />
          <Console />
        </div>
      )}
      {status === 'GAMEOVER' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-7xl font-bold uppercase flicker text-glow">REDACTED</h2>
            <div className="space-y-2 text-xl font-mono">
              <p>ROOMS PENETRATED: {roomsCleared}</p>
              <p className="text-red-500 animate-pulse mt-4">YOUR SOUL HAS BEEN RECYCLED.</p>
            </div>
          </div>
          <Button
            onClick={reset}
            className="px-12 py-8 bg-[#39ff14] text-black hover:bg-black hover:text-[#39ff14] border-2 border-[#39ff14] rounded-none text-2xl font-bold transition-all transform hover:scale-110"
          >
            [ REBOOT ]
          </Button>
        </div>
      )}
    </div>
  );
}