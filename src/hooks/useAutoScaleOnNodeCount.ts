import { useEffect } from "react";
import { computeScale, CX, CY } from "../components/functions";

export function useAutoScaleOnNodeCount(
  n: number,
  snapshotMode: boolean,
  setScale: (s: number) => void,
  setTx: (x: number) => void,
  setTy: (y: number) => void
) {
  useEffect(() => {
    if (snapshotMode) return;
    const s = computeScale(n);
    setScale(s);
    setTx(CX * (1 - s));
    setTy(CY * (1 - s));
  }, [n, snapshotMode, setScale, setTx, setTy]);
}
