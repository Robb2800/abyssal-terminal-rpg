import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
export function DiceOverlay() {
  const isRolling = useGameStore(s => s.isRolling);
  const lastRoll = useGameStore(s => s.lastRoll);
  const rollLabel = useGameStore(s => s.rollLabel);
  // Procedural Sound Effects
  useEffect(() => {
    if (isRolling) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playClick = (time: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150 + Math.random() * 100, time);
        osc.frequency.exponentialRampToValueAtTime(10, time + 0.1);
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.1);
      };
      for (let i = 0; i < 10; i++) {
        playClick(audioCtx.currentTime + i * 0.1);
      }
      return () => { audioCtx.close(); };
    }
  }, [isRolling]);
  return (
    <AnimatePresence>
      {isRolling && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 pointer-events-none"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotateX: 360, rotateY: 360, rotateZ: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 border-4 border-[#39ff14] flex items-center justify-center relative mb-4"
            >
              <span className="text-4xl font-bold text-glow">?</span>
              {/* Fake 3D edges */}
              <div className="absolute inset-0 border-2 border-[#39ff14]/30 rotate-45 scale-75" />
            </motion.div>
            <div className="text-2xl font-bold uppercase tracking-widest text-[#39ff14] text-glow">
              ROLLING {rollLabel}...
            </div>
          </div>
        </motion.div>
      )}
      {!isRolling && lastRoll > 0 && (
        <motion.div
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 z-[200] pointer-events-none text-center"
        >
          <div className={`text-8xl font-black text-glow mb-2 ${lastRoll === 20 ? 'text-green-400' : lastRoll === 1 ? 'text-red-600' : 'text-[#39ff14]'}`}>
            {lastRoll}
          </div>
          {lastRoll === 20 && <div className="text-2xl font-bold animate-bounce">CRITICAL SUCCESS</div>}
          {lastRoll === 1 && <div className="text-2xl font-bold animate-pulse text-red-500">CRITICAL FAILURE</div>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}