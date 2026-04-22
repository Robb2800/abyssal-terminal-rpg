import React, { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronUp, Zap } from 'lucide-react';
export function Console() {
  const logs = useGameStore(s => s.logs);
  const currentEncounter = useGameStore(s => s.currentEncounter);
  const mana = useGameStore(s => s.mana);
  const isRolling = useGameStore(s => s.isRolling);
  const restUsedOnFloor = useGameStore(s => s.restUsedOnFloor);
  const attack = useGameStore(s => s.attack);
  const defend = useGameStore(s => s.defend);
  const nextRoom = useGameStore(s => s.nextRoom);
  const useSkill = useGameStore(s => s.useSkill);
  const searchRoom = useGameStore(s => s.searchRoom);
  const rest = useGameStore(s => s.rest);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);
  const formatLog = (log: string) => {
    if (log.startsWith('>')) return <span className="text-[#39ff14] font-bold">{log}</span>;
    if (log.startsWith('<')) return <span className="text-red-400">{log}</span>;
    if (log.startsWith('+')) return <span className="text-yellow-400">{log}</span>;
    if (log.startsWith('!')) return <span className="text-red-500 text-glow">{log}</span>;
    if (log.startsWith('?')) return <span className="text-orange-400 italic">{log}</span>;
    return <span>{log}</span>;
  };
  return (
    <div className="h-[40%] w-full flex flex-col bg-black p-4 md:p-6 overflow-hidden">
      {/* Logs Window */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-1 font-mono text-sm md:text-base">
        {logs.slice(-50).map((log, i) => (
          <div key={i} className="animate-fade-in py-0.5">
            <span className="opacity-30 mr-2">[{i.toString().padStart(3, '0')}]</span>
            {formatLog(log)}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
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
                  className="bg-blue-600 text-white hover:bg-black border-2 border-blue-600 rounded-none h-12 font-bold uppercase flex gap-2"
                >
                  <Zap size={16} /> [ SKILLS ] <ChevronUp size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black border-2 border-blue-600 text-blue-400 rounded-none w-56 p-0 font-mono">
                <DropdownMenuItem 
                  className="hover:bg-blue-600 hover:text-white rounded-none p-3 cursor-pointer border-b border-blue-600/30"
                  onClick={() => useSkill('siphon')}
                  disabled={mana < 4}
                >
                  SIPHON LIFE (4 MP)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-blue-600 hover:text-white rounded-none p-3 cursor-pointer border-b border-blue-600/30"
                  onClick={() => useSkill('analyze')}
                  disabled={mana < 2}
                >
                  ANALYZE (2 MP)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-blue-600 hover:text-white rounded-none p-3 cursor-pointer"
                  onClick={() => useSkill('smoke')}
                  disabled={mana < 6}
                >
                  SMOKE BOMB (6 MP)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button
              disabled={isRolling}
              onClick={nextRoom}
              className="col-span-2 md:col-span-1 bg-[#39ff14] text-black hover:bg-black hover:text-[#39ff14] border-2 border-[#39ff14] rounded-none h-12 font-bold uppercase"
            >
              [ MOVE FORWARD ]
            </Button>
            <Button
              disabled={isRolling}
              onClick={searchRoom}
              className="bg-black text-[#39ff14] border-2 border-[#39ff14] hover:bg-[#39ff14] hover:text-black rounded-none h-12 font-bold uppercase"
            >
              [ SEARCH ]
            </Button>
            <Button
              disabled={isRolling || restUsedOnFloor}
              onClick={rest}
              className="bg-black text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black rounded-none h-12 font-bold uppercase"
            >
              [ REST ]
            </Button>
          </>
        )}
      </div>
    </div>
  );
}