import { useMemo } from "react";
import { dijkstra, type Graph } from "../components/dsa/graph";

export function useDijkstra(graph: Graph, start: string) {
  return useMemo(() => dijkstra(graph, start), [graph, start]);
}
