'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Link2, Move } from 'lucide-react';

export interface EditorCharacter {
  id: string;
  name: string;
  color: string;
  cx: number;
  cy: number;
  active: boolean;
}

export interface EditorLine {
  id: string;
  fromId: string;
  toId: string;
}

interface ConstellationEditorProps {
  characters: EditorCharacter[];
  lines: EditorLine[];
  onMove: (id: string, cx: number, cy: number) => void;
  onConnect: (fromId: string, toId: string) => void;
  onDisconnect: (lineId: string) => void;
  onEdit: (id: string) => void;
  onCreateAt: (cx: number, cy: number) => void;
}

// Same coordinate space as the public Dragon Eyes constellation
const W = 850;
const H = 420;
const PAD = 20;

type Mode = 'move' | 'connect';
interface Drag {
  id: string;
  cx: number;
  cy: number;
  startX: number;
  startY: number;
  moved: boolean;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export default function ConstellationEditor({
  characters,
  lines,
  onMove,
  onConnect,
  onDisconnect,
  onEdit,
  onCreateAt,
}: ConstellationEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mode, setMode] = useState<Mode>('move');
  const [drag, setDrag] = useState<Drag | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPending(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toSvg = (clientX: number, clientY: number) => {
    const ctm = svgRef.current?.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: clamp(Math.round(p.x), PAD, W - PAD), y: clamp(Math.round(p.y), PAD, H - PAD) };
  };

  const positionOf = (c: EditorCharacter) => (drag?.id === c.id ? { x: drag.cx, y: drag.cy } : { x: c.cx, y: c.cy });

  const handleStarDown = (e: ReactPointerEvent<SVGGElement>, c: EditorCharacter) => {
    e.stopPropagation();
    if (mode === 'connect') {
      if (!pending || pending === c.id) {
        setPending(pending === c.id ? null : c.id);
        return;
      }
      const existing = lines.find(
        (l) => (l.fromId === pending && l.toId === c.id) || (l.fromId === c.id && l.toId === pending)
      );
      if (existing) onDisconnect(existing.id);
      else onConnect(pending, c.id);
      setPending(null);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ id: c.id, cx: c.cx, cy: c.cy, startX: e.clientX, startY: e.clientY, moved: false });
  };

  const handlePointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const { x, y } = toSvg(e.clientX, e.clientY);
    const moved = drag.moved || Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 4;
    setDrag({ ...drag, cx: x, cy: y, moved });
  };

  const handlePointerUp = () => {
    if (!drag) return;
    if (drag.moved) onMove(drag.id, drag.cx, drag.cy);
    else onEdit(drag.id);
    setDrag(null);
  };

  const byId = (id: string) => characters.find((c) => c.id === id);
  const pendingChar = pending ? byId(pending) : undefined;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-white/10 bg-dracon-void/60 p-1">
          {([
            { id: 'move', label: 'Mover / Editar', icon: Move },
            { id: 'connect', label: 'Conectar', icon: Link2 },
          ] as const).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMode(m.id);
                setPending(null);
              }}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                mode === m.id ? 'bg-dracon-purple-600/40 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <m.icon className="h-4 w-4" /> {m.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          {mode === 'move'
            ? 'Arraste uma estrela para mudar a posição. Clique para editar. Clique duas vezes num espaço vazio para criar um personagem.'
            : pendingChar
              ? `Agora clique na estrela que deve se ligar a ${pendingChar.name} (clicar numa já ligada remove a conexão). Esc cancela.`
              : 'Clique em uma estrela e depois em outra para ligá-las. Se já estiverem ligadas, a conexão é removida.'}
        </p>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className={`h-auto w-full touch-none select-none rounded-lg border border-white/10 ${drag?.moved ? 'cursor-grabbing' : ''}`}
        style={{ background: 'radial-gradient(ellipse at center, rgba(124,34,206,0.12) 0%, rgba(5,0,16,0.9) 75%)' }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={(e) => {
          if (mode !== 'move' || (e.target as Element).closest('[data-star]')) return;
          const { x, y } = toSvg(e.clientX, e.clientY);
          onCreateAt(x, y);
        }}
      >
        {/* Guide grid */}
        {Array.from({ length: Math.floor(W / 50) + 1 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={H} stroke="rgba(255,255,255,0.04)" />
        ))}
        {Array.from({ length: Math.floor(H / 50) + 1 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 50} x2={W} y2={i * 50} stroke="rgba(255,255,255,0.04)" />
        ))}

        {lines.map((l) => {
          const from = byId(l.fromId);
          const to = byId(l.toId);
          if (!from || !to) return null;
          const a = positionOf(from);
          const b = positionOf(to);
          return (
            <g key={l.id}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(192,132,252,0.55)" strokeWidth={1.5} />
              {mode === 'connect' && (
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="transparent"
                  strokeWidth={14}
                  className="cursor-pointer"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    if (confirm(`Remover a conexão ${from.name} — ${to.name}?`)) onDisconnect(l.id);
                  }}
                >
                  <title>Clique para remover</title>
                </line>
              )}
            </g>
          );
        })}

        {characters.map((c) => {
          const { x, y } = positionOf(c);
          const isPending = pending === c.id;
          const isDragging = drag?.id === c.id;
          return (
            <g
              key={c.id}
              data-star
              onPointerDown={(e) => handleStarDown(e, c)}
              className={mode === 'move' ? 'cursor-grab' : 'cursor-pointer'}
              opacity={c.active ? 1 : 0.45}
            >
              <circle cx={x} cy={y} r={22} fill={c.color} opacity={isDragging || isPending ? 0.25 : 0.1} />
              {(isPending || isDragging) && (
                <circle cx={x} cy={y} r={16} fill="none" stroke="#fff" strokeWidth={1.5} strokeDasharray="4 3" />
              )}
              <circle cx={x} cy={y} r={7} fill={c.color} />
              <circle cx={x} cy={y} r={2.5} fill="#fff" />
              <text
                x={x}
                y={y - 20}
                textAnchor="middle"
                fill="rgba(233,225,255,0.9)"
                fontSize={12}
                fontFamily="var(--font-cinzel)"
                className="pointer-events-none"
              >
                {c.name}
                {!c.active && ' (inativo)'}
              </text>
              {isDragging && (
                <text x={x} y={y + 30} textAnchor="middle" fill="rgba(253,186,116,0.9)" fontSize={10} className="pointer-events-none">
                  {x}, {y}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
