"use client";
import { useRef } from "react";
import { makeBroadcastClient } from "@/clients/broadcast-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { retroQuery } from "./retros/use-retro";
import { EVENT } from "@/types/event";
import { PhaseName } from "@/types/model";
import { useRefreshTopic } from "./topics/use-topics";
import { useRefreshParticipant } from "./participants/use-participants";

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
  const { mutate: refreshTopic } = useRefreshTopic(retroId);
  const { mutate: refreshParticipant } = useRefreshParticipant(retroId);

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
        .on("broadcast", { event: EVENT.topicUpdated }, async (event) => {
          const topicId = event.payload?.topicId;
          if (!topicId) return;

          refreshTopic(topicId);
        })
        .on("broadcast", { event: EVENT.participantJoined }, async (event) => {
          const participantId = event.payload?.participantId;
          if (!participantId) return;

          refreshParticipant(participantId);
        })
        .on("broadcast", { event: EVENT.participantUpdated }, async (event) => {
          const participantId = event.payload?.participantId;
          if (!participantId) return;

          refreshParticipant(participantId);
        })
        .subscribe();
      console.log("Connected to the retro board.");
      return channel;
    },
  });
}
