import { useEffect, useState, useRef } from "react";
import { exportSvgRegionToPng } from "./exportSvg";

type Rect = { x: number; y: number; w: number; h: number };
type DragKind = "move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

const PRESETS = [
  { label: "1080p (1920x1080)", w: 1920, h: 1080 },
  { label: "4K (3840x2160)", w: 3840, h: 2160 },
  { label: "A4 Portrait @300dpi (2480x3508)", w: 2480, h: 3508 },
  { label: "A4 Landscape @300dpi (3508x2480)", w: 3508, h: 2480 },
];

export default function SnapshotOverlay({
  svgRef,
  tx,
  ty,
  scale,
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  tx: number;
  ty: number;
  scale: number;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState<Rect>({ x: 80, y: 80, w: 640, h: 360 });
  const [dpiScale, setDpiScale] = useState(2);
  const [keepAspect, setKeepAspect] = useState(false);
  const aspectRef = useRef<number>(rect.w / rect.h);

  const dragRef = useRef<{
    kind: DragKind;
    ox: number;
    oy: number;
    start: Rect;
  } | null>(null);

  function clamp(next: Rect): Rect {
    const host = hostRef.current;
    if (!host) return next;
    const hb = host.getBoundingClientRect();
    const minSize = 24;
    const w = Math.max(minSize, Math.min(next.w, hb.width));
    const h = Math.max(minSize, Math.min(next.h, hb.height));
    const x = Math.max(0, Math.min(next.x, hb.width - w));
    const y = Math.max(0, Math.min(next.y, hb.height - h));
    return { x, y, w, h };
  }

  function beginDrag(e: React.PointerEvent, kind: DragKind) {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = {
      kind,
      ox: e.clientX,
      oy: e.clientY,
      start: { ...rect },
    };

    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  }

  function onMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const { kind, ox, oy, start } = dragRef.current;
    const dx = e.clientX - ox;
    const dy = e.clientY - oy;

    if (kind === "move") {
      setRect(clamp({ ...start, x: start.x + dx, y: start.y + dy }));
      return;
    }

    // -- resize handles
    let { x, y, w, h } = start;
    const a = keepAspect ? aspectRef.current || start.w / start.h : null;

    const clampWH = (nw: number, nh: number) => ({
      w: Math.max(24, nw),
      h: Math.max(24, nh),
    });

    const applyCorner = (sx: -1 | 1, sy: -1 | 1) => {
      let nw = w + sx * dx;
      let nh = h + sy * dy;
      if (a) {
        if (Math.abs(dx) > Math.abs(dy * a)) nh = nw / a;
        else nw = nh * a;
      }
      const { w: cw, h: ch } = clampWH(nw, nh);
      const nx = sx < 0 ? x + (w - cw) : x;
      const ny = sy < 0 ? y + (h - ch) : y;
      return clamp({ x: nx, y: ny, w: cw, h: ch });
    };

    const applyEdge = (sx: -1 | 0 | 1, sy: -1 | 0 | 1) => {
      let nw = w,
        nh = h,
        nx = x,
        ny = y;
      if (sx !== 0) {
        nw = w + sx * dx;
        if (a) nh = nw / a;
        if (sx < 0) nx = x + (w - Math.max(24, nw));
      }
      if (sy !== 0) {
        nh = h + sy * dy;
        if (a) nw = nh * a;
        if (sy < 0) ny = y + (h - Math.max(24, nh));
      }
      const { w: cw, h: ch } = clampWH(nw, nh);
      return clamp({ x: nx, y: ny, w: cw, h: ch });
    };

    let next: Rect;
    switch (kind) {
      case "nw":
        next = applyCorner(-1, -1);
        break;
      case "ne":
        next = applyCorner(+1, -1);
        break;
      case "sw":
        next = applyCorner(-1, +1);
        break;
      case "se":
        next = applyCorner(+1, +1);
        break;
      case "n":
        next = applyEdge(0, -1);
        break;
      case "s":
        next = applyEdge(0, +1);
        break;
      case "e":
        next = applyEdge(+1, 0);
        break;
      case "w":
        next = applyEdge(-1, 0);
        break;
      default:
        return;
    }

    setRect(next);
  }

  function endDrag(e?: React.PointerEvent) {
    dragRef.current = null;
    if (e?.currentTarget) {
      (e.currentTarget as Element).releasePointerCapture?.(
        (e as any).pointerId
      );
    }
  }

  useEffect(() => {
    const up = () => (dragRef.current = null);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  function clientXYToSvgGraph(svg: SVGSVGElement, cx: number, cy: number) {
    const g = svg.querySelector("g[data-root]") as SVGGElement | null;
    const ctm = g?.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };

    const pt = svg.createSVGPoint();
    pt.x = cx;
    pt.y = cy;
    const sp = pt.matrixTransform(ctm.inverse()); // sp in viewBox units

    return {
      x: sp.x,
      y: sp.y,
    };
  }

  async function doExport() {
    const svg = svgRef.current;
    const host = hostRef.current;
    if (!svg || !host) return;

    const hostBox = host.getBoundingClientRect();
    const left = hostBox.left + rect.x;
    const top = hostBox.top + rect.y;
    const right = left + rect.w;
    const bottom = top + rect.h;

    const p1 = clientXYToSvgGraph(svg, left, top);
    const p2 = clientXYToSvgGraph(svg, right, bottom);

    // region in graph units
    const region = {
      x: Math.min(p1.x, p2.x),
      y: Math.min(p1.y, p2.y),
      w: Math.max(1, Math.abs(p2.x - p1.x)),
      h: Math.max(1, Math.abs(p2.y - p1.y)),
    };

    const scaleFactor = dpiScale * (window.devicePixelRatio || 1);
    await exportSvgRegionToPng(svg, region, scaleFactor, "graph-snapshot.png");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") doExport();
      if (e.key === "Shift") setKeepAspect(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setKeepAspect(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [rect, dpiScale, tx, ty, scale]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const hb = host.getBoundingClientRect();
    const w = 960;
    const h = 540;

    setRect({
      x: Math.max(0, (hb.width - w) / 2),
      y: Math.max(0, (hb.height - h) / 2 - 80),
      w,
      h,
    });
  }, []);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 pointer-events-none"
      onPointerMove={onMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ touchAction: "none" }}
    >
      <div
        className="pointer-events-auto absolute border-2 border-white/90"
        style={{
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
          cursor: "move",
        }}
        onPointerDown={(e) => {
          if (e.currentTarget === e.target) {
            beginDrag(e, "move");
          }
        }}
      >
        {/* Resize handles */}
        {/* Corners */}
        <Handle pos="nw" onPointerDown={(e) => beginDrag(e, "nw")} />
        <Handle pos="ne" onPointerDown={(e) => beginDrag(e, "ne")} />
        <Handle pos="sw" onPointerDown={(e) => beginDrag(e, "sw")} />
        <Handle pos="se" onPointerDown={(e) => beginDrag(e, "se")} />
        {/* Edges */}
        <Handle pos="n" onPointerDown={(e) => beginDrag(e, "n")} />
        <Handle pos="s" onPointerDown={(e) => beginDrag(e, "s")} />
        <Handle pos="e" onPointerDown={(e) => beginDrag(e, "e")} />
        <Handle pos="w" onPointerDown={(e) => beginDrag(e, "w")} />

        {/* Toolbar */}
        <div className="absolute -top-10 left-0 flex items-center gap-2">
          <select
            className="pointer-events-auto rounded bg-neutral-700 text-xs px-2 py-1 border"
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => {
              const i = Number(e.target.value);
              const p = PRESETS[i];
              if (!p) return;
              const scaleDown = 0.5;
              const next = {
                w: Math.round(p.w * scaleDown),
                h: Math.round(p.h * scaleDown),
              };
              aspectRef.current = next.w / next.h;
              setRect((r) => clamp({ ...r, ...next }));
            }}
          >
            <option>Presets…</option>
            {PRESETS.map((p, i) => (
              <option key={p.label} value={i}>
                {p.label}
              </option>
            ))}
          </select>

          <label className="pointer-events-auto text-white/90 text-xs">
            DPI
            <select
              className="ml-1 rounded bg-neutral-700 text-xs px-1 py-0.5 border"
              value={dpiScale}
              onPointerDown={(e) => e.stopPropagation()}
              onChange={(e) => setDpiScale(Number(e.target.value))}
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </select>
          </label>

          <button
            className="pointer-events-auto rounded bg-neutral-700 text-xs px-2 py-1"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={doExport}
          >
            Export PNG
          </button>
        </div>
      </div>
    </div>
  );
}

