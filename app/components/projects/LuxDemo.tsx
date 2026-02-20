'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle2, RotateCcw, ChevronRight } from 'lucide-react';

type LineKind = 'tool-call' | 'tool-result' | 'thinking' | 'success';

interface DemoLine {
  kind: LineKind;
  text: string;
  delay: number;
}

interface TreeNode {
  id: string;
  label: string;
  icon: string;
  depth: number;
}

interface NewNode extends TreeNode {
  insertAfter: number; // index in TREE_NODES after which to insert
}

interface Preset {
  id: string;
  label: string;
  lines: DemoLine[];
  explored: string[];
  exploredAt: number[];
  newNode?: NewNode;
  result: string;
}

const TREE_NODES: TreeNode[] = [
  { id: 'workspace', label: 'Workspace', icon: '📁', depth: 0 },
  { id: 'map', label: 'Map', icon: '🗺️', depth: 1 },
  { id: 'enemy_guard', label: 'Enemy_Guard', icon: '🤖', depth: 1 },
  { id: 'waypoint_a', label: 'WayPoint_A', icon: '📌', depth: 1 },
  { id: 'waypoint_b', label: 'WayPoint_B', icon: '📌', depth: 1 },
  { id: 'starterplayer', label: 'StarterPlayer', icon: '📁', depth: 0 },
  { id: 'starterchar', label: 'StarterCharacterScripts', icon: '📁', depth: 1 },
  { id: 'playercontroller', label: 'PlayerController', icon: '📜', depth: 2 },
  { id: 'startergui', label: 'StarterGui', icon: '📁', depth: 0 },
  { id: 'replicatedstorage', label: 'ReplicatedStorage', icon: '📁', depth: 0 },
  { id: 'cointemplate', label: 'CoinTemplate', icon: '🧩', depth: 1 },
  { id: 'serverscriptservice', label: 'ServerScriptService', icon: '📁', depth: 0 },
  { id: 'coinmanager', label: 'CoinManager', icon: '📜', depth: 1 },
];

