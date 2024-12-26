"use client";
import { useEffect, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { makeBroadcastClient } from "@/clients/broadcast-client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useRealtime({ retroPublicId }: { retroPublicId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
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

            // await onRefreshCard(cardId);
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
