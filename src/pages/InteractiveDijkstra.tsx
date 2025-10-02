import { useMemo, useRef, useState, useEffect } from "react";
import type { Graph } from "../components/dsa/graph";

import {
  DijkstraTopBar,
  DijkstraCanvas,
  DijkstraRightPanel,
  DijkstraSnapshotLayer,
} from "../components/interactive/ui";

import type { NodePos } from "../components/functions";
import {
  usePanZoom,
  useNodeDrag,
  usePositions,
  useDijkstra,
  useSnapshotFit,
  useSnapshotHotkey,
  useWheelBlock,
  useAutoScaleOnNodeCount,
  useGraphOps,
  useSelectionDraft,
  useCanvasHandlers,
  usePanelState,
  usePersistence,
} from "../hooks";

const STORAGE_KEY = "dijkstra-state";

const DEFAULT_GRAPH: Graph = {
  a: [
    { to: "b", w: 2 },
    { to: "c", w: 5 },
  ],
  b: [{ to: "d", w: 4 }],
  c: [{ to: "d", w: 1 }],
  d: [],
};

const MIN_SCALE = 0.4,
  MAX_SCALE = 2.5,
  ZOOM_STEP = 1.1;

export default function InteractiveDijkstra() {
  const { persisted, scheduleSave, clearAndReset } = usePersistence(
    STORAGE_KEY,
    { graph: DEFAULT_GRAPH, start: "a", target: "d" }
  );

  const [graph, setGraph] = useState<Graph>(
    () => persisted?.graph ?? DEFAULT_GRAPH
  );

  const ids = useMemo(() => Object.keys(graph).sort(), [graph]);
  const { positions, setPositions, randomize, resetCircle } = usePositions(ids);
  const n = ids.length;

  const [start, setStart] = useState<string>(() => persisted?.start ?? "a");
  const [target, setTarget] = useState<string | undefined>(
    () => persisted?.target ?? "d"
  );
  const { from, to, weight, selected, setFrom, setTo, setWeight, setSelected } =
    usePanelState({ from: "a", to: "b", weight: 1 });

  const [labels, setLabels] = useState<Record<string, string>>(() => {
    const baseGraph = persisted?.graph ?? graph;
    const pl = persisted?.labels ?? {};
    return Object.fromEntries(
      Object.keys(baseGraph).map((id) => [id, pl[id] ?? id.toUpperCase()])
    );
  });

  const didHydrateRef = useRef(false);
  useEffect(() => {
    if (persisted?.positions) {
      setPositions(persisted.positions);
    }
    didHydrateRef.current = true;
  }, [persisted, setPositions]);

  // persist on change
  useEffect(() => {
    if (!didHydrateRef.current) return;
    scheduleSave({ graph, positions, labels, start, target });
  }, [graph, positions, labels, start, target, scheduleSave]);

  useEffect(() => {
    setLabels((prev) => {
      const next: Record<string, string> = {};
      for (const id of Object.keys(graph))
        next[id] = prev[id] ?? id.toUpperCase();
      return next;
    });
  }, [graph]);

  // snapshot
  const [snapshotMode, setSnapshotMode] = useState(false);
  const snap = useSnapshotFit(snapshotMode, positions);
  useSnapshotHotkey(() => setSnapshotMode((v) => !v));

  // pan/zoom & drag
  const svgRef = useRef<SVGSVGElement | null>(null);
  const {
    scale,
    tx,
    ty,
    onSvgPointerDown: panDown,
    onSvgPointerMove: panMove,
    onSvgPointerUp: panUp,
    onSvgWheel,
    zoomAtCenter,
    setScale,
    setTx,
    setTy,
  } = usePanZoom(svgRef, {
    min: MIN_SCALE,
    max: MAX_SCALE,
    initialScale: 1,
    initialTx: 0,
    initialTy: 0,
  });
  const {
    onNodePointerDown: dragDown,
    maybeHandleDragMove,
    release: dragRelease,
  } = useNodeDrag(svgRef, scale, tx, ty, setPositions);

  useAutoScaleOnNodeCount(n, snapshotMode, setScale, setTx, setTy);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useWheelBlock(wrapperRef, !snapshotMode);

  // -=-=- logic hooks
  const { nameDraft, setNameDraft } = useSelectionDraft(selected, labels);
  const { addNode, removeNode, addEdge, removeEdge } = useGraphOps({
    setGraph,
    setPositions,
    setLabels,
    start,
    setStart,
    target,
    setTarget,
    from,
    setFrom,
    to,
    setTo,
  });

  const {
    onSvgPointerMove,
    onSvgPointerDown,
    onSvgPointerUp,
    onNodePointerDown,
  } = useCanvasHandlers({
    setSelected,
    maybeHandleDragMove,
    panMove,
    panDown,
    panUp,
    dragRelease,
    dragDown,
    positions: positions as NodePos,
  });

  const removeSelectedNode = () =>
    selected ? (removeNode(selected), setSelected(null)) : removeNode();
  const renameSelected = () => {
    if (!selected) return;
    const next = nameDraft.trim();
    if (!next) return;
    const safe = next.slice(0, 14);
    setLabels((prev) => ({ ...prev, [selected]: safe }));
  };

  const onZoomIn = () => zoomAtCenter(ZOOM_STEP);
  const onZoomOut = () => zoomAtCenter(1 / ZOOM_STEP);

  const { dist, prev } = useDijkstra(graph, start);

  return (
    <div className="p-2 dark:border-neutral-300 mx-auto flex flex-col dark:bg-zinc-900">
      <DijkstraTopBar
        n={n}
        ids={ids}
        start={start}
        setStart={setStart}
        target={target}
        setTarget={setTarget}
        selected={selected}
        onShuffle={randomize}
        onCircle={resetCircle}
        onAddNode={addNode}
        onRemoveSelectedNode={removeSelectedNode}
        snapshotMode={snapshotMode}
        onToggleSnapshot={() => setSnapshotMode((v) => !v)}
      />

      <div className="w-full rounded-xl bg-white dark:bg-zinc-900">
        <div className="flex flex-col md:flex-row">
          <DijkstraCanvas
            svgRef={svgRef}
            graph={graph}
            positions={positions}
            start={start}
            target={target}
            dist={dist}
            prev={prev}
            labels={labels}
            selectedId={selected}
            scale={scale}
            tx={tx}
            ty={ty}
            onSvgPointerDown={onSvgPointerDown}
            onSvgPointerMove={onSvgPointerMove}
            onSvgPointerUp={onSvgPointerUp}
            onSvgWheel={onSvgWheel}
            onNodePointerDown={onNodePointerDown}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            wrapperRef={wrapperRef}
            snapshotMode={snapshotMode}
          />

          <DijkstraRightPanel
            ids={ids}
            from={from}
            to={to}
            weight={weight}
            onFromChange={setFrom}
            onToChange={setTo}
            onWeightChange={setWeight}
            onAddEdge={() => addEdge(from, to, weight)}
            onRemoveEdge={() => removeEdge(from, to)}
            selected={selected}
            nameDraft={nameDraft}
            setNameDraft={setNameDraft}
            onRename={renameSelected}
            labels={labels}
            onClearState={() => {
              clearAndReset({
                setGraph,
                setPositions,
                setLabels,
                setStart,
                setTarget,
              });
              setSelected(null);
              setNameDraft("");
              setFrom(ids[0] ?? "");
              setTo(ids[1] ?? ids[0] ?? "");
              setWeight(1);
            }}
          />
        </div>
      </div>

      <div className="w-full flex items-center text-xs text-neutral-500 dark:text-neutral-300 px-4">
        <div>
          Tip: drag nodes to reposition; green path highlights shortest path
          from <b>{start}</b>
          {target && (
            <>
              {" "}
              to <b>{target}</b>
            </>
          )}
          .
        </div>
        <span className="ml-auto mr-12">
          scale: <b>{scale.toFixed(2)}</b>
        </span>
      </div>

      <DijkstraSnapshotLayer
        visible={snapshotMode}
        onClose={() => setSnapshotMode(false)}
        svgRef={svgRef}
        graph={graph}
        positions={positions}
        start={start}
        target={target}
        dist={dist}
        prev={prev}
        labels={labels}
        selected={selected}
        snap={snap}
        scale={scale}
        tx={tx}
        ty={ty}
      />
    </div>
  );
}
