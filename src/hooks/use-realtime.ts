"use client";
import { useRef } from "react";
import { makeBroadcastClient } from "@/clients/broadcast-client";
import { useQuery } from "@tanstack/react-query";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";

export function useRealtime({
  retroPublicId,
  retroId,
}: {
  retroPublicId: string;
  retroId: number;
}) {
  const { onRefreshCard } = useRetroCards({ retroId });

  const client = useRef(makeBroadcastClient());

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

          await onRefreshCard(cardId); // FIXME: This holds an old reference to the queries and will not update.
        })
        .subscribe();
      console.log("Connected to the retro board.");
      return channel;
    },
  });
}
