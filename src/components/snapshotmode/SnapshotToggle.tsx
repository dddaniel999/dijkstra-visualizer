export function SnapshotToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-2 rounded-lg ${
        enabled ? "bg-rose-600" : "bg-slate-700"
      } text-white`}
      title="Toggle snapshot mode (for exporting PNG)"
    >
      {enabled ? "Exit Snapshot Mode" : "Enter Snapshot Mode (s)"}
    </button>
  );
}