function Handle({
  pos,
  onPointerDown,
}: {
  pos: "n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se";
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  const base = "absolute bg-white/90 rounded-sm";
  const size = 10;
  const hit = 24;
  const style: React.CSSProperties = { width: hit, height: hit };

  const map: Record<string, { style: React.CSSProperties; cursor: string }> = {
    nw: { style: { left: -hit / 2, top: -hit / 2 }, cursor: "nwse-resize" },
    ne: { style: { right: -hit / 2, top: -hit / 2 }, cursor: "nesw-resize" },
    sw: { style: { left: -hit / 2, bottom: -hit / 2 }, cursor: "nesw-resize" },
    se: { style: { right: -hit / 2, bottom: -hit / 2 }, cursor: "nwse-resize" },
    n: {
      style: { top: -hit / 2, left: "50%", transform: "translateX(-50%)" },
      cursor: "ns-resize",
    },
    s: {
      style: { bottom: -hit / 2, left: "50%", transform: "translateX(-50%)" },
      cursor: "ns-resize",
    },
    e: {
      style: { right: -hit / 2, top: "50%", transform: "translateY(-50%)" },
      cursor: "ew-resize",
    },
    w: {
      style: { left: -hit / 2, top: "50%", transform: "translateY(-50%)" },
      cursor: "ew-resize",
    },
  };

  return (
    <div
      className="absolute"
      style={{ ...style, ...map[pos].style, cursor: map[pos].cursor }}
      onPointerDown={onPointerDown}
    >
      <div
        className={base}
        style={{
          width: size,
          height: size,
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.25)",
        }}
      />
    </div>
  );
}
