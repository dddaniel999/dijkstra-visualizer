import EdgePanel from "../../EdgePanel";

export function DijkstraRightPanel({
  ids,
  from,
  to,
  weight,
  onFromChange,
  onToChange,
  onWeightChange,
  onAddEdge,
  onRemoveEdge,
  selected,
  nameDraft,
  setNameDraft,
  onRename,
  labels,
  onClearState,
}: {
  ids: string[];
  from: string;
  to: string;
  weight: number;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onWeightChange: (v: number) => void;
  onAddEdge: () => void;
  onRemoveEdge: () => void;
  selected: string | null;
  nameDraft: string;
  setNameDraft: (v: string) => void;
  onRename: () => void;
  labels: Record<string, string>;
  onClearState: () => void;
}) {
  return (
    <aside className="md:w-80 border-t md:border-t-0 md:border-l border-neutral-200 p-3 md:sticky md:top-3 md:self-start bg-neutral-200 dark:bg-neutral-800">
      <div className="text-xs font-medium text-neutral-500 dark:text-neutral-300 mb-2">
        Edges
      </div>
      <EdgePanel
        ids={ids}
        from={from}
        to={to}
        weight={weight}
        onFromChange={onFromChange}
        onToChange={onToChange}
        onWeightChange={onWeightChange}
        onAddEdge={onAddEdge}
        onRemoveEdge={onRemoveEdge}
      />

      <div className="mt-12 p-3 rounded-md bg-white dark:bg-zinc-700 border border-neutral-200 dark:border-neutral-600">
        <div className="text-xs font-medium text-neutral-500 dark:text-neutral-300 mb-2">
          Node (Context) Actions
        </div>
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder={selected ? `Rename ${selected}` : "Select a node"}
            className="px-2 py-1 rounded-md bg-neutral-200 dark:bg-zinc-600 disabled:opacity-50"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            disabled={!selected}
          />
          <button
            className="px-3 py-1 rounded-md bg-indigo-600 text-white disabled:opacity-40"
            onClick={onRename}
            disabled={!selected || !nameDraft.trim()}
          >
            Rename
          </button>
        </div>
      </div>

      {selected && (
        <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-300">
          ID: <b>{selected}</b> • Label: <b>{labels[selected]}</b>
        </div>
      )}

      <div className="mt-4 p-3 rounded-md bg-white dark:bg-zinc-700 border border-neutral-200 dark:border-neutral-600">
        <div className="text-xs font-medium text-neutral-500 dark:text-neutral-300 mb-2">
          Persistence
        </div>
        <button
          className="px-3 py-1 rounded-md bg-rose-600 text-white hover:bg-rose-700 active:scale-95"
          onClick={onClearState}
        >
          Clear Saved State
        </button>
      </div>
    </aside>
  );
}
