import { dijkstra, reconstructPath, type Graph } from "../dsa/graph";

export function test() {
  const graph: Graph = {
    A: [
      { to: "B", w: 5 },
      { to: "C", w: 1 },
    ],
    B: [{ to: "D", w: 1 }],
    C: [
      { to: "B", w: 2 },
      { to: "D", w: 4 },
    ],
    D: [],
  };

  const { dist, prev } = dijkstra(graph, "A");

  console.log(dist);

  console.log(reconstructPath(prev, "D"));
}
