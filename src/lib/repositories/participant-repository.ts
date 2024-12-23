import { db } from "@/db";
import { participantsInRetroSpeck as participantTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Participant } from "@/types/model";
import { uuidv4 } from "../utils";

export async function getParticipants(retroId: number): Promise<Participant[]> {
  const results = await db
    .select()
    .from(participantTable)
    .where(eq(participantTable.retroId, retroId))
    .orderBy(participantTable.createdAt);
  return results as Participant[];
}

// Find or create by (retroId, userId)
export async function ensureParticipant({
  retroId,
  userId,
  email,
}: {
  retroId: number;
  userId: string;
  email: string;
}): Promise<Participant> {
  const maybeResuls = await db
    .select()
    .from(participantTable)
    .where(
      and(
        eq(participantTable.userId, userId),
        eq(participantTable.retroId, retroId),
      ),
    )
    .limit(1);
  if (maybeResuls.length) {
    return maybeResuls[0] as Participant;
  }

  const results = await db
    .insert(participantTable)
    .values({
      userId,
      name: email,
      retroId,
      isAccepted: false,
      publicId: uuidv4(),
    })
    .returning();
  if (!results.length) throw "Failed to setup participant";
  return results[0] as Participant;
}
