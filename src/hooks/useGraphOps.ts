import { useCallback } from "react";
import type { Graph } from "../components/dsa/graph";
import {
  autoLayoutPositions,
  CX,
  CY,
  nextId,
  removeNodeFromGraph,
} from "../components/functions";

export function useGraphOps({
  setGraph,
  setPositions,
  setLabels,
  start,
  setStart,
  target,
  setTarget,
  from,
  setFrom,
  to,
  setTo,
}: {
  setGraph: React.Dispatch<React.SetStateAction<Graph>>;
  setPositions: React.Dispatch<
    React.SetStateAction<Record<string, { x: number; y: number }>>
  >;
  setLabels: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  start: string;
  setStart: (id: string) => void;
  target?: string;
  setTarget: (id?: string) => void;
  from: string;
  setFrom: (id: string) => void;
  to: string;
  setTo: (id: string) => void;
}) {
  const addNode = useCallback(() => {
    setGraph((prevGraph) => {
      const currIds = Object.keys(prevGraph);
      const id = nextId(currIds);
      if (!id) return prevGraph;
      const nextGraph = { ...prevGraph, [id]: [] };

      setLabels((prev) => ({ ...prev, [id]: id.toUpperCase() }));

      setPositions((pos) => {
        const ids = [...Object.keys(pos), id];
        const layout = autoLayoutPositions(ids);
        return { ...pos, [id]: layout[id] ?? { x: CX, y: CY } };
      });

      if (currIds.length === 0) setStart(id);
      if (currIds.length === 1) {
        const first = currIds[0];
        setFrom(first);
        setTarget(id);
        setTo(id);
      }
      return nextGraph;
    });
  }, [setGraph, setLabels, setPositions, setStart, setFrom, setTarget, setTo]);

  const removeNode = useCallback(
    (id?: string) => {
      setGraph((prevGraph) => {
        const currIds = Object.keys(prevGraph);
        const victim = id ?? currIds[currIds.length - 1];
        if (!victim) return prevGraph;

        const nextGraph = removeNodeFromGraph(prevGraph, victim);
        const remainingIds = Object.keys(nextGraph);
        const fallback = remainingIds[0] ?? "";

        setPositions((pos) => {
          const { [victim]: _omit, ...rest } = pos as Record<string, any>;
          return rest;
        });
        setLabels((prev) => {
          const { [victim]: _omit, ...rest } = prev as Record<string, any>;
          return rest;
        });

        if (!remainingIds.includes(start)) setStart(fallback);
        if (target && !remainingIds.includes(target)) setTarget(undefined);
        if (from === victim || (from && !remainingIds.includes(from)))
          setFrom(fallback);
        if (to === victim || (to && !remainingIds.includes(to)))
          setTo(fallback);

        return nextGraph;
      });
    },
    [
      setGraph,
      setPositions,
      setLabels,
      start,
      setStart,
      target,
      setTarget,
      from,
      setFrom,
      to,
      setTo,
    ]
  );

  const addEdge = useCallback(
    (fromId: string, toId: string, weight: number) => {
      setGraph((g) => {
        if (!(fromId in g) || !(toId in g) || fromId === toId) return g;
        const list = g[fromId] || [];
        const exists = list.some((e) => e.to === toId);
        const updated = exists
          ? list.map((e) => (e.to === toId ? { to: toId, w: weight } : e))
          : [...list, { to: toId, w: weight }];
        return { ...g, [fromId]: updated };
      });
    },
    [setGraph]
  );

  const removeEdge = useCallback(
    (fromId: string, toId: string) => {
      setGraph((g) => {
        if (!(fromId in g)) return g;
        const list = g[fromId] ?? [];
        const next = list.filter((e) => e.to !== toId);
        if (next.length === list.length) return g;
        return { ...g, [fromId]: next };
      });
    },
    [setGraph]
  );

  return { addNode, removeNode, addEdge, removeEdge };
}
