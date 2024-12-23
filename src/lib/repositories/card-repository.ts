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
  return results.map(it => it.cards).filter(it => !!it);
}

