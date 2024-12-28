import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { ReactNode } from "react";

export function SplashScreen({
  className,
  children,
  dataState,
}: {
  className?: ClassValue;
  dataState?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-state={dataState}
      className={cn(
        "fixed inset-0 z-50 transition-all h-screen w-screen bg-gradient flex items-center justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
