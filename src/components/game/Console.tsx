import React, { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { ChevronUp, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Skull, ShieldCheck, HeartPulse } from 'lucide-react';
import { ORIGINS } from '@/lib/dictionaries';
import { cn } from "@/lib/utils";
export function Console() {
  const logs = useGameStore(s => s.logs);
  const currentEncounter = useGameStore(s => s.currentEncounter);
  const isRolling = useGameStore(s => s.isRolling);
  const pos = useGameStore(s => s.position);
  const status = useGameStore(s => s.status);
  const origin = useGameStore(s => s.origin);
  const relicCooldown = useGameStore(s => s.relicCooldown);
  const mana = useGameStore(s => s.mana);
  const attack = useGameStore(s => s.attack);
  const defend = useGameStore(s => s.defend);
  const useRelic = useGameStore(s => s.useRelic);
  const useSkill = useGameStore(s => s.useSkill);
  const move = useGameStore(s => s.move);
  const searchRoom = useGameStore(s => s.searchRoom);
  const rest = useGameStore(s => s.rest);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);
  const originData = origin ? ORIGINS[origin] : null;
  return (
    <div className="h-[40%] w-full flex flex-col bg-black p-4 overflow-hidden border-t-2 border-[#39ff14]/10 relative z-10">
      <div className="flex-1 overflow-y-auto mb-4 font-mono text-[10px] md:text-xs scrollbar-thin opacity-90">
        {logs.slice(-40).map((log, i) => (
          <div key={i} className="py-0.5 border-l border-[#39ff14]/10 pl-2 mb-1">
            <span className="opacity-30 mr-2 tabular-nums">{i.toString().padStart(3, '0')}</span>
            <span className={cn(
              log.startsWith('!') && "text-red-500 font-bold",
              log.startsWith('+') && "text-blue-400",
              log.startsWith('*') && "text-[#39ff14] font-black text-glow",
              log.startsWith('>') && "text-white/80"
            )}>{log}</span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-[#39ff14]/30">
        {currentEncounter ? (
          <>
            <Button onClick={attack} disabled={isRolling} className="bg-[#39ff14] text-black border-2 border-[#39ff14] rounded-none h-10 font-black uppercase hover:bg-black hover:text-[#39ff14] transition-all">[ ATTACK ]</Button>
            <Button onClick={defend} disabled={isRolling} className="bg-black text-[#39ff14] border-2 border-[#39ff14] rounded-none h-10 font-black uppercase hover:bg-[#39ff14] hover:text-black transition-all">[ DEFEND ]</Button>
            <Button onClick={useRelic} disabled={isRolling || relicCooldown > 0} className={cn("rounded-none h-10 font-black uppercase border-2 transition-all", relicCooldown > 0 ? "border-red-900 text-red-900 bg-black/50 cursor-not-allowed" : "border-blue-500 text-blue-500 bg-black hover:bg-blue-500 hover:text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]")}>
              {relicCooldown > 0 ? `CHARGING (${relicCooldown})` : `[ ${originData?.item.split(' ')[0].toUpperCase() || 'RELIC'} ]`}
            </Button>
            <Button onClick={() => useSkill('siphon')} disabled={isRolling || mana < 5} className="bg-black text-white border-2 border-white/30 rounded-none h-10 font-black uppercase hover:border-white hover:bg-white hover:text-black transition-all flex gap-2 justify-center items-center">
              <HeartPulse size={14} /> SIPHON
            </Button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-1 md:col-span-1 border border-[#39ff14]/20 p-1 bg-black/50">
              <div/><Button onClick={() => move(0, -1)} disabled={isRolling || pos.y === 0} className="h-8 bg-black border border-[#39ff14]/50 p-0 hover:bg-[#39ff14] hover:text-black transition-colors"><ArrowUp size={14}/></Button><div/>
              <Button onClick={() => move(-1, 0)} disabled={isRolling || pos.x === 0} className="h-8 bg-black border border-[#39ff14]/50 p-0 hover:bg-[#39ff14] hover:text-black transition-colors"><ArrowLeft size={14}/></Button>
              <Button onClick={() => move(0, 1)} disabled={isRolling || pos.y === 4} className="h-8 bg-black border border-[#39ff14]/50 p-0 hover:bg-[#39ff14] hover:text-black transition-colors"><ArrowDown size={14}/></Button>
              <Button onClick={() => move(1, 0)} disabled={isRolling || pos.x === 4} className="h-8 bg-black border border-[#39ff14]/50 p-0 hover:bg-[#39ff14] hover:text-black transition-colors"><ArrowRight size={14}/></Button>
            </div>
            <Button onClick={searchRoom} disabled={isRolling} className="bg-black text-[#39ff14] border-2 border-[#39ff14] rounded-none h-12 font-black uppercase hover:bg-[#39ff14] hover:text-black transition-all">[ SEARCH ]</Button>
            <Button onClick={rest} disabled={isRolling} className="bg-black text-yellow-400 border-2 border-yellow-400 rounded-none h-12 font-black uppercase hover:bg-yellow-400 hover:text-black transition-all">[ REST ]</Button>
            <Button onClick={useRelic} disabled={isRolling || relicCooldown > 0 || origin !== 'collector'} className={cn("rounded-none h-12 font-black uppercase border-2 transition-all", origin !== 'collector' ? "opacity-10 cursor-not-allowed grayscale" : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]")}>[ RE-ROLL ]</Button>
          </>
        )}
      </div>
    </div>
  );
}