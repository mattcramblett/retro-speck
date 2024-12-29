import { db } from "@/db";
import {
  cardsInRetroSpeck as cardTable,
  retroColumnsInRetroSpeck as columnTable,
  participantsInRetroSpeck as participantTable,
  retrosInRetroSpeck as retroTable,
} from "@/db/schema";
import { Card, getPhase, Retro } from "@/types/model";
import { and, desc, eq } from "drizzle-orm";
import { obfuscate } from "../utils";
import { getCurrentParticipant } from "./participant-repository";

export async function getCard(cardId: number, userId: string): Promise<Card> {
  const result = await db
    .select()
    .from(cardTable)
    .fullJoin(columnTable, eq(columnTable.id, cardTable.retroColumnId))
    .fullJoin(retroTable, eq(retroTable.id, columnTable.retroId))
    .where(eq(cardTable.id, cardId))
    .limit(1);
  if (!result.length) throw "Not found";
  const row = result[0] as { retros: Retro; cards: Card };

  const retro = row.retros as Retro;
  const isDraftState = getPhase(retro.phase).isDraftState;
  const currentParticipant = await getCurrentParticipant(retro.id, userId);

  const card = row.cards as Card;
  if (isDraftState && currentParticipant.id !== card.participantId) {
    return {
      ...card,
      content: obfuscate(card.content),
    };
  }
  return card;
}

export async function getCards(
  retroId: number,
  userId: string,
): Promise<Card[]> {
  const retro = await db
    .select()
    .from(retroTable)
    .where(eq(retroTable.id, retroId))
    .limit(1);
  const isDraftState = getPhase(retro[0]?.phase).isDraftState;
  const results = (await db
    .select()
    .from(cardTable)
    .fullJoin(columnTable, eq(columnTable.id, cardTable.retroColumnId))
    .where(eq(columnTable.retroId, retroId))
    .orderBy(desc(cardTable.createdAt))) as { cards: Card }[];

  const currentParticipant = await getCurrentParticipant(retroId, userId);

  // Obfuscate the card content if needed
  return results
    .map((it) => {
      const card = it.cards; // card from the join
      if (!card) return card;

      if (isDraftState && card?.participantId !== currentParticipant.id) {
        return { ...card, content: obfuscate(card.content) };
      }
      return card;
    })
    .filter((it) => !!it);
}

export async function createCard(
  columnId: number,
  userId: string,
): Promise<Card> {
  // Looking up the participant is inherently an AuthZ check
  const participantResults = await db
    .select({ id: participantTable.id })
    .from(participantTable)
    .fullJoin(retroTable, eq(retroTable.id, participantTable.retroId))
    .fullJoin(columnTable, eq(columnTable.retroId, retroTable.id))
    .where(
      and(
        eq(participantTable.userId, userId),
        eq(participantTable.isAccepted, true),
        eq(columnTable.id, columnId),
      ),
    );
  const participantId = participantResults[0].id;
  const result = await db
    .insert(cardTable)
    .values({
      content: "",
      participantId,
    })
    .returning();
  if (!result.length) throw "failed to create card";

  return result[0] as Card;
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
    .where(eq(cardTable.id, card.id || 0))
    .returning();

  const updatedCard = result[0];
  if (!updatedCard) throw "Failed to update";
  return updatedCard as Card;
}
