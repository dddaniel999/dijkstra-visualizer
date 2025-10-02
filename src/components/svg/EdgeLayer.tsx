import { useMemo } from "react";
import type { NodePos } from "../functions";
import type { Graph } from "../dsa/graph";

const STROKE = 2;

export function EdgeLayer({
  graph,
  positions,
  pathSet,
  arrowId,
}: {
  graph: Graph;
  positions: NodePos;
  pathSet: Set<string>;
  arrowId: string;
}) {
  const ids = useMemo(() => Object.keys(positions), [positions]);

  return (
    <>
      {ids.flatMap((u) =>
        (graph[u] ?? []).map(({ to: v, w }) => {
          const a = positions[u],
            b = positions[v];
          if (!a || !b) return null;
          const key = `${u}->${v}`;
          const onPath = pathSet.has(key);
          return (
            <g key={key}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={onPath ? "#16a34a" : "#94a3b8"}
                strokeWidth={onPath ? STROKE + 1 : STROKE}
                markerEnd={`url(#${arrowId})`}
                opacity={onPath ? 1 : 0.65}
                shapeRendering="geometricPrecision"
              />
              <text
                x={(a.x + b.x) / 2}
                y={(a.y + b.y) / 2 - 6}
                fontSize={11}
                textAnchor="middle"
                fill="#475569"
                style={{ pointerEvents: "none" }}
              >
                {w}
              </text>
            </g>
          );
        })
      )}
    </>
  );
}
