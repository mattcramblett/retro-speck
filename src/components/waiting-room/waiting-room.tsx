"use client";
import { makeBroadcastClient } from "@/clients/broadcast-client";
import { SplashScreen } from "@/components/brand/splash-screen";
import { Title } from "@/components/brand/title";
import { EVENT } from "@/types/event";
import { Participant } from "@/types/model";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function WaitingRoom({ participant }: { participant: Participant }) {
  const router = useRouter();

  // Listen for messages notifying if the participant was admitted. If so, refresh the page.
  useEffect(() => {
    const client = makeBroadcastClient();
    const channel = client.channel(participant.publicId);

    channel.on("broadcast", { event: EVENT.participantAdmitted }, () => {
      console.log("Admitted to the room, refreshing...");
      router.refresh();
    }).subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [participant.publicId, router]);

  return (
    <SplashScreen>
      <div className="flex flex-col items-center">
        <Title className="text-secondary">
          Waiting for the facilitator to let you in!
        </Title>
        <LoaderCircle size={32} className="animate-spin text-secondary" />
      </div>
    </SplashScreen>
  );
}
