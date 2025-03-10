import { db } from "@/db";
import {
  participantsInRetroSpeck as participantTable,
  retrosInRetroSpeck as retroTable,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Participant } from "@/types/model";
import { uuidv4 } from "../utils";
import { EVENT } from "@/types/event";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

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
  retroPublicId,
  retroId,
  userId,
  email,
}: {
  retroPublicId: string;
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
  const participant = results[0] as Participant;

  const supabase = createServerComponentClient({ cookies });
  await supabase.channel(retroPublicId).send({
    type: "broadcast",
    event: EVENT.participantJoined,
    payload: {
      participantId: participant.id,
    },
  });
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

export async function getParticipant(
  participantId: number,
): Promise<Participant> {
  const results = await db
    .select()
    .from(participantTable)
    .where(eq(participantTable.id, participantId));
  const participant = results[0];
  if (!participant) throw "Not found";

  return participant;
}

export async function getParticipantInRetro({
  retroPublicId,
  userId,
}: {
  retroPublicId: string;
  userId: string;
}) {
  const results = await db
    .select()
    .from(participantTable)
    .innerJoin(retroTable, eq(retroTable.id, participantTable.retroId))
    .where(
      and(
        eq(retroTable.publicId, retroPublicId),
        eq(participantTable.userId, userId),
      ),
    );
  if (!results.length) throw "Not found"
  
  return results[0].participants as Participant;
}
