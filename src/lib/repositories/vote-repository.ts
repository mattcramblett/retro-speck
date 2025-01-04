import { db } from "@/db";
import { votesInRetroSpeck as voteTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getVotes(retroId: number) {
  return await db
    .select()
    .from(voteTable)
    .where(eq(voteTable.retroId, retroId));
}

export async function getParticipantVotes(participantId: number) {
  return await db
    .select()
    .from(voteTable)
    .where(eq(voteTable.participantId, participantId));
}

export async function createVote({
  retroId,
  topicId,
  participantId,
}: {
  retroId: number;
  topicId: number;
  participantId: number;
}) {
  const results = await db
    .insert(voteTable)
    .values({ topicId, participantId, retroId })
    .returning();
  if (!results.length) throw "Failed to create vote";

  return results[0];
}

export async function deleteVote({
  retroId,
  topicId,
  participantId,
}: {
  retroId: number;
  topicId: number;
  participantId: number;
}) {
  const results = await db
    .select()
    .from(voteTable)
    .where(
      and(
        eq(voteTable.retroId, retroId),
        eq(voteTable.topicId, topicId),
        eq(voteTable.participantId, participantId),
      ),
    )
    .limit(1);
  if (!results.length) return;
  const id = results[0].id;
  await db.delete(voteTable).where(eq(voteTable.id, id));
}