const PRESETS: Preset[] = [
  {
    id: 'health-bar',
    label: 'Add a health bar',
    explored: ['starterplayer', 'starterchar', 'playercontroller', 'startergui'],
    exploredAt: [0, 3, 5, 9],
    newNode: { id: 'healthui', label: 'HealthUI', icon: '🎨', depth: 1, insertAfter: 8 },
    lines: [
      { kind: 'tool-call', text: 'list_children("StarterPlayer")', delay: 300 },
      { kind: 'tool-result', text: 'StarterPlayerScripts (Folder)', delay: 100 },
      { kind: 'tool-result', text: 'StarterCharacterScripts (Folder)', delay: 80 },
      { kind: 'tool-call', text: 'list_children("StarterCharacterScripts")', delay: 260 },
      { kind: 'tool-result', text: 'PlayerController (LocalScript) · 312 lines', delay: 110 },
      { kind: 'tool-call', text: 'get_full_script("PlayerController")', delay: 280 },
      { kind: 'tool-result', text: 'reading 312 lines · hash: a3f2c1d8', delay: 120 },
      { kind: 'tool-result', text: 'line 12: HumanoidRootPart reference found', delay: 80 },
      { kind: 'tool-result', text: 'no health tracking logic found — must add', delay: 80 },
      { kind: 'tool-call', text: 'list_children("StarterGui")', delay: 260 },
      { kind: 'tool-result', text: '(empty — no ScreenGui present)', delay: 110 },
      { kind: 'thinking', text: 'No existing GUI — will create HealthUI from scratch', delay: 200 },
      { kind: 'tool-call', text: 'submit_actions(3)', delay: 320 },
      { kind: 'tool-result', text: 'create_instance: ScreenGui "HealthUI" → StarterGui', delay: 110 },
      { kind: 'tool-result', text: 'create_instance: Frame "HealthBar" + gradient → HealthUI', delay: 90 },
      { kind: 'tool-result', text: 'create_script: "HealthController.lua" → HealthUI', delay: 90 },
      { kind: 'success', text: '3 actions ready. Apply with one click.', delay: 400 },
    ],
    result: '3 actions queued: HealthUI (ScreenGui) + HealthBar (Frame) + HealthController (Script)',
  },
  {
    id: 'patrol',
    label: 'Make enemy patrol',
    explored: ['workspace', 'enemy_guard', 'waypoint_a', 'waypoint_b', 'serverscriptservice'],
    exploredAt: [2, 4, 5, 6, 8],
    newNode: { id: 'patrolcontroller', label: 'PatrolController', icon: '📜', depth: 1, insertAfter: 12 },
    lines: [
      { kind: 'tool-call', text: 'search_scripts("patrol", "enemy")', delay: 300 },
      { kind: 'tool-result', text: '0 matches across 23 scripts', delay: 120 },
      { kind: 'tool-call', text: 'list_children("Workspace")', delay: 260 },
      { kind: 'tool-result', text: 'Map (Model)', delay: 90 },
      { kind: 'tool-result', text: 'Enemy_Guard (Model, Humanoid present)', delay: 80 },
      { kind: 'tool-result', text: 'WayPoint_A (Part) at -20, 0, 15', delay: 80 },
      { kind: 'tool-result', text: 'WayPoint_B (Part) at  30, 0, -10', delay: 80 },
      { kind: 'thinking', text: 'Waypoints found — will write patrol loop between them', delay: 200 },
      { kind: 'tool-call', text: 'list_children("ServerScriptService")', delay: 280 },
      { kind: 'tool-result', text: 'GameManager (Script) · 198 lines', delay: 110 },
      { kind: 'tool-result', text: 'CoinManager (Script) · 156 lines', delay: 80 },
      { kind: 'tool-call', text: 'submit_actions(2)', delay: 320 },
      { kind: 'tool-result', text: 'create_script: "PatrolController.lua" → ServerScriptService', delay: 110 },
      { kind: 'tool-result', text: '  loop: WayPoint_A to WayPoint_B, speed 14, turn 180ms', delay: 90 },
      { kind: 'success', text: '2 actions ready. Apply with one click.', delay: 400 },
    ],
    result: '2 actions queued: PatrolController (Script) targeting Enemy_Guard between WayPoint_A and WayPoint_B',
  },
  {
    id: 'coins',
    label: 'Spawn coins in radius',
    explored: ['replicatedstorage', 'cointemplate', 'serverscriptservice', 'coinmanager'],
    exploredAt: [2, 3, 5, 5],
    lines: [
      { kind: 'tool-call', text: 'search_scripts("coin", "spawn")', delay: 300 },
      { kind: 'tool-result', text: '1 match: CoinManager · "spawn" at line 44', delay: 120 },
      { kind: 'tool-call', text: 'list_children("ReplicatedStorage")', delay: 260 },
      { kind: 'tool-result', text: 'CoinTemplate (Part, has BillboardGui)', delay: 110 },
      { kind: 'tool-result', text: 'Assets (Folder)', delay: 80 },
      { kind: 'tool-call', text: 'get_full_script("CoinManager")', delay: 280 },
      { kind: 'tool-result', text: 'reading 156 lines · hash: b8d2a391', delay: 120 },
      { kind: 'tool-result', text: 'line 44: spawnCoin(position) — single-point only', delay: 80 },
      { kind: 'tool-result', text: 'no radius distribution logic found', delay: 80 },
      { kind: 'thinking', text: 'Will patch spawnCoin with math.random radius distribution', delay: 200 },
      { kind: 'tool-call', text: 'submit_actions(1)', delay: 320 },
      { kind: 'tool-result', text: 'modify_script: CoinManager.lua · hash: b8d2a391', delay: 110 },
      { kind: 'tool-result', text: '  +12 lines: angle loop, radius math, 10 spawns', delay: 90 },
      { kind: 'success', text: '1 action ready. Apply with one click.', delay: 400 },
    ],
    result: '1 action queued: CoinManager.lua patched to spawn 10 coins at random positions within 15-stud radius',
  },
];

interface LuxDemoProps {
  autoPlay?: boolean;
}

