import { useRetro } from "@/hooks/retros/use-retro";
import { useTopic } from "@/hooks/topics/use-topics";
import { Card, Column, Participant, Retro } from "@/types/model";
import { RetroTopic } from "../topic/retro-topic";
import { RetroColumn } from "../retro-column";
import { Skeleton } from "@/components/ui/skeleton";

export function SequenceLayout({
  initialRetro,
  initialColumns,
  initialCards,
  initialParticipants,
}: {
  initialRetro: Retro;
  initialColumns: Column[];
  initialCards: Card[];
  initialParticipants: Participant[];
}) {
  const retroId = initialRetro.id;
  const { data: retro } = useRetro(retroId);
  const { data: topic, isPending } = useTopic(
    retroId,
    retro?.currentTopicId || 0,
    {
      enabled: !!retro?.currentTopicId,
    },
  );

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex items-center">
        {isPending && <Skeleton className="rounded-xl w-full h-48" />}
        {!isPending && (
          <RetroColumn>
            <RetroTopic retroId={retroId} topicId={topic?.id || 0} />
          </RetroColumn>
        )}
      </div>
    </div>
  );
}
