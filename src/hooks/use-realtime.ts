"use client";
import { useRef } from "react";
import { makeBroadcastClient } from "@/clients/broadcast-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { retroQuery } from "./retros/use-retro";
import { EVENT } from "@/types/event";
import { PhaseName } from "@/types/model";

export function useRealtime({
  retroPublicId,
  retroId,
  onNewPhase,
}: {
  retroPublicId: string;
  retroId: number;
  onNewPhase?: (phase: PhaseName) => void;
}) {
  const { useRefreshCard } = useRetroCards({ retroId });
  const { mutate: refreshCard } = useRefreshCard();

  const client = useRef(makeBroadcastClient());
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["realtime", retroPublicId],
    staleTime: Infinity,
    queryFn: () => {
      const channel = client.current.channel(retroPublicId, {
        config: {
          broadcast: { self: true }, // events get sent to self
        },
      });
      channel
        .on("broadcast", { event: EVENT.cardUpdated }, async (event) => {
          const cardId = event.payload?.cardId;
          if (!cardId) return;

          refreshCard(cardId);
        })
        .on("broadcast", { event: EVENT.retroPhaseUpdated }, async (event) => {
          queryClient.invalidateQueries({
            queryKey: retroQuery(retroId).queryKey,
          });
          const phase = event.payload?.phase;
          if (!phase) return;
          if (onNewPhase) onNewPhase(phase);
        })
        .subscribe();
      console.log("Connected to the retro board.");
      return channel;
    },
  });
}
