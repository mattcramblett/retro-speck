"use server";
import { getRetroByPublicId } from "@/lib/repositories/retro-repository";
import {
  ensureParticipant,
  getParticipants,
} from "@/lib/repositories/participant-repository";
import { getColumns } from "@/lib/repositories/column-repository";
import { getCards } from "@/lib/repositories/card-repository";
import { getUserOrThrow } from "@/lib/server-actions/authN-actions";
import { RetroBoard } from "@/components/retro/retro-board";
import { SplashScreen } from "@/components/brand/splash-screen";
import { Title } from "@/components/brand/title";

const WaitingRoom = () => (
  <SplashScreen>
    <Title className="text-secondary">Waiting for the facilitator to let you in!</Title>
  </SplashScreen>
);

export default async function RetroBoardPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;
  const user = await getUserOrThrow(); // Middleware should assert the user exists.

  const retro = await getRetroByPublicId(publicId);
  const currentParticipant = await ensureParticipant({
    retroId: retro.id,
    email: user.email || "unknown",
    userId: user.id,
  });

  if (!currentParticipant.isAccepted) {
    return WaitingRoom();
  }

  const participants = await getParticipants(retro.id);
  const columns = await getColumns(retro.id);
  const cards = await getCards(retro.id, user.id);

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
