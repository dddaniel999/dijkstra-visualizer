import { useCallback } from "react";
import type { NodePos } from "../components/functions";

export function useCanvasHandlers({
  setSelected,
  maybeHandleDragMove,
  panMove,
  panDown,
  panUp,
  dragRelease,
  dragDown,
  positions,
}: {
  setSelected: (id: string | null) => void;
  maybeHandleDragMove: (e: React.PointerEvent<SVGSVGElement>) => boolean;
  panMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  panDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  panUp: () => void;
  dragRelease: () => void;
  dragDown: (
    id: string,
    e: React.PointerEvent<SVGGElement>,
    pos: NodePos
  ) => void;
  positions: NodePos;
}) {
  const onSvgPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const handled = maybeHandleDragMove(e);
      if (!handled) panMove(e);
    },
    [maybeHandleDragMove, panMove]
  );

  const onSvgPointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (e.defaultPrevented) return;
      if (e.target === e.currentTarget) setSelected(null);
      panDown(e);
    },
    [setSelected, panDown]
  );

  const onSvgPointerUp = useCallback(() => {
    dragRelease();
    panUp();
  }, [dragRelease, panUp]);

  const onNodePointerDown = useCallback(
    (id: string, e: React.PointerEvent<SVGGElement>) => {
      setSelected(id);
      dragDown(id, e, positions);
    },
    [setSelected, dragDown, positions]
  );

  return {
    onSvgPointerMove,
    onSvgPointerDown,
    onSvgPointerUp,
    onNodePointerDown,
  };
}
