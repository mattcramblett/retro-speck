"use server";
import { Card } from "@/types/model";
import { getCard as findCard, getCards as fetchCards, updateCard as persistCard, createCard as insertCard } from "../repositories/card-repository";
import { assertAccess, assertAccessToCard } from "./authZ-action";
import { getUserOrThrow } from "./authN-actions";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function getCard(cardId: number): Promise<Card> {
  await assertAccessToCard(cardId);
  const user = await getUserOrThrow();
  return await findCard(cardId, user.id);
}

export async function getCards(retroId: number): Promise<Card[]> {
  await assertAccess(retroId);
  const user = await getUserOrThrow();
  return await fetchCards(retroId, user.id);
}

export async function createCard(columnId: number): Promise<Card> {
  const user = await getUserOrThrow();
  return await insertCard(columnId, user.id);
}

export async function updateCard(card: Partial<Card>): Promise<Card> {
  const cardId = card.id;
  card.content = card.content?.replaceAll(/<|>/g, "");
  if (!cardId) throw "Must set cardId for update";
  const retroPublicId = await assertAccessToCard(cardId);
  const updatedCard = await persistCard(card); 
  
  const supabase = createServerComponentClient({ cookies })
  await supabase.channel(retroPublicId).send({
    type: 'broadcast',
    event: 'cardUpdated',
    payload: { cardId: card.id },
  });
  return updatedCard;
}

