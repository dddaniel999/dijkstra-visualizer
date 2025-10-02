import { useEffect, useState } from "react";

export function useSelectionDraft(
  selected: string | null,
  labels: Record<string, string>
) {
  const [nameDraft, setNameDraft] = useState("");
  useEffect(() => {
    setNameDraft(selected ? labels[selected] ?? "" : "");
  }, [selected, labels]);
  return { nameDraft, setNameDraft };
}
