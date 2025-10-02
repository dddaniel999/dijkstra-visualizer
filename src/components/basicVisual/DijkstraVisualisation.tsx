import { useMemo } from "react";
import { reconstructPath, type Graph } from "../dsa/graph";
import { useDijkstra } from "../../hooks/useDijkstra";

type NodePos = Record<string, { x: number; y: number }>;

type Props = {
  graph: Graph;
  positions: NodePos;
  start: string;
  target?: string;
};

const strokeWidth = 2;

export function DijkstraVisualisation({
  graph,
  positions,
  start,
  target,
}: Props) {
  const { dist, prev } = useDijkstra(graph, start);

  const pathSet = useMemo(() => {
    if (!target) return new Set<string>();
    const path = reconstructPath(prev, target);
    const set = new Set<string>();
    for (let i = 0; i < path.length - 1; i++) {
      set.add(`${path[i]}->${path[i + 1]}`);
    }
    return set;
  }, [prev, target]);

  const nodes = Object.keys(positions);

  return (
    <svg viewBox="0 0 800 500" className="w-full h-[80vh]">
      {/*Edges*/}
      {nodes.flatMap((u) =>
        (graph[u] ?? []).map(({ to: v, w }) => {
          const a = positions[u],
            b = positions[v];
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
                strokeWidth={onPath ? strokeWidth + 1 : strokeWidth}
                markerEnd="url(#arrow)"
                opacity={onPath ? 1 : 0.5}
              />

              <text
                x={(a.x + b.x) / 2}
                y={(a.y + b.y) / 2 - 6}
                fontSize="12"
                textAnchor="end"
                fill="#475569"
              >
                {w}
              </text>
            </g>
          );
        })
      )}

      {/*Arrow marker*/}
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="13"
          refY="3"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L0,6 L9,3 z" />
        </marker>
      </defs>

      {/*Nodes*/}
      {nodes.map((id) => {
        const p = positions[id];
        const isStart = id === start;
        const isEnd = id === target;

        return (
          <g key={id}>
            <circle
              cx={p.x}
              cy={p.y}
              r={18}
              fill={isStart ? "#0ea5e9" : isEnd ? "#10b981" : "111827"}
            />
            <text
              x={p.x}
              y={p.y + 4}
              fontSize="12"
              textAnchor="middle"
              fill="#f8fafc"
              fontWeight="bold"
            >
              {id}
            </text>

            {/*distance*/}
            <text
              x={p.x}
              y={p.y + 30}
              fontSize="11"
              textAnchor="inherit"
              fill="#64748b"
            >
              {Number.isFinite(dist[id]) ? `d=${dist[id]}` : "infinite"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
