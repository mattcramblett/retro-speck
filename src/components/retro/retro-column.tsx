import { cn } from "@/lib/utils";
import { ClassValue } from "class-variance-authority/types";
import { ReactNode } from "react";

export function RetroColumn({
  name,
  children,
  showLabel,
  fullHeight,
  className,
}: {
  name?: string;
  children: ReactNode;
  showLabel?: boolean;
  fullHeight?: boolean;
  className?: ClassValue;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-4 max-h-full", className)}>
      {name && showLabel && (
        <div className="flex min-h-8 w-full items-start px-2 overflow-x-scroll">
          <h2 className="font-black text-xl">{name}</h2>
        </div>
      )}
      <div className={cn("flex flex-col mb-8 overflow-y-auto tiny-scrollbar bg-card items-center gap-4 py-4 px-3 border border-primary/10 rounded-lg min-w-80 max-w-80 max-h-full", fullHeight ? "h-full" : null)}>
        {children}
      </div>
    </div>
  );
}
