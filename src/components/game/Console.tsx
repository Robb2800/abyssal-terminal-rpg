import React, { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
export function Console() {
  const logs = useGameStore(s => s.logs);
  const currentEncounter = useGameStore(s => s.currentEncounter);
  const attack = useGameStore(s => s.attack);
  const defend = useGameStore(s => s.defend);
  const nextRoom = useGameStore(s => s.nextRoom);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);
  return (
    <div className="h-[40%] w-full flex flex-col bg-black p-4 md:p-6 overflow-hidden">
      {/* Logs Window */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-1 font-mono text-sm md:text-base scrollbar-hide">
        {logs.map((log, i) => (
          <div key={i} className="animate-fade-in py-0.5">
            <span className="opacity-50 mr-2">[{i.toString().padStart(3, '0')}]</span>
            <span className={log.startsWith('!') ? 'text-red-500' : log.startsWith('+') ? 'text-yellow-400' : ''}>
              {log}
            </span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      {/* Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-[#39ff14]/30">
        {currentEncounter ? (
          <>
            <Button 
              onClick={attack}
              className="bg-[#39ff14] text-black hover:bg-black hover:text-[#39ff14] border-2 border-[#39ff14] rounded-none h-12 font-bold uppercase"
            >
              [ ATTACK ]
            </Button>
            <Button 
              onClick={defend}
              className="bg-black text-[#39ff14] border-2 border-[#39ff14] hover:bg-[#39ff14] hover:text-black rounded-none h-12 font-bold uppercase"
            >
              [ DEFEND ]
            </Button>
          </>
        ) : (
          <Button 
            onClick={nextRoom}
            className="col-span-2 md:col-span-1 bg-[#39ff14] text-black hover:bg-black hover:text-[#39ff14] border-2 border-[#39ff14] rounded-none h-12 font-bold uppercase"
          >
            [ MOVE FORWARD ]
          </Button>
        )}
      </div>
    </div>
  );
}