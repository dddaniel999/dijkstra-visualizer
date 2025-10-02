import { useEffect, useState } from "react";
import {
  computeNodeRadius,
  fitToViewBox,
  graphBounds,
  VB_W,
  VB_H,
} from "../components/functions";

export function useSnapshotFit(
  snapshotMode: boolean,
  positions: Record<string, { x: number; y: number }>
) {
  const [snap, setSnap] = useState<{
    s: number;
    tx: number;
    ty: number;
  } | null>(null);
  useEffect(() => {
    if (!snapshotMode) return;
    const r = computeNodeRadius(Object.keys(positions).length);
    const b = graphBounds(positions, r, 24);
    const fit = fitToViewBox(b, VB_W, VB_H);
    setSnap(fit);
  }, [snapshotMode, positions]);
  return snap;
}

export function useSnapshotHotkey(toggle: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "s") {
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        )
          return;
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);
}

export function useWheelBlock(
  wrapperRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const blockWheel = (evt: WheelEvent) => evt.preventDefault();
    if (enabled)
      el.addEventListener("wheel", blockWheel, {
        capture: true,
        passive: false,
      });
    return () =>
      el.removeEventListener(
        "wheel",
        blockWheel as any,
        { capture: true } as any
      );
  }, [wrapperRef, enabled]);
}
