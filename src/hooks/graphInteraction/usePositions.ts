import { useState, useEffect, useCallback } from "react";
import {
  type NodePos,
  autoLayoutPositions,
  VB_W,
  VB_H,
} from "../../components/functions";

export function usePositions(ids: string[]) {
  const [positions, setPositions] = useState<NodePos>(() =>
    autoLayoutPositions(ids)
  );

  useEffect(() => {
    setPositions((prev) => {
      const next: NodePos = {};
      const missing = ids.filter((id) => !(id in prev));
      const kept = ids.filter((id) => id in prev);
      for (const id of kept) next[id] = prev[id];
      if (missing.length) {
        const auto = autoLayoutPositions(ids);
        for (const id of missing) next[id] = auto[id];
      }
      return next;
    });
  }, [ids]);

  const randomize = useCallback(() => {
    const pad = 40;
    setPositions((prev) => {
      const next: NodePos = {};
      for (const id of Object.keys(prev)) {
        next[id] = {
          x: pad + Math.random() * (VB_W - 2 * pad),
          y: pad + Math.random() * (VB_H - 2 * pad),
        };
      }
      return next;
    });
  }, []);

  const resetCircle = useCallback(() => {
    setPositions(autoLayoutPositions(ids));
  }, [ids]);

  return { positions, setPositions, randomize, resetCircle };
}
