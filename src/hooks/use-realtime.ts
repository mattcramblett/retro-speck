"use client";
import { useRef } from "react";
import { makeBroadcastClient } from "@/clients/broadcast-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { retroQuery } from "./retros/use-retro";

export function useRealtime({
  retroPublicId,
  retroId,
}: {
  retroPublicId: string;
  retroId: number;
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
        .on("broadcast", { event: "cardUpdated" }, async (event) => {
          const cardId = event.payload?.cardId;
          if (!cardId) return;

          refreshCard(cardId);
        })
        .on("broadcast", { event: "retroPhaseUpdated" }, async () => {
          console.log("\n\nReloading...\n\n", retroId);
          queryClient.invalidateQueries({
            queryKey: retroQuery(retroId).queryKey,
          });
        })
        .subscribe();
      console.log("Connected to the retro board.");
      return channel;
    },
  });
  // TODO: unsubsribe from the channel
}
