import type { Graph } from "./dsa/graph";

export type NodePos = Record<string, { x: number; y: number }>;

export const LETTERS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(97 + i)
);

export const graphSize = (g: Graph) => Object.keys(g).length;
export const firstId = (g: Graph) => Object.keys(g)[0] ?? null;

export function nextId(existing: string[]): string | null {
  for (const id of LETTERS) if (!existing.includes(id)) return id;
  return null;
}

export function removeNodeFromGraph(graph: Graph, id: string): Graph {
  const out: Graph = {};
  for (const u of Object.keys(graph)) {
    if (u === id) continue;
    const adj = graph[u] ?? [];
    out[u] = adj.filter((e) => e.to !== id);
  }
  return out;
}

export const VB_W = 900;
export const VB_H = 500;
export const CX = VB_W / 2;
export const CY = VB_H / 2;

export function autoLayoutPositions(ids: string[]): NodePos {
  if (!ids.length) return {};
  const n = ids.length;
  const r = Math.min(VB_H, VB_W) * 0.37;
  const pos: NodePos = {};
  ids.forEach((id, i) => {
    const theta = (2 * Math.PI * i) / n;
    pos[id] = { x: CX + r * Math.cos(theta), y: CY + r * Math.sin(theta) };
  });
  return pos;
}

function clamp(x: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, x));
}

export function computeScale(n: number) {
  if (n <= 8) return 1;
  const t = (n - 8) / (26 - 8);
  return clamp(1 - 0.42 * t, 0.58, 1);
}

export function computeNodeRadius(n: number) {
  if (n <= 8) return 18;
  const t = (n - 8) / (26 - 8);
  return clamp(18 - 8 * t, 10, 18);
}

export function clientToSvgPoint(
  e: React.PointerEvent,
  svg: SVGSVGElement,
  tx: number,
  ty: number,
  scale: number
) {
  const rect = svg.getBoundingClientRect();
  const ux = ((e.clientX - rect.left) / rect.width) * VB_W;
  const uy = ((e.clientY - rect.top) / rect.height) * VB_H;
  return { x: (ux - tx) / scale, y: (uy - ty) / scale };
}

// -- for freeze

export function graphBounds(
  positions: Record<string, { x: number; y: number }>,
  r: number,
  pad = 24
) {
  const ids = Object.keys(positions);
  if (!ids.length) return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const id of ids) {
    const { x, y } = positions[id]!;
    minX = Math.min(minX, x - r);
    minY = Math.min(minY, y - r);
    maxX = Math.max(maxX, x + r);
    maxY = Math.max(maxY, y + r);
  }
  return {
    minX: minX - pad,
    minY: minY - pad,
    maxX: maxX + pad,
    maxY: maxY + pad,
  };
}

export function fitToViewBox(
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
  VB_W: number,
  VB_H: number
) {
  const w = Math.max(1, bounds.maxX - bounds.minX);
  const h = Math.max(1, bounds.maxY - bounds.minY);
  const s = Math.min(VB_W / w, VB_H / h);
  const contentW = w * s;
  const contentH = h * s;
  const tx = (VB_W - contentW) / 2 - bounds.minX * s;
  const ty = (VB_H - contentH) / 2 - bounds.minY * s;
  return { s, tx, ty };
}

// -- persistence

export type PersistedState = {
  graph: Graph;
  positions: Record<string, { x: number; y: number }>;
  labels: Record<string, string>;
  start?: string;
  target?: string;
};

const STORAGE_KEY = "dijkstra-state";

export function saveState(state: PersistedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadState(): PersistedState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
