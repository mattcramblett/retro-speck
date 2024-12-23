"use server";
import { db } from "@/db";
import { getUserOrThrow } from "./authN-actions";
import {
  participantsInRetroSpeck as participantTable,
  retroColumnsInRetroSpeck as columnTable,
  cardsInRetroSpeck as cardTable,
  retrosInRetroSpeck as retroTable,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";

// If the user is not an accepted participant, throw an exception.
export async function assertAccess(retroId: number) {
  // User must be logged in.
  const user = await getUserOrThrow();

  // User must be an accepted participant to access data.
  const results = await db
    .select()
    .from(participantTable)
    .fullJoin(retroTable, eq(retroTable.id, participantTable.retroId))
    .where(
      and(
        eq(retroTable.id, retroId),
        eq(participantTable.isAccepted, true),
        eq(participantTable.userId, user.id),
      ),
    );
  if (!results.length) throw "Not Found";
}

export async function assertAccessToCard(cardId: number) {
  // User must be logged in.
  const user = await getUserOrThrow();

  // Find the retro and participant based on the card.
  // User must be an accepted participant to access data.
  const results = await db
    .select()
    .from(participantTable)
    .fullJoin(retroTable, eq(retroTable.id, participantTable.retroId))
    .fullJoin(columnTable, eq(columnTable.retroId, retroTable.id))
    .fullJoin(cardTable, eq(cardTable.retroColumnId, columnTable.id))
    .where(
      and(
        eq(cardTable.id, cardId),
        eq(participantTable.isAccepted, true),
        eq(participantTable.userId, user.id),
      ),
    );
  if (!results.length) throw "Not Found";
}

