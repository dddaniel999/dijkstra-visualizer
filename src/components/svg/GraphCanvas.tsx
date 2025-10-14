import { forwardRef, useId } from "react";
import { VB_W, VB_H } from "../functions";

type GraphCanvasProps = {
  snapshotMode?: boolean;
  scale: number;
  tx: number;
  ty: number;
  onSvgPointerMove?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onSvgPointerUp?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onSvgPointerDown?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onSvgWheel?: (e: React.WheelEvent<SVGSVGElement>) => void;
  children?: (ctx: { arrowId: string; gTransform: string }) => React.ReactNode;
};

export const GraphCanvas = forwardRef<SVGSVGElement, GraphCanvasProps>(
  (
    {
      snapshotMode = false,
      scale,
      tx,
      ty,
      onSvgPointerMove,
      onSvgPointerUp,
      onSvgPointerDown,
      onSvgWheel,
      children,
    },
    svgRef
  ) => {
    const uId = useId();
    const arrowId = `arrow-${uId}`;
    const gTransform = `translate(${tx}, ${ty}) scale(${scale})`;

    return (
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full h-[69vh] select-none"
        onPointerMove={onSvgPointerMove}
        onPointerUp={onSvgPointerUp}
        onPointerDown={onSvgPointerDown}
        onWheel={onSvgWheel}
        onContextMenu={(e) => e.preventDefault()}
        style={{ background: snapshotMode ? "transparent" : undefined }}
      >
        <defs>
          <marker
            id={arrowId}
            markerWidth="10"
            markerHeight="10"
            refX="14"
            refY="3"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L0,6 L9,3 z" />
          </marker>
        </defs>

        <g data-root transform={gTransform}>
          {children?.({ arrowId, gTransform })}
        </g>
      </svg>
    );
  }
);
