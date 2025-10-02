import type { RefObject } from "react";
import { DijkstraSVG } from "../../DijkstraSVG";
import type { Graph } from "../../dsa/graph";

export function DijkstraCanvas({
  svgRef,
  graph,
  positions,
  start,
  target,
  dist,
  prev,
  labels,
  selectedId,
  scale,
  tx,
  ty,
  onSvgPointerDown,
  onSvgPointerMove,
  onSvgPointerUp,
  onSvgWheel,
  onNodePointerDown,
  onZoomIn,
  onZoomOut,
  wrapperRef,
  snapshotMode,
}: {
  svgRef: RefObject<SVGSVGElement | null>;
  graph: Graph;
  positions: Record<string, { x: number; y: number }>;
  start: string;
  target?: string;
  dist: Record<string, number>;
  prev: Record<string, string | null>;
  labels: Record<string, string>;
  selectedId: string | null;
  scale: number;
  tx: number;
  ty: number;
  onSvgPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  onSvgPointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  onSvgPointerUp: () => void;
  onSvgWheel: (e: React.WheelEvent<SVGSVGElement>) => void;
  onNodePointerDown: (id: string, e: React.PointerEvent<SVGGElement>) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  snapshotMode: boolean;
}) {
  return (
    <div className="flex-1 relative">
      <div
        ref={wrapperRef}
        className="w-full h-full overflow-hidden border border-zinc-300"
      >
        {!snapshotMode && (
          <DijkstraSVG
            ref={svgRef}
            graph={graph}
            positions={positions}
            start={start}
            target={target}
            dist={dist}
            prev={prev}
            scale={scale}
            tx={tx}
            ty={ty}
            onSvgPointerDown={onSvgPointerDown}
            onSvgPointerMove={onSvgPointerMove}
            onSvgPointerUp={onSvgPointerUp}
            onSvgWheel={onSvgWheel}
            onNodePointerDown={onNodePointerDown}
            labels={labels}
            selectedId={selectedId}
          />
        )}
      </div>

      {/* Floating zoom controls */}
      <div className="fixed bottom-12 right-4 z-50 flex flex-col gap-2">
        <button
          type="button"
          onClick={onZoomIn}
          aria-label="Zoom in"
          className="h-12 w-12 rounded-full bg-white shadow-lg border border-neutral-200 text-neutral-800 text-2xl leading-none flex items-center justify-center hover:bg-neutral-50 active:scale-95"
        >
          +
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          aria-label="Zoom out"
          className="h-12 w-12 rounded-full bg-white shadow-lg border border-neutral-200 text-neutral-800 text-2xl leading-none flex items-center justify-center hover:bg-neutral-50 active:scale-95"
        >
          -
        </button>
      </div>
    </div>
  );
}
