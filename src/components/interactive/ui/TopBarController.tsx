import { SnapshotToggle } from "../../snapshotmode/SnapshotToggle";

export function DijkstraTopBar({
  n,
  ids,
  start,
  setStart,
  target,
  setTarget,
  selected,
  onShuffle,
  onCircle,
  onAddNode,
  onRemoveSelectedNode,
  snapshotMode,
  onToggleSnapshot,
}: {
  n: number;
  ids: string[];
  start: string;
  setStart: (id: string) => void;
  target?: string;
  setTarget: (id?: string) => void;
  selected: string | null;
  onShuffle: () => void;
  onCircle: () => void;
  onAddNode: () => void;
  onRemoveSelectedNode: () => void;
  snapshotMode: boolean;
  onToggleSnapshot: () => void;
}) {
  const Options = ids.map((id) => (
    <option key={id} value={id}>
      {id}
    </option>
  ));

  return (
    <div className="rounded-lg bg-neutral-200 dark:bg-zinc-900 px-3 py-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:gap-6 md:justify-start">
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="px-3 py-2 rounded-lg bg-indigo-600 text-white"
              onClick={onShuffle}
            >
              Shuffle
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-slate-700 text-white"
              onClick={onCircle}
            >
              Circle
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-40"
              onClick={onAddNode}
              disabled={ids.length >= 26}
            >
              + Node
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-rose-600 text-white disabled:opacity-40"
              onClick={onRemoveSelectedNode}
              disabled={!ids.length}
              title={selected ? `Remove node ${selected}` : undefined}
            >
              {selected ? `- Node (${selected})` : "- Node"}
            </button>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm flex items-center">
              <span className="text-neutral-700 dark:text-neutral-300">
                start
              </span>
              <select
                className="ml-2 px-2 py-1 rounded-md bg-white dark:bg-zinc-600"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              >
                {Options}
              </select>
            </label>

            <label className="text-sm flex items-center">
              <span className="text-neutral-700 dark:text-neutral-300">
                target
              </span>
              <select
                className="ml-2 px-2 py-1 rounded-md bg-white dark:bg-zinc-600"
                value={target ?? ""}
                onChange={(e) => setTarget(e.target.value || undefined)}
              >
                <option value="">(none)</option>
                {Options}
              </select>
            </label>

            <div className="text-sm text-neutral-600 dark:text-neutral-400 sm:ml-2">
              nodes: <b>{n}</b>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <SnapshotToggle enabled={snapshotMode} onToggle={onToggleSnapshot} />
        </div>
      </div>
    </div>
  );
}
