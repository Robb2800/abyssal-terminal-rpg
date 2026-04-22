import React, { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronUp, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
export function Console() {
  const logs = useGameStore(s => s.logs);
  const currentEncounter = useGameStore(s => s.currentEncounter);
  const currentEvent = useGameStore(s => s.currentEvent);
  const mana = useGameStore(s => s.mana);
  const isRolling = useGameStore(s => s.isRolling);
  const restUsedOnFloor = useGameStore(s => s.restUsedOnFloor);
  const pos = useGameStore(s => s.position);
  const status = useGameStore(s => s.status);
  const attack = useGameStore(s => s.attack);
  const defend = useGameStore(s => s.defend);
  const handleSkill = useGameStore(s => s.useSkill);
  const move = useGameStore(s => s.move);
  const searchRoom = useGameStore(s => s.searchRoom);
  const rest = useGameStore(s => s.rest);
  const resolveEvent = useGameStore(s => s.resolveEvent);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);
  const formatLog = (log: string) => {
    if (log.startsWith('>')) return <span className="text-[#39ff14] font-bold">{log}</span>;
    if (log.startsWith('<')) return <span className="text-red-400">{log}</span>;
    if (log.startsWith('+')) return <span className="text-yellow-400 font-bold">{log}</span>;
    if (log.startsWith('!')) return <span className="text-red-500 text-glow font-black">{log}</span>;
    if (log.startsWith('?')) return <span className="text-orange-400 italic">{log}</span>;
    return <span>{log}</span>;
  };
  return (
    <div className="h-[40%] w-full flex flex-col bg-black p-4 md:px-8 md:py-6 overflow-hidden border-t-2 border-[#39ff14]/10">
      {/* Logs Window */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-1 font-mono text-xs md:text-sm scrollbar-thin">
        {logs.slice(-50).map((log, i) => (
          <div key={i} className="animate-fade-in py-0.5">
            <span className="opacity-20 mr-2">[{i.toString().padStart(3, '0')}]</span>
            {formatLog(log)}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      {/* Narrative Event View */}
      {status === 'EVENT' && currentEvent && (
        <div className="absolute inset-0 z-20 bg-black/95 flex flex-col p-8 border-2 border-[#39ff14] m-4 animate-scale-in">
          <div className="flex-1 overflow-y-auto space-y-4">
            <h3 className="text-3xl font-black text-glow uppercase tracking-widest text-center border-b border-[#39ff14]/30 pb-4">
              {currentEvent.title}
            </h3>
            <p className="text-lg leading-relaxed opacity-90 first-letter:text-4xl first-letter:font-bold first-letter:mr-2">
              {currentEvent.prose}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {currentEvent.choices.map((choice) => (
              <Button
                key={choice.id}
                onClick={() => resolveEvent(choice.id)}
                className="bg-black text-[#39ff14] border-2 border-[#39ff14] hover:bg-[#39ff14] hover:text-black rounded-none h-16 flex flex-col justify-center"
              >
                <span className="font-bold">{choice.text}</span>
                <span className="text-[10px] opacity-60 uppercase">{choice.consequence}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
      {/* Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#39ff14]/30">
        {currentEncounter ? (
          <>
            <Button
              disabled={isRolling}
              onClick={attack}
              className="bg-[#39ff14] text-black hover:bg-black hover:text-[#39ff14] border-2 border-[#39ff14] rounded-none h-12 font-bold uppercase"
            >
              [ ATTACK ]
            </Button>
            <Button
              disabled={isRolling}
              onClick={defend}
              className="bg-black text-[#39ff14] border-2 border-[#39ff14] hover:bg-[#39ff14] hover:text-black rounded-none h-12 font-bold uppercase"
            >
              [ DEFEND ]
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={isRolling}
                  className="bg-blue-900 text-white hover:bg-blue-600 border-2 border-blue-600 rounded-none h-12 font-bold uppercase flex gap-2"
                >
                  <Zap size={16} /> [ SKILLS ] <ChevronUp size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black border-2 border-blue-600 text-blue-400 rounded-none w-64 p-0 font-mono">
                <DropdownMenuItem onClick={() => handleSkill('siphon')} disabled={mana < 4} className="hover:bg-blue-600 hover:text-white p-3 cursor-pointer">
                  SIPHON LIFE (4 MP)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSkill('analyze')} disabled={mana < 2} className="hover:bg-blue-600 hover:text-white p-3 cursor-pointer">
                  ANALYZE (2 MP)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSkill('smoke')} disabled={mana < 6} className="hover:bg-blue-600 hover:text-white p-3 cursor-pointer">
                  SMOKE BOMB (6 MP)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button disabled className="bg-black text-[#39ff14]/20 border-2 border-[#39ff14]/10 rounded-none h-12 font-bold uppercase">
              [ FOCKED ]
            </Button>
          </>
        ) : (
          <>
            {/* D-Pad Movement */}
            <div className="grid grid-cols-3 gap-1 md:col-span-1">
              <div />
              <Button onClick={() => move(0, 1)} disabled={isRolling || pos.y === 4} className="h-10 bg-black border border-[#39ff14]/50 hover:bg-[#39ff14] hover:text-black p-0"><ArrowUp size={16}/></Button>
              <div />
              <Button onClick={() => move(-1, 0)} disabled={isRolling || pos.x === 0} className="h-10 bg-black border border-[#39ff14]/50 hover:bg-[#39ff14] hover:text-black p-0"><ArrowLeft size={16}/></Button>
              <Button onClick={() => move(0, -1)} disabled={isRolling || pos.y === 0} className="h-10 bg-black border border-[#39ff14]/50 hover:bg-[#39ff14] hover:text-black p-0"><ArrowDown size={16}/></Button>
              <Button onClick={() => move(1, 0)} disabled={isRolling || pos.x === 4} className="h-10 bg-black border border-[#39ff14]/50 hover:bg-[#39ff14] hover:text-black p-0"><ArrowRight size={16}/></Button>
            </div>
            <Button
              disabled={isRolling}
              onClick={searchRoom}
              className="bg-black text-[#39ff14] border-2 border-[#39ff14] hover:bg-[#39ff14] hover:text-black rounded-none h-12 font-bold uppercase"
            >
              [ SEARCH ROOM ]
            </Button>
            <Button
              disabled={isRolling || restUsedOnFloor}
              onClick={rest}
              className="bg-black text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black rounded-none h-12 font-bold uppercase"
            >
              [ REST ]
            </Button>
            <div className="hidden md:flex items-center justify-center border-2 border-[#39ff14]/20 text-[10px] uppercase font-bold text-center opacity-40">
              NAVIGATION<br/>ACTIVE
            </div>
          </>
        )}
      </div>
    </div>
  );
}