export default function LuxDemo({ autoPlay = false }: LuxDemoProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [exploredSet, setExploredSet] = useState<Set<string>>(new Set());
  const [showNewNode, setShowNewNode] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const preset = PRESETS.find(p => p.id === selectedId) ?? null;

  const clearAll = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const runPreset = (p: Preset) => {
    setRunning(true);
    setDone(false);
    setVisibleLines(0);
    setExploredSet(new Set());
    setShowNewNode(false);

    if (prefersReducedMotion) {
      setVisibleLines(p.lines.length);
      setExploredSet(new Set(p.explored));
      if (p.newNode) setShowNewNode(true);
      setTimeout(() => { setDone(true); setRunning(false); }, 100);
      return;
    }

    let cumulative = 0;
    p.lines.forEach((line, idx) => {
      cumulative += line.delay;
      const t = setTimeout(() => {
        setVisibleLines(idx + 1);
        setTimeout(() => {
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
          }
        }, 20);
        p.exploredAt.forEach((triggerIdx, nodeI) => {
          if (triggerIdx === idx) {
            setExploredSet(prev => new Set([...prev, p.explored[nodeI]]));
          }
        });
        if (idx === p.lines.length - 1) {
          if (p.newNode) setShowNewNode(true);
          const t2 = setTimeout(() => { setDone(true); setRunning(false); }, 300);
          timeoutsRef.current.push(t2);
        }
      }, cumulative);
      timeoutsRef.current.push(t);
    });
  };

  const handleChipSelect = (id: string) => {
    if (running && !done) return;
    clearAll();
    setSelectedId(id);
    setDone(false);
    setVisibleLines(0);
    setExploredSet(new Set());
    setShowNewNode(false);
    setRunning(false);
    const p = PRESETS.find(pp => pp.id === id)!;
    const t = setTimeout(() => runPreset(p), 80);
    timeoutsRef.current.push(t);
  };

  const handleReset = () => {
    clearAll();
    setSelectedId(null);
    setRunning(false);
    setDone(false);
    setVisibleLines(0);
    setExploredSet(new Set());
    setShowNewNode(false);
  };

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(() => handleChipSelect(PRESETS[0].id), 600);
      timeoutsRef.current.push(t);
    }
    return clearAll;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  const displayTree = showNewNode && preset?.newNode
    ? [
        ...TREE_NODES.slice(0, preset.newNode.insertAfter + 1),
        preset.newNode,
        ...TREE_NODES.slice(preset.newNode.insertAfter + 1),
      ]
    : TREE_NODES;

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-0 py-2 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-white">Lux — AI Agent Demo</h3>
          <p className="text-xs text-slate-500">Select a command. Watch the agent reason through your game.</p>
        </div>
        {selectedId && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors text-xs font-bold min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Preset chips */}
      <div className="flex flex-row gap-2 overflow-x-auto pb-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:flex-wrap snap-x snap-mandatory">
        {PRESETS.map(p => (
          <button
            key={p.id}
            onClick={() => handleChipSelect(p.id)}
            className={`flex-shrink-0 snap-start px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 min-h-[48px] whitespace-nowrap ${
              selectedId === p.id
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main demo area */}
      <AnimatePresence mode="wait">
        {selectedId && preset && (
          <motion.div
            key={selectedId}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="grid md:grid-cols-[5fr_8fr] gap-4"
          >
            {/* Project tree */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/50">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Game Explorer</span>
              </div>
              <div className="p-2 space-y-0.5 font-mono text-[10px] overflow-y-auto max-h-48 md:max-h-64 custom-scrollbar">
                {displayTree.map((node) => {
                  const isExplored = exploredSet.has(node.id);
                  const isNew = showNewNode && node.id === preset.newNode?.id;
                  return (
                    <motion.div
                      key={node.id}
                      initial={isNew ? { opacity: 0, x: -4 } : {}}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ paddingLeft: `${node.depth * 12}px` }}
                      className={`flex items-center gap-1 py-0.5 px-1.5 rounded transition-all duration-300 ${
                        isNew
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : isExplored
                          ? 'bg-amber-500/10 text-amber-300'
                          : 'text-slate-600'
                      }`}
                    >
                      {node.depth > 0 && (
                        <ChevronRight className="w-2.5 h-2.5 opacity-30 flex-shrink-0" />
                      )}
                      <span className="flex-shrink-0">{node.icon}</span>
                      <span className={`truncate ${isNew ? 'font-black' : isExplored ? 'font-bold' : ''}`}>
                        {node.label}
                      </span>
                      {isNew && (
                        <span className="ml-auto text-[8px] font-black text-emerald-400 uppercase flex-shrink-0">new</span>
                      )}
                      {isExplored && !isNew && (
                        <span className="ml-auto text-[8px] text-amber-500/50 flex-shrink-0">read</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Terminal */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
              {/* Titlebar */}
              <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">agent.log</span>
                </div>
                {done ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
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

              {/* User prompt */}
              <div className="px-4 pt-3 pb-1 flex-shrink-0">
                <div className="text-xs font-mono">
                  <span className="text-amber-500 font-black">user</span>
                  <span className="text-slate-700">:~$ </span>
                  <span className="text-slate-300">{preset.label}</span>
                </div>
              </div>

              {/* Log lines */}
              <div
                ref={terminalRef}
                className="px-4 pb-4 font-mono text-xs space-y-0.5 overflow-y-auto max-h-44 md:max-h-52 custom-scrollbar flex-1"
              >
                {preset.lines.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    {line.kind === 'tool-call' && (
                      <div className="flex items-start gap-2 mt-1">
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase flex-shrink-0 mt-px">TOOL</span>
                        <span className="text-amber-300">{line.text}</span>
                      </div>
                    )}
                    {line.kind === 'tool-result' && (
                      <div className="text-slate-400 pl-10">
                        <span className="text-slate-600">&#8627; </span>{line.text}
                      </div>
                    )}
                    {line.kind === 'thinking' && (
                      <div className="text-blue-400/70 italic pl-2 mt-1">
                        <span className="not-italic">&#187; </span>{line.text}
                      </div>
                    )}
                    {line.kind === 'success' && (
                      <div className="text-emerald-400 font-black mt-1">&#10003; {line.text}</div>
                    )}
                  </motion.div>
                ))}
                {running && !done && visibleLines > 0 && (
                  <motion.span
                    className="text-slate-700 inline-block"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    &#9612;
                  </motion.span>
                )}
              </div>
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
              <div className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-0.5">Actions Queued</div>
              <div className="text-sm text-slate-200">{preset.result}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!selectedId && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-slate-700 text-sm font-medium">Choose a command to watch the agent work</div>
          <div className="text-slate-800 text-xs mt-1">
            The AI reads live game state, reasons through it, then writes structured actions
          </div>
        </div>
      )}
    </div>
  );
}
