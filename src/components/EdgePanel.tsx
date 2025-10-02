import React from "react";

type Props = {
  ids: string[];
  from: string;
  to: string;
  weight: number;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onWeightChange: (v: number) => void;
  onAddEdge: () => void;
  onRemoveEdge: () => void;
};

const EdgePanel: React.FC<Props> = ({
  ids,
  from,
  to,
  weight,
  onFromChange,
  onToChange,
  onWeightChange,
  onAddEdge,
  onRemoveEdge,
}) => {
  return (
    <div className="flex flex-wrap items-end gap-2">
      <label className="text-sm">
        from
        <select
          className="ml-2 px-2 py-1 rounded-md bg-white dark:bg-zinc-500"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
        >
          {ids.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        to
        <select
          className="ml-2 px-2 py-1 rounded-md bg-white dark:bg-zinc-500"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
        >
          {ids.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        Weight
        <input
          className="ml-2 w-16 px-2 py-1 rounded-md bg-white dark:bg-zinc-500"
          type="number"
          min={0}
          step={1}
          value={Number.isFinite(weight) ? weight : 0}
          onChange={(e) => onWeightChange(parseInt(e.target.value || "0", 10))}
        />
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          className="px-3 py-2 rounded-lg bg-sky-600 text-white disabled:opacity-40"
          onClick={onAddEdge}
          disabled={!ids.length}
        >
          + Edge
        </button>
        <button
          type="button"
          className="px-3 py-2 rounded-lg bg-amber-600 text-white disabled:opacity-40"
          onClick={onRemoveEdge}
          disabled={!ids.length}
        >
          - Edge
        </button>
      </div>
    </div>
  );
};

export default EdgePanel;
