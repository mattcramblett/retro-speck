"use server";
import { getRetro } from "@/lib/repositories/retro-repository";
import {
  ensureParticipant,
  getParticipants,
} from "@/lib/repositories/participant-repository";
import { getColumns } from "@/lib/repositories/column-repository";
import { getCards } from "@/lib/repositories/card-repository";
import { getUserOrThrow } from "@/lib/server-actions/authN-actions";
import { RetroBoard } from "@/components/retro/retro-board";

const WaitingRoom = () => (
  <h1 className="font-black text-2xl">
    Waiting for the facilitator to let you in
  </h1>
);

export default async function RetroBoardPage({
  params,
}: {
  params: { publicId: string };
}) {
  const { publicId } = await params;
  const user = await getUserOrThrow(); // Middleware should assert the user exists.

  const retro = await getRetro(publicId);
  const currentParticipant = await ensureParticipant({
    retroId: retro.id,
    email: user.email || "unkown",
    userId: user.id,
  });

  if (!currentParticipant.isAccepted) {
    return WaitingRoom();
  }

  const participants = await getParticipants(retro.id);
  const columns = await getColumns(retro.id);
  const cards = await getCards(retro.id);

  return (
    <main className="size-full flex overflow-y-hidden justify-center">
      <RetroBoard
        initialRetro={retro}
        initialColumns={columns}
        initialCards={cards}
        initialParticipants={participants}
      />
    </main>
  );
}
