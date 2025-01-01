"use client";
import { makeBroadcastClient } from "@/clients/broadcast-client";
import { SplashScreen } from "@/components/brand/splash-screen";
import { Title } from "@/components/brand/title";
import { retroQuery } from "@/hooks/retros/use-retro";
import { EVENT } from "@/types/event";
import { Participant } from "@/types/model";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function WaitingRoom({ retroId, participant }: { retroId: number, participant: Participant }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Listen for messages notifying if the participant was admitted. If so, refresh the page.
  useEffect(() => {
    const client = makeBroadcastClient();
    const channel = client.channel(participant.publicId);

    channel.on("broadcast", { event: EVENT.participantAdmitted }, () => {
      console.log("Admitted to the room, refreshing...");
      setIsLoading(true);
      // invalidate any local state in case they've already been in the room once.
      queryClient.invalidateQueries({ queryKey: retroQuery(retroId).queryKey });
      queryClient.invalidateQueries({ queryKey: ["realtime"] });

      // Add delay to help prevent timing issues
      setTimeout(() => {
        router.refresh();
      }, 2000);
    }).subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [retroId, participant.publicId, router, queryClient]);

  return (
    <SplashScreen>
      <div className="flex flex-col items-center">
        <Title className="text-secondary">
          {isLoading ? "Loading retro board..." : "Waiting for the facilitator to let you in!" }
        </Title>
        <LoaderCircle size={32} className="animate-spin text-secondary" />
      </div>
    </SplashScreen>
  );
}
