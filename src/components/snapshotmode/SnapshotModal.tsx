import { createPortal } from "react-dom";
import { useEffect, useRef, type ReactNode } from "react";

export function SnapshotModal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const prevOverflowRef = useRef<string | null>(null);

  useEffect(() => {
    // lock background scroll
    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflowRef.current ?? "";
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/80">
      <div className="mt-15">{children}</div>
    </div>,
    document.body
  );
}
