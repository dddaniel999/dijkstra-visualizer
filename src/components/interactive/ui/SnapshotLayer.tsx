import type { RefObject } from "react";
import { SnapshotModal } from "../../snapshotmode/SnapshotModal";
import SnapshotOverlay from "../../snapshotmode/SnapshotOverlay";
import { DijkstraSVG } from "../../DijkstraSVG";
import type { Graph } from "../../dsa/graph";
import { VB_W, VB_H } from "../../functions";
import gridBackground from "../../../assets/grid-background.jpg";

export function DijkstraSnapshotLayer({
  visible,
  onClose,
  svgRef,
  graph,
  positions,
  start,
  target,
  dist,
  prev,
  labels,
  selected,
  snap,
  scale,
  tx,
  ty,
}: {
  visible: boolean;
  onClose: () => void;
  svgRef: RefObject<SVGSVGElement | null>;
  graph: Graph;
  positions: Record<string, { x: number; y: number }>;
  start: string;
  target?: string;
  dist: Record<string, number>;
  prev: Record<string, string | null>;
  labels: Record<string, string>;
  selected: string | null;
  snap: { s: number; tx: number; ty: number } | null;
  scale: number;
  tx: number;
  ty: number;
}) {
  if (!visible) return null;
  return (
    <div>
      <SnapshotModal onClose={onClose}>
        {/* Tiled grid background */}
        <div
          className="absolute inset-0 -z-2 opacity-60"
          style={{
            backgroundImage: `url(${gridBackground})`,
            backgroundRepeat: "repeat",
            backgroundSize: "16px 16px",
            backgroundPosition: "center top",
          }}
        />
        <div className="absolute inset-0 -z-1 bg-black/50 pointer-events-none" />

        <div className="fixed inset-0 flex items-center justify-center">
          <div className="relative" style={{ width: VB_W, height: VB_H }}>
            <DijkstraSVG
              ref={svgRef}
              graph={graph}
              positions={positions}
              start={start}
              target={target}
              dist={dist}
              prev={prev}
              scale={snap?.s ?? scale}
              tx={snap?.tx ?? tx}
              ty={snap?.ty ?? ty}
              onSvgPointerDown={undefined}
              onSvgPointerMove={undefined}
              onSvgPointerUp={undefined}
              onSvgWheel={undefined}
              onNodePointerDown={undefined}
              labels={labels}
              selectedId={selected}
            />
            <SnapshotOverlay
              svgRef={svgRef}
              tx={snap?.tx ?? tx}
              ty={snap?.ty ?? ty}
              scale={snap?.s ?? scale}
            />
          </div>
        </div>

        <div className="absolute bottom-4 left-2 text-white/80 text-sm bg-black/50 px-3 py-1 rounded z-10">
          <p>S / Escape - Toggle snapshot mode</p>
          <p>Shift (hold) - lock aspect ratio</p>
          <p>Enter - Export PNG with current settings</p>
        </div>
      </SnapshotModal>
    </div>
  );
}
