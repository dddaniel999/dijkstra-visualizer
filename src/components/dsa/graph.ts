import minPriorityQueue from "./minPriorityQueue";

export type Graph = Record<string, { to: string; w: number }[]>;

export type DijkstraResult = {
  dist: Record<string, number>;
  prev: Record<string, string | null>;
};

export function dijkstra(graph: Graph, start: string): DijkstraResult {
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const pq = new minPriorityQueue<string>();

  for (const node of Object.keys(graph)) {
    dist[node] = Infinity;
    prev[node] = null;
  }
  dist[start] = 0;
  pq.push(0, start);

  while (!pq.isEmpty()) {
    const item = pq.pop();
    if (!item) break;
    const { key: d, val: u } = item;
    if (d !== dist[u]) continue;

    for (const { to: v, w } of graph[u] ?? []) {
      const alt = d + w;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        pq.push(alt, v);
      }
    }
  }
  return { dist, prev };
}
export function reconstructPath(
  prev: Record<string, string | null>,
  target: string
): string[] {
  const path: string[] = [];
  let cur: string | null = target;

  while (cur) {
    path.push(cur);
    cur = prev[cur];
  }
  return path.reverse();
}
