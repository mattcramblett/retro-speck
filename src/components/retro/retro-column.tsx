import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function RetroColumn({
  name,
  children,
  showLabel,
  fullHeight,
}: {
  name?: string;
  children: ReactNode;
  showLabel?: boolean;
  fullHeight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      {name && showLabel && (
        <div className="flex min-h-8 w-full items-start px-2 overflow-x-scroll">
          <h2 className="font-black text-xl">{name}</h2>
        </div>
      )}
      <div className={cn("flex flex-col max-h-full overflow-y-scroll tiny-scrollbar bg-card items-center gap-4 py-4 px-3 border border-primary/10 rounded-lg min-w-80 max-w-80", fullHeight ? "h-full" : null)}>
        {children}
      </div>
    </div>
  );
}
