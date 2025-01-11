import { Title } from "@/components/brand/title";
import { Card, Column, Participant, Retro } from "@/types/model";

export function SummaryLayout({
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
  return (
    <div className="flex items-center justify-center size-full">
      <div className="flex flex-col items-center">
        <Title className="text-4xl">This retro is complete.</Title>
        <div className="text-xl font-bold">Thank you for participating!</div>
      </div>
    </div>
  );
}
