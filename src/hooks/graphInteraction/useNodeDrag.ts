import { useRef, useCallback } from "react";
import { type NodePos, clientToSvgPoint } from "../../components/functions";

export function useNodeDrag(
  svgRef: React.RefObject<SVGSVGElement | null>,
  scale: number,
  tx: number,
  ty: number,
  setPositions: React.Dispatch<React.SetStateAction<NodePos>>
) {
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const onNodePointerDown = useCallback(
    (id: string, e: React.PointerEvent<SVGGElement>, positions: NodePos) => {
      const svg = svgRef.current;
      if (!svg) return;
      (e.currentTarget as any).setPointerCapture?.(e.pointerId);
      const { x, y } = clientToSvgPoint(e as any, svg, tx, ty, scale);
      const node = positions[id];
      dragRef.current = { id, dx: node.x - x, dy: node.y - y };
    },
    [svgRef, tx, ty, scale]
  );

  const maybeHandleDragMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (dragRef.current && svgRef.current) {
        const { x, y } = clientToSvgPoint(
          e as any,
          svgRef.current,
          tx,
          ty,
          scale
        );
        const { id, dx, dy } = dragRef.current;
        setPositions((pos) => ({ ...pos, [id]: { x: x + dx, y: y + dy } }));
        return true;
      }
      return false;
    },
    [svgRef, tx, ty, scale, setPositions]
  );

  const release = useCallback(() => {
    dragRef.current = null;
  }, []);

  return { onNodePointerDown, maybeHandleDragMove, release };
}
