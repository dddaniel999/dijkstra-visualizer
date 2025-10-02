import { useCallback, useMemo, useRef } from "react";
import type { Graph } from "../components/dsa/graph";
import { autoLayoutPositions } from "../components/functions";

type PersistedState = {
  graph: Graph;
  positions: Record<string, { x: number; y: number }>;
  labels: Record<string, string>;
  start: string;
  target?: string;
};

function readPersisted(storageKey: string): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as PersistedState) : null;
  } catch {
    return null;
  }
}

export function usePersistence(
  storageKey: string,
  defaults: { graph: Graph; start: string; target?: string }
) {
  const persisted = useMemo(() => readPersisted(storageKey), [storageKey]);

  const saveTimer = useRef<number | null>(null);
  const scheduleSave = useCallback(
    (state: PersistedState) => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        try {
          localStorage.setItem(storageKey, JSON.stringify(state));
        } catch {}
      }, 50);
    },
    [storageKey]
  );

  const clearAndReset = useCallback(
    (opts: {
      setGraph: (g: Graph) => void;
      setPositions: (p: Record<string, { x: number; y: number }>) => void;
      setLabels: (l: Record<string, string>) => void;
      setStart: (s: string) => void;
      setTarget: (t: string | undefined) => void;
    }) => {
      const { setGraph, setPositions, setLabels, setStart, setTarget } = opts;
      const g = defaults.graph;
      setGraph(g);
      setLabels(
        Object.fromEntries(Object.keys(g).map((id) => [id, id.toUpperCase()]))
      );
      setPositions(autoLayoutPositions(Object.keys(g)));
      setStart(defaults.start);
      setTarget(defaults.target);
      try {
        localStorage.removeItem(storageKey);
      } catch {}
    },
    [defaults.graph, defaults.start, defaults.target, storageKey]
  );

  return { persisted, scheduleSave, clearAndReset };
}
