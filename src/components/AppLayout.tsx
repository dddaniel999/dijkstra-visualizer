import { type PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 transition-colors">
      {children}
    </div>
  );
}
