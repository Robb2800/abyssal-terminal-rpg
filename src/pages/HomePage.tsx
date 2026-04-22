import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CrtOverlay } from '@/components/game/CrtOverlay';
import { Viewport } from '@/components/game/Viewport';
import { Console } from '@/components/game/Console';
import { DiceOverlay } from '@/components/game/DiceOverlay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ORIGINS, OriginType, ASCII_ART, ENDINGS } from '@/lib/dictionaries';
import { motion, AnimatePresence } from 'framer-motion';
export function HomePage() {
  const status = useGameStore(s => s.status);
  const themeInput = useGameStore(s => s.themeInput);
  const setThemeInput = useGameStore(s => s.setThemeInput);
  const startGame = useGameStore(s => s.startGame);
  const selectOrigin = useGameStore(s => s.selectOrigin);
  const reset = useGameStore(s => s.reset);
  const roomsCleared = useGameStore(s => s.roomsCleared);
  const killCount = useGameStore(s => s.killCount);
  const activeEnding = useGameStore(s => s.activeEnding);
  const currentEvent = useGameStore(s => s.currentEvent);
  const currentEncounter = useGameStore(s => s.currentEncounter);
  const bossPhase = useGameStore(s => s.bossPhase);
  const resolveEvent = useGameStore(s => s.resolveEvent);
  const resolveEnding = useGameStore(s => s.resolveEnding);
  const move = useGameStore(s => s.move);
  const isRolling = useGameStore(s => s.isRolling);
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'PLAYING' || isRolling) return;
      switch (e.key) {
        case 'ArrowUp': move(0, -1); break;
        case 'ArrowDown': move(0, 1); break;
        case 'ArrowLeft': move(-1, 0); break;
        case 'ArrowRight': move(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, isRolling, move]);
  return (
    <div className="min-h-screen h-screen flex flex-col bg-black text-[#39ff14] font-mono selection:bg-[#39ff14] selection:text-black overflow-hidden relative">
      <CrtOverlay />
      <DiceOverlay />
      <AnimatePresence mode="wait">
        {status === 'START' && (
          <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-8 z-10 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-glow flicker leading-none uppercase">ABYSSAL<br />TERMINAL</h1>
              <p className="text-sm md:text-lg opacity-80 uppercase tracking-widest font-bold animate-pulse text-[#39ff14]/60">PROTOCOL: NIGHTMARE_01</p>
            </div>
            <div className="max-w-md w-full space-y-6">
              <Input value={themeInput} onChange={(e) => setThemeInput(e.target.value)} placeholder="ENTER FEAR SEED..." className="bg-black border-2 border-[#39ff14] text-[#39ff14] placeholder:text-[#39ff14]/20 rounded-none h-14 text-center text-xl uppercase font-bold focus:ring-0 focus:border-[#39ff14] transition-all" onKeyDown={(e) => e.key === 'Enter' && startGame()} autoFocus />
              <Button onClick={startGame} className="w-full bg-[#39ff14] text-black hover:bg-black hover:text-[#39ff14] border-2 border-[#39ff14] rounded-none h-16 text-xl font-black transition-all shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)]">INITIATE CONNECTION</Button>
            </div>
          </motion.div>
        )}
        {status === 'ORIGIN_SELECT' && (
          <motion.div key="origin" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-8 z-10 space-y-12">
            <h2 className="text-4xl font-black text-glow uppercase tracking-tighter border-b-4 border-[#39ff14] pb-2">SELECT BIOLOGICAL ANCHOR</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
              {(Object.keys(ORIGINS) as OriginType[]).map((key, i) => (
                <motion.div key={key} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="border-2 border-[#39ff14]/30 p-8 flex flex-col items-center text-center space-y-6 hover:border-[#39ff14] hover:bg-[#39ff14]/5 group cursor-pointer transition-all relative overflow-hidden" onClick={() => selectOrigin(key)}>
                  <div className="absolute top-0 right-0 p-2 text-[8px] opacity-20 group-hover:opacity-100 transition-opacity">ANC_{i.toString().padStart(2, '0')}</div>
                  <h3 className="text-2xl font-black uppercase text-glow group-hover:scale-110 transition-transform">{ORIGINS[key].name}</h3>
                  <p className="text-[10px] md:text-xs opacity-60 italic leading-relaxed">"{ORIGINS[key].desc}"</p>
                  <div className="pt-4 text-[10px] uppercase font-bold text-[#39ff14] space-y-2">
                    <div className="border border-[#39ff14]/20 p-2 bg-black">RELIC: {ORIGINS[key].item}</div>
                    <div className="text-white pt-2 leading-tight opacity-90">{ORIGINS[key].passive}</div>
                  </div>
                  <Button className="w-full bg-[#39ff14] text-black rounded-none font-black hover:scale-105 transition-transform group-hover:bg-[#39ff14]">BIND ARCHETYPE</Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        {(status === 'PLAYING' || status === 'EVENT') && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full w-full relative">
            <Viewport />
            <Console />
            <AnimatePresence>
              {status === 'EVENT' && currentEncounter?.name === 'ABYSSAL OVERSEER' && bossPhase === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-12 text-center border-4 border-[#39ff14]">
                  <pre className="text-red-500 text-[0.4rem] md:text-xs leading-none whitespace-pre flicker mb-12">{ASCII_ART.BOSS}</pre>
                  <h3 className="text-5xl font-black text-glow mb-8 uppercase tracking-tighter text-red-500">SYSTEM_OVERRIDE: FINAL_CHOICE</h3>
                  <p className="max-w-2xl text-lg mb-12 opacity-80 leading-relaxed uppercase tracking-widest font-bold">The Abyssal Core is exposed. The Grid waits for your decision. One strike to define a thousand realities.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                    <Button onClick={() => resolveEnding('THRONE')} className="h-24 bg-black border-4 border-red-500 text-red-500 hover:bg-red-500 hover:text-black font-black text-xl rounded-none transition-all">ASSUME CONTROL</Button>
                    <Button onClick={() => resolveEnding('DESTRUCTION')} className="h-24 bg-black border-4 border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14] hover:text-black font-black text-xl rounded-none transition-all">TERMINATE GRID</Button>
                    <Button onClick={() => resolveEnding('ESCAPE')} className="h-24 bg-black border-4 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black font-black text-xl rounded-none transition-all">ASCEND BEYOND</Button>
                  </div>
                </motion.div>
              )}
              {status === 'EVENT' && currentEvent && currentEncounter?.name !== 'ABYSSAL OVERSEER' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-4 md:inset-12 z-[100] bg-black/95 flex flex-col p-8 border-4 border-[#39ff14] shadow-[0_0_50px_rgba(57,255,20,0.5)]">
                  <div className="text-center mb-8">
                    <pre className="text-[#39ff14]/30 text-[0.4rem] mb-4">{ASCII_ART.EVENT}</pre>
                    <h3 className="text-3xl font-black text-glow uppercase tracking-tighter">{currentEvent.title}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto mb-8 pr-4">
                    <p className="text-lg md:text-xl leading-relaxed font-bold opacity-90">{currentEvent.prose}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentEvent.choices.map(c => (
                      <Button key={c.id} onClick={() => resolveEvent(c.id)} className="h-20 md:h-24 bg-black border-2 border-[#39ff14] text-[#39ff14] rounded-none flex flex-col items-center justify-center gap-2 hover:bg-[#39ff14] hover:text-black transition-all p-4">
                        <span className="font-black uppercase text-lg">{c.text}</span>
                        <span className="text-[10px] opacity-70 italic">{c.consequence}</span>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
        {status === 'VICTORY' && activeEnding && (
          <motion.div key="victory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 z-10 text-center space-y-12">
            <div className="space-y-6">
              <pre className="text-[#39ff14] text-[0.45rem] md:text-xs leading-none whitespace-pre text-glow flicker font-mono mb-8 scale-110">{ENDINGS[activeEnding].ascii}</pre>
              <h2 className="text-6xl font-black text-glow uppercase tracking-widest text-[#39ff14]">{ENDINGS[activeEnding].title}</h2>
              <p className="max-w-3xl mx-auto text-xl leading-relaxed opacity-90 border-l-4 border-[#39ff14] pl-6 font-bold">{ENDINGS[activeEnding].prose}</p>
            </div>
            <div className="grid grid-cols-3 gap-8 border-y-2 border-[#39ff14]/30 py-6 w-full max-w-2xl mx-auto text-sm font-black uppercase tracking-widest">
              <div>SECTORS: {roomsCleared}</div>
              <div className="text-white">EVOLUTION: COMPLETE</div>
              <div>KILLS: {killCount}</div>
            </div>
            <Button onClick={reset} className="px-12 py-8 bg-[#39ff14] text-black border-4 border-[#39ff14] rounded-none text-2xl font-black shadow-[0_0_30px_#39ff14] hover:scale-110 transition-transform active:scale-95">[ NEW SESSION ]</Button>
          </motion.div>
        )}
        {status === 'GAMEOVER' && (
          <motion.div key="gameover" initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 z-10 space-y-10">
            <pre className="text-red-600 text-[0.4rem] md:text-xs leading-none whitespace-pre flicker font-mono mb-8 opacity-90 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">{ASCII_ART.GAMEOVER}</pre>
            <div className="space-y-6 text-center">
              <div className="space-y-2 text-2xl font-black tracking-widest uppercase">
                <p className="opacity-40">SECTORS BREACHED: <span className="text-white text-glow">{roomsCleared}</span></p>
                <p className="text-red-500 animate-pulse text-4xl border-2 border-red-500 py-4 px-8">BIOLOGICAL FAILURE DETECTED</p>
              </div>
              <p className="text-xs opacity-30 uppercase tracking-[0.5em]">Memory corruption in progress...</p>
            </div>
            <Button onClick={reset} className="px-16 py-8 bg-black text-[#39ff14] border-4 border-[#39ff14] rounded-none text-2xl font-black hover:bg-[#39ff14] hover:text-black transition-all shadow-[0_0_20px_rgba(57,255,20,0.2)]">[ REBOOT SYSTEM ]</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}