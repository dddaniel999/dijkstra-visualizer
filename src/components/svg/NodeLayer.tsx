import type { NodePos } from "../functions";

export function NodeLayer({
  ids,
  positions,
  r,
  start,
  target,
  dist,
  onNodePointerDown,
  labels,
  selectedId,
}: {
  ids: string[];
  positions: NodePos;
  r: number;
  start: string;
  target?: string;
  dist: Record<string, number>;
  onNodePointerDown?: (id: string, e: React.PointerEvent<SVGGElement>) => void;
  labels?: Record<string, string>;
  selectedId?: string | null;
}) {
  return (
    <>
      {ids.map((id) => {
        const pos = positions[id];
        const isStart = id === start;
        const isTarget = id === target;
        const isSelected = selectedId === id;
        const display = labels?.[id] ?? id;
        return (
          <g
            key={id}
            onPointerDown={(e) => onNodePointerDown?.(id, e)}
            style={{ cursor: "grab" }}
          >
            {isSelected && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={r + 6}
                fill="none"
                stroke="#fbbf24"
                strokeWidth={3}
                strokeOpacity={0.6}
              />
            )}

            <circle
              cx={pos.x}
              cy={pos.y}
              r={r}
              fill={isStart ? "#0ea5e9" : isTarget ? "#10b981" : "#111827"}
            />

            {/* label */}
            <text
              x={pos.x}
              y={pos.y + 4}
              fontSize={12}
              textAnchor="middle"
              fill="#f8fafc"
              fontWeight="bold"
              style={{ pointerEvents: "none" }}
            >
              {display}
            </text>

            <text
              x={pos.x}
              y={pos.y + (r + 14)}
              fontSize={11}
              textAnchor="middle"
              fill="#64748b"
              style={{ pointerEvents: "none" }}
            >
              {Number.isFinite(dist[id]) ? `d=${dist[id]}` : "∞"}
            </text>
          </g>
        );
      })}
    </>
  );
}
