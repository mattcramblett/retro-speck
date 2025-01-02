"use server";
import { db } from "@/db";
import { eq, desc, sql, is, isNull, and } from "drizzle-orm";
import {
  retrosInRetroSpeck as retroTable,
  cardsInRetroSpeck as cardTable,
  retroColumnsInRetroSpeck as columnTable,
  topicsInRetroSpeck as topicTable,
} from "@/db/schema";
import { Card } from "@/types/model";

export async function handleGroupingPhase(retroId: number) {
  const cards = (
    await db
      .select()
      .from(cardTable)
      .fullJoin(columnTable, eq(columnTable.id, cardTable.retroColumnId))
      .where(eq(columnTable.retroId, retroId))
      .orderBy(desc(cardTable.createdAt))
  ).map((c) => c.cards) as Card[];

  // Create topic for each card in the retro
  await db.transaction(async (tx) => {
    const topics = await tx
      .insert(topicTable)
      .values(
        cards.map((c) => ({
          retroColumnId: c.retroColumnId,
          name: "",
        })),
      )
      .returning();
    // Attach each card to each new topic. Assuming the order is maintained on insertion of topics.
    await Promise.all(
      cards.map((c: Card, idx: number) =>
        tx
          .update(cardTable)
          .set({ topicId: topics[idx].id, updatedAt: sql`NOW()` })
          .where(eq(cardTable.id, c.id)),
      ),
    );
  });
}

export async function handleVotingPhase(retroId: number) {
  // Delete topics with 0 cards
  const toDelete = await db
    .select()
    .from(topicTable)
    .innerJoin(columnTable, eq(topicTable.retroColumnId, columnTable.id))
    .innerJoin(retroTable, eq(retroTable.id, columnTable.retroId))
    .leftJoin(cardTable, eq(cardTable.topicId, topicTable.id))
    .where(and(isNull(cardTable.id), eq(retroTable.id, retroId)));
  const topicIdsToDelete = toDelete.map((it) => it.topics.id);

  // Count all remaining topics and calculate vote allotment
  // Assign vote allotment to participants
}
