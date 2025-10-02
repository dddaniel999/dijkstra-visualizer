import { DijkstraVisualisation } from "../components/basicVisual/DijkstraVisualisation";
import { type Graph } from "../components/dsa/graph";

export default function BasicVisualisation() {
  const graph: Graph = {
    A: [
      { to: "B", w: 4 },
      { to: "C", w: 2 },
    ],
    B: [{ to: "E", w: 3 }],
    C: [
      { to: "B", w: 1 },
      { to: "D", w: 4 },
    ],
    D: [{ to: "E", w: 1 }],
    E: [],
  };

  const positions = {
    A: { x: 80, y: 250 },
    B: { x: 260, y: 140 },
    C: { x: 260, y: 360 },
    D: { x: 480, y: 360 },
    E: { x: 640, y: 200 },
  };

  return (
    <>
      <DijkstraVisualisation
        graph={graph}
        positions={positions}
        start="A"
        target="E"
      />
    </>
  );
}
