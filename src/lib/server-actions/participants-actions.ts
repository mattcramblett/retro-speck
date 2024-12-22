"use server"
import { db } from "@/db";
import { getUserOrThrow } from "./auth-actions";
import { participantsInRetroSpeck as participantTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Participant } from "@/types/model";

export async function getParticipant(retroId: number): Promise<Participant> {
  const user = await getUserOrThrow();
  const results = await db.select()
    .from(participantTable)
    .where(
      and(
        eq(participantTable.retroId, retroId),
        eq(participantTable.userId, user.id),
      ),
    )
    .limit(1);
  const participant = results[0];
  if (!participant) throw "Not found"
  return participant as Participant;
}
