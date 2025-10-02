import { forwardRef, useMemo } from "react";
import { reconstructPath, type Graph } from "./dsa/graph";
import { computeNodeRadius, type NodePos } from "./functions";
import { GraphCanvas } from "./svg/GraphCanvas";
import { EdgeLayer } from "./svg/EdgeLayer";
import { NodeLayer } from "./svg/NodeLayer";

type DijkstraSVGProps = {
  snapshotMode?: boolean;
  graph: Graph;
  positions: NodePos;
  start: string;
  target?: string;

  dist: Record<string, number>;
  prev: Record<string, string | null>;

  onNodePointerDown?: (id: string, e: React.PointerEvent<SVGGElement>) => void;
  scale: number;
  tx: number;
  ty: number;
  onSvgPointerMove?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onSvgPointerUp?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onSvgPointerDown?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onSvgWheel?: (e: React.WheelEvent<SVGSVGElement>) => void;

  labels?: Record<string, string>;
  selectedId?: string | null;
};

export const DijkstraSVG = forwardRef<SVGSVGElement, DijkstraSVGProps>(
  (
    {
      snapshotMode = false,
      graph,
      positions,
      start,
      target,
      dist,
      prev,
      onNodePointerDown,
      scale,
      tx,
      ty,
      onSvgPointerMove,
      onSvgPointerUp,
      onSvgPointerDown,
      onSvgWheel,
      labels,
      selectedId,
    },
    svgRef
  ) => {
    const ids = Object.keys(positions);
    const r = computeNodeRadius(ids.length);

    const pathSet = useMemo(() => {
      if (!target) return new Set<string>();
      const path = reconstructPath(prev, target);
      const s = new Set<string>();
      for (let i = 0; i < path.length - 1; i++)
        s.add(`${path[i]}->${path[i + 1]}`);
      return s;
    }, [prev, target]);

    return (
      <GraphCanvas
        ref={svgRef}
        snapshotMode={snapshotMode}
        scale={scale}
        tx={tx}
        ty={ty}
        onSvgPointerMove={onSvgPointerMove}
        onSvgPointerUp={onSvgPointerUp}
        onSvgPointerDown={onSvgPointerDown}
        onSvgWheel={onSvgWheel}
      >
        {({ arrowId }) => (
          <>
            <EdgeLayer
              graph={graph}
              positions={positions}
              pathSet={pathSet}
              arrowId={arrowId}
            />
            <NodeLayer
              ids={ids}
              positions={positions}
              r={r}
              start={start}
              target={target}
              dist={dist}
              onNodePointerDown={onNodePointerDown}
              labels={labels}
              selectedId={selectedId}
            />
          </>
        )}
      </GraphCanvas>
    );
  }
);
