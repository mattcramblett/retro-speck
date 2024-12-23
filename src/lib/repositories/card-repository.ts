import { db } from "@/db";
import {
  cardsInRetroSpeck as cardTable,
  retroColumnsInRetroSpeck as columnTable,
} from "@/db/schema";
import { Card } from "@/types/model";
import { desc, eq } from "drizzle-orm";

export async function getCards(retroId: number): Promise<Card[]> {
  const results = await db
    .select()
    .from(cardTable)
    .fullJoin(columnTable, eq(columnTable.id, cardTable.retroColumnId))
    .where(eq(columnTable.retroId, retroId))
    .orderBy(desc(cardTable.createdAt));
  return results.map((it) => it.cards).filter((it) => !!it);
}

export async function updateCard(card: Partial<Card>): Promise<Card> {
  // Strip out fields which are not allowed to update
  const forUpdate = {
    ...card,
    participantId: undefined,
    retroColumnId: undefined,
    createdAt: undefined,
    updatedAt: new Date(Date.now()).toISOString(),
  };
  const result = await db
    .update(cardTable)
    .set({ ...forUpdate })
    .where(eq(cardTable.id, card.id))
    .returning();

  const updatedCard = result[0];
  if (!updatedCard) throw "Failed to update";
  return updatedCard as Card;
}

