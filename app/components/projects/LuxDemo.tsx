'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface Preset {
  id: string;
  label: string;
  lines: string[];
  result: string;
}

const PRESETS: Preset[] = [
  {
    id: 'teleport',
    label: 'Teleport player to checkpoint',
    lines: [
      '→ reading workspace objects...',
      '→ indexing 47 instances...',
      '→ found: Checkpoint_01 at Vector3(45, 2, 30)',
      '→ found: LocalPlayer in Players service',
      '→ found: HumanoidRootPart on Character',
      '→ writing CFrame modification...',
      '✓  Action submitted. 1 change ready to apply.',
    ],
    result: 'Player.Character.HumanoidRootPart.CFrame set to Checkpoint_01.CFrame',
  },
  {
    id: 'patrol',
    label: 'Make enemy patrol between two points',
    lines: [
      '→ reading workspace objects...',
      '→ found: Enemy_Guard (Model) with Humanoid',
      '→ found: WayPoint_A at Vector3(-20, 0, 15)',
      '→ found: WayPoint_B at Vector3(30, 0, -10)',
      '→ calculating patrol sequence...',
      '→ generating PatrolController (LocalScript)',
      '→ writing waypoint loop logic...',
      '✓  Action submitted. 2 changes ready to apply.',
    ],
    result: 'PatrolController created. Enemy_Guard will loop between WayPoint_A → WayPoint_B.',
  },
  {
    id: 'coins',
    label: 'Spawn 10 coins in a radius',
    lines: [
      '→ reading workspace objects...',
      '→ found: CoinTemplate (Part) in ReplicatedStorage',
      '→ calculating spawn positions (radius: 15 studs)...',
      '→ generating 10 position vectors...',
      '→ creating CoinSpawner (Script) in ServerScriptService',
      '→ embedding spawn logic with cleanup...',
      '✓  Action submitted. 1 script ready to apply.',
    ],
    result: 'CoinSpawner script created. 10 coins spawn in a 15-stud radius on game start.',
  },
];

function TerminalOutput({
  lines,
  active,
  onDone,
}: {
  lines: string[];
  active: boolean;
  onDone: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active) { setVisibleCount(0); return; }
    if (prefersReducedMotion) {
      setVisibleCount(lines.length);
      setTimeout(onDone, 100);
      return;
    }
    let count = 0;
    const addLine = () => {
      count++;
      setVisibleCount(count);
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 10);
      if (count < lines.length) {
        const delay = lines[count - 1].startsWith('✓') ? 400 : 220;
        setTimeout(addLine, delay);
      } else {
        setTimeout(onDone, 600);
      }
    };
    const t = setTimeout(addLine, 200);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, lines]);

  return (
    <div
      ref={containerRef}
      className="font-mono text-xs leading-relaxed overflow-y-auto max-h-52 sm:max-h-64 space-y-0.5 custom-scrollbar"
    >
      {lines.slice(0, visibleCount).map((line, i) => (
        <motion.div
          key={i}
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.12 }}
          className={
            line.startsWith('✓')
              ? 'text-emerald-400 font-black'
              : line.startsWith('→')
              ? 'text-slate-300'
              : 'text-amber-400'
          }
        >
          {line}
        </motion.div>
      ))}
      {active && visibleCount < lines.length && (
        <motion.span
          className="text-slate-600"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          ▍
        </motion.span>
      )}
    </div>
  );
}

interface LuxDemoProps {
  autoPlay?: boolean;
}

export default function LuxDemo({ autoPlay = false }: LuxDemoProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const preset = PRESETS.find((p) => p.id === selected) ?? null;

  const handleChipSelect = (id: string) => {
    if (running) return;
    if (selected === id && done) {
      // re-run
      setDone(false);
      setRunning(false);
      setTimeout(() => setRunning(true), 60);
      return;
    }
    setSelected(id);
    setDone(false);
    setRunning(false);
    setTimeout(() => setRunning(true), 80);
  };

  const handleReset = () => {
    setSelected(null);
    setRunning(false);
    setDone(false);
  };

  // Auto-play: select first preset
  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(() => handleChipSelect(PRESETS[0].id), 600);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0 py-2 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-white">Lux — Roblox AI Agent</h3>
          <p className="text-xs text-slate-500">Select a command. Watch the agent think.</p>
        </div>
        {selected && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors text-xs font-bold min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Command chips */}
      <div className="flex flex-row gap-2 overflow-x-auto pb-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:flex-wrap snap-x snap-mandatory">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleChipSelect(p.id)}
            className={`flex-shrink-0 snap-start px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 min-h-[48px] whitespace-nowrap ${
              selected === p.id
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Terminal */}
      <AnimatePresence mode="wait">
        {selected && preset && (
          <motion.div
            key={selected}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden"
          >
            {/* Terminal titlebar */}
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Lux Agent</span>
              </div>
              <div className="flex items-center gap-1.5">
                {done ? (
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1"
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full bg-emerald-400"
                      animate={prefersReducedMotion ? {} : { boxShadow: ['0 0 0px #4ade80', '0 0 8px #4ade80', '0 0 0px #4ade80'] }}
                      transition={{ duration: 0.6, repeat: 2 }}
                    />
                    <span className="text-[9px] font-black text-emerald-400 uppercase">Done</span>
                  </motion.div>
                ) : running ? (
                  <motion.div
                    className="flex items-center gap-1"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-[9px] font-black text-amber-400 uppercase">Thinking</span>
                  </motion.div>
                ) : null}
              </div>
            </div>

            {/* User prompt line */}
            <div className="px-4 pt-3 pb-0">
              <div className="text-xs text-slate-500 font-mono mb-2">
                <span className="text-amber-500 font-black">user@studio</span>
                <span className="text-slate-600">:~$ </span>
                <span className="text-white">{preset.label}</span>
              </div>
            </div>

            {/* Streaming output */}
            <div className="px-4 pb-4">
              <TerminalOutput
                key={`${selected}-${running}`}
                lines={preset.lines}
                active={running}
                onDone={() => { setRunning(false); setDone(true); }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result badge */}
      <AnimatePresence>
        {done && preset && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl"
          >
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 15 }}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            </motion.div>
            <div>
              <div className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-0.5">Result</div>
              <div className="text-sm text-slate-200">{preset.result}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!selected && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-slate-700 text-sm font-medium">
            Choose a command above to watch the agent work
          </div>
          <div className="text-slate-800 text-xs mt-1">
            The AI reads live game state, reasons, then writes structured actions
          </div>
        </div>
      )}
    </div>
  );
}
