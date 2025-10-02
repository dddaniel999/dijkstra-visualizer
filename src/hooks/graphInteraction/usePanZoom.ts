import { useState, useRef, useCallback } from "react";
import { VB_W, VB_H, clientToSvgPoint } from "../../components/functions";

type PanZoomOpts = {
  min?: number;
  max?: number;
  initialScale: number;
  initialTx: number;
  initialTy: number;
};

export function usePanZoom(
  svgRef: React.RefObject<SVGSVGElement | null>,
  opts: PanZoomOpts
) {
  const { min = 0.4, max = 2.5, initialScale, initialTx, initialTy } = opts;
  const [scale, setScale] = useState(initialScale);
  const [tx, setTx] = useState(initialTx);
  const [ty, setTy] = useState(initialTy);

  const panRef = useRef<{
    active: boolean;
    lastUx: number;
    lastUy: number;
  } | null>(null);

  const getCursorUxUy = useCallback(
    (
      e: React.PointerEvent<SVGSVGElement> | React.WheelEvent<SVGSVGElement>
    ) => {
      const svg = svgRef.current!;
      const rect = svg.getBoundingClientRect();
      const ux = ((e.clientX - rect.left) / rect.width) * VB_W;
      const uy = ((e.clientY - rect.top) / rect.height) * VB_H;
      return { ux, uy };
    },
    [svgRef]
  );

  const onSvgPointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (e.button !== 1 && e.button !== 2) return;
      if (!svgRef.current) return;
      e.preventDefault();
      (e.currentTarget as any).setPointerCapture?.(e.pointerId);
      const { ux, uy } = getCursorUxUy(e);
      panRef.current = { active: true, lastUx: ux, lastUy: uy };
    },
    [getCursorUxUy, svgRef]
  );

  const onSvgPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (panRef.current?.active) {
        const { ux, uy } = getCursorUxUy(e);
        const dx = ux - panRef.current.lastUx;
        const dy = uy - panRef.current.lastUy;
        setTx((t) => t + dx);
        setTy((t) => t + dy);
        panRef.current.lastUx = ux;
        panRef.current.lastUy = uy;
      }
    },
    [getCursorUxUy]
  );

  const onSvgPointerUp = useCallback(() => {
    if (panRef.current) panRef.current.active = false;
  }, []);

  const onSvgWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      if (!svgRef.current) return;
      const { ux, uy } = getCursorUxUy(e);
      const { x: wx, y: wy } = clientToSvgPoint(
        e as any,
        svgRef.current,
        tx,
        ty,
        scale
      );
      const zoom = Math.pow(1.0015, -e.deltaY);
      const next = Math.max(min, Math.min(max, scale * zoom));
      setScale(next);
      setTx(ux - next * wx);
      setTy(uy - next * wy);
    },
    [getCursorUxUy, svgRef, scale, tx, ty, min, max]
  );

  const zoomAt = useCallback(
    (ux: number, uy: number, factor: number) => {
      setScale((prev) => {
        const next = Math.max(min, Math.min(max, prev * factor));
        const wx = (ux - tx) / scale;
        const wy = (uy - ty) / scale;
        setTx(ux - next * wx);
        setTy(uy - next * wy);
        return next;
      });
    },
    [min, max, tx, ty, scale]
  );

  const zoomAtCenter = useCallback(
    (factor: number) => {
      zoomAt(VB_W / 2, VB_H / 2, factor);
    },
    [zoomAt]
  );

  return {
    scale,
    tx,
    ty,
    onSvgPointerDown,
    onSvgPointerMove,
    onSvgPointerUp,
    onSvgWheel,
    zoomAtCenter,
    setScale,
    setTx,
    setTy,
  };
}
