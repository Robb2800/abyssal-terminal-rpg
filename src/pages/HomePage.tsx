import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { CrtOverlay } from '@/components/game/CrtOverlay';
import { Viewport } from '@/components/game/Viewport';
import { Console } from '@/components/game/Console';
import { DiceOverlay } from '@/components/game/DiceOverlay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ORIGINS, OriginType, ASCII_ART } from '@/lib/dictionaries';
import { motion, AnimatePresence } from 'framer-motion';
export function HomePage() {
  const status = useGameStore(s => s.status);
  const themeInput = useGameStore(s => s.themeInput);
  const setThemeInput = useGameStore(s => s.setThemeInput);
  const startGame = useGameStore(s => s.startGame);
  const selectOrigin = useGameStore(s => s.selectOrigin);
  const reset = useGameStore(s => s.reset);
  const roomsCleared = useGameStore(s => s.roomsCleared);
  return (
    <div className="min-h-screen h-screen flex flex-col bg-black text-[#39ff14] font-mono selection:bg-[#39ff14] selection:text-black overflow-hidden relative">
      <CrtOverlay />
      <DiceOverlay />
      <AnimatePresence mode="wait">
        {status === 'START' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 z-10 space-y-8"
          >
            <div className="text-center space-y-4">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-glow flicker">
                ABYSSAL<br />TERMINAL
              </h1>
              <p className="text-lg opacity-80 uppercase tracking-widest font-bold animate-pulse">Grid Protocol v1.5.2</p>
            </div>
            <div className="max-w-md w-full space-y-6">
              <div className="space-y-2 text-center">
                <label className="text-xs uppercase opacity-60">Enter the nature of your nightmare</label>
                <Input
                  value={themeInput}
                  onChange={(e) => setThemeInput(e.target.value)}
                  placeholder="e.g. HAUNTED LIBRARY"
                  className="bg-black border-2 border-[#39ff14] text-[#39ff14] placeholder:text-[#39ff14]/30 focus-visible:ring-0 rounded-none h-12 text-center text-xl uppercase font-bold"
                  onKeyDown={(e) => e.key === 'Enter' && startGame()}
                  autoFocus
                />
              </div>
              <Button
                onClick={startGame}
                className="w-full bg-[#39ff14] text-black hover:bg-black hover:text-[#39ff14] border-2 border-[#39ff14] rounded-none h-16 text-xl font-black transition-all hover:scale-[1.02] active:scale-95"
              >
                [ INITIALIZE SYSTEM ]
              </Button>
            </div>
          </motion.div>
        )}
        {status === 'ORIGIN_SELECT' && (
          <motion.div 
            key="origin"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 z-10 space-y-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-glow uppercase tracking-tighter text-center">
              SELECT YOUR ABYSSAL ORIGIN
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
              {(Object.keys(ORIGINS) as OriginType[]).map((key, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="border-2 border-[#39ff14]/50 p-6 flex flex-col items-center text-center space-y-4 hover:border-[#39ff14] hover:bg-[#39ff14]/5 group cursor-pointer transition-all"
                  onClick={() => selectOrigin(key)}
                >
                  <h3 className="text-2xl font-black uppercase text-glow group-hover:text-white transition-colors">{ORIGINS[key].name}</h3>
                  <p className="text-sm opacity-70 italic leading-relaxed">"{ORIGINS[key].desc}"</p>
                  <div className="pt-4 space-y-1 text-xs uppercase font-bold text-[#39ff14]">
                    <div className="opacity-60">STARTING ITEM:</div>
                    <div className="text-white">{ORIGINS[key].item}</div>
                    <div className="opacity-60 mt-2">BONUS:</div>
                    <div className="text-white">{ORIGINS[key].bonus}</div>
                  </div>
                  <Button className="mt-4 w-full bg-[#39ff14] text-black rounded-none font-bold group-hover:scale-105 transition-transform">
                    SELECT ORIGIN
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        {(status === 'PLAYING' || status === 'EVENT') && (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full w-full"
          >
            <Viewport />
            <Console />
          </motion.div>
        )}
        {status === 'GAMEOVER' && (
          <motion.div 
            key="gameover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-8 z-10 space-y-8"
          >
            <div className="text-center space-y-6">
              <pre className="text-[#39ff14] text-[0.4rem] md:text-xs leading-[0.6rem] md:leading-none whitespace-pre text-glow flicker font-mono mb-8 opacity-80">
                {ASCII_ART.GAMEOVER}
              </pre>
              <div className="space-y-4 text-2xl font-black tracking-widest uppercase">
                <p className="opacity-50">Sectors Explored: <span className="text-white text-glow">{roomsCleared}</span></p>
                <div className="h-[2px] w-48 bg-[#39ff14]/30 mx-auto" />
                <p className="text-red-500 animate-pulse text-3xl">Biological Unit Terminated</p>
              </div>
            </div>
            <Button
              onClick={reset}
              className="px-16 py-8 bg-[#39ff14] text-black hover:bg-black hover:text-[#39ff14] border-2 border-[#39ff14] rounded-none text-2xl font-black transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_20px_#39ff14]"
            >
              [ REBOOT SYSTEM ]
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}