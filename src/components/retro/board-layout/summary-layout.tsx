import { Title } from "@/components/brand/title";
import { Card, Column, Participant, Retro } from "@/types/model";

export function SummaryLayout({
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialRetro,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialColumns,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialCards,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
