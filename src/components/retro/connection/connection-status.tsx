"use client";
import { useRealtime } from "@/hooks/use-realtime";
import { CircleDot, LoaderPinwheel, CircleX } from "lucide-react";
import { useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getPhase, Phase, PhaseName } from "@/types/model";
import { PhaseTransition } from "../phase/phase-transition";

export function ConnectionStatus({
  retroId,
  retroPublicId,
}: {
  retroId: number;
  retroPublicId: string;
}) {
  // Toggle the splash screen when the phase is changing
  const [transitionPhase, setTransitionPhase] = useState<Phase | undefined>(
    undefined,
  );
  const onNewPhase = (phaseName: PhaseName) => {
    setTransitionPhase(getPhase(phaseName));
    setTimeout(() => setTransitionPhase(undefined), 2000);
  };

  const {
    isSuccess,
    isPending,
    isError,
    data: channel,
  } = useRealtime({ retroId, retroPublicId, onNewPhase });
  const [showFull, setShowFull] = useState(true); // Show wider pill, vs show just the icon

  useEffect(() => {
    return () => {
      // Cleanup and unsubscribe from the realtime channel
      if (isSuccess) {
        channel?.unsubscribe();
      }
    };
  }, [channel, isSuccess]);

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
    <>
      <PhaseTransition active={!!transitionPhase} phase={transitionPhase} />
      <div className="absolute z-40 bottom-4 left-4">
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
    </>
  );
}
