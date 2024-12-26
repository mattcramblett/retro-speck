"use client";
import { useEffect, useRef } from "react";
import { makeBroadcastClient } from "@/clients/broadcast-client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";

export function useRealtime({ retroPublicId, retroId }: { retroPublicId: string, retroId: number }) {
  const { onRefreshCard } = useRetroCards({ retroId });

  const { toast } = useToast();
  const client = useRef(makeBroadcastClient());

  const useRealtimeRetro = () =>
    useQuery({
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

  const { data: channel, isError } = useRealtimeRetro();

  if (isError) {
    toast({
      variant: "destructive",
      title: "Unable to connect",
      description:
        "Failed to connect to this retro. Please refresh the page or try again later.",
    });
  }

  // Cleanup realtime websocket connection
  useEffect(() => {
    return () => {
      channel?.unsubscribe();
    };
  }, [channel]);

  return useRealtimeRetro;
}
