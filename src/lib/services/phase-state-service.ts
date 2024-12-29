"use server";
import { db } from "@/db";
import { eq, desc, sql } from "drizzle-orm";
import {
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
