"use client";
import { useRealtime } from "@/hooks/use-realtime";
import { CircleDot, LoaderPinwheel, CircleX } from "lucide-react";
import { useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ConnectionStatus({ retroId, retroPublicId }: { retroId: number, retroPublicId: string }) {
  const { isSuccess, isPending, isError } = useRealtime({ retroId, retroPublicId })();
  const [showFull, setShowFull] = useState(true); // Show wider pill, vs show just the icon

  useEffect(() => {
    const timeout = setTimeout(() => setShowFull(false), 2000);
    return () => clearTimeout(timeout);
  }, [showFull]);

  const Content = (icon: ReactNode, text: ReactNode) => (
    <div className="flex items-center gap-2 w-fit rounded-full border border-secondary-muted p-2 select-none transition-all">
      {icon}
      <div
        className={cn(
          "animate-out animate-in pr-2",
          showFull ? "w-fit" : "w-0 hidden",
        )}
      >
        {text}
      </div>
    </div>
  );

  const handleClick = () => {
    setShowFull((prev) => !prev);
  };

  return (
    <div className="absolute z-50 bottom-4 left-4">
      {isSuccess &&
        Content(
          <CircleDot
            size={24}
            className="text-primary animate-pulse cursor-pointer transition-all"
            onClick={handleClick}
          />,
          <div className="text-primary font-bold animate-out animate-in">
            Connected!
          </div>,
        )}
      {isPending &&
        Content(
          <LoaderPinwheel
            size={24}
            className="text-orange-300 animate-spin cursor-pointer transition-all"
            onClick={handleClick}
          />,
          <div className="text-orange-300 font-bold animate-out animate-in">
            Connecting...
          </div>,
        )}
      {isError &&
        Content(
          <CircleX
            size={24}
            className="text-red-300 cursor-pointer transition-all"
            onClick={handleClick}
          />,
          <div className="text-red-300 font-bold animate-out animate-in">
            Not connected
          </div>,
        )}
    </div>
  );
}
