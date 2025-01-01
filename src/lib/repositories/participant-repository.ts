import { db } from "@/db";
import { participantsInRetroSpeck as participantTable } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { Participant } from "@/types/model";
import { uuidv4 } from "../utils";
import { nextTick } from "process";

export async function getParticipants(retroId: number): Promise<Participant[]> {
  const results = await db
    .select()
    .from(participantTable)
    .where(eq(participantTable.retroId, retroId))
    .orderBy(participantTable.createdAt);
  return results as Participant[];
}

export async function getCurrentParticipant(
  retroId: number,
  userId: string,
): Promise<Participant> {
  const maybeResults = await db
    .select()
    .from(participantTable)
    .where(
      and(
        eq(participantTable.userId, userId),
        eq(participantTable.retroId, retroId),
      ),
    )
    .limit(1);
  if (maybeResults.length) {
    return maybeResults[0] as Participant;
  }
  throw "Participant not found";
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
  const maybeResults = await db
    .select()
    .from(participantTable)
    .where(
      and(
        eq(participantTable.userId, userId),
        eq(participantTable.retroId, retroId),
      ),
    )
    .limit(1);
  if (maybeResults.length) {
    return maybeResults[0] as Participant;
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

export async function updateParticipant(
  participant: Partial<Participant>,
): Promise<Participant> {
  const result = await db
    .update(participantTable)
    .set({
      ...participant,
      // No updates allowed to these fields:
      id: undefined,
      publicId: undefined,
      name: undefined,
      retroId: undefined,
      userId: undefined,
      createdAt: undefined,
    })
    .where(eq(participantTable.id, participant.id || 0))
    .returning();
  if (!result.length) throw "Not found";

  return result[0] as Participant;
}

export async function getParticipant(participantId: number): Promise<Participant> {
  const results = await db
    .select()
    .from(participantTable)
    .where(eq(participantTable.id, participantId));
  const participant = results[0];
  if (!participant) throw "Not found";

  return participant;
}
