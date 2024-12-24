"use server";
import { Card } from "@/types/model";
import { getCard as findCard, getCards as fetchCards, updateCard as persistCard, createCard as insertCard } from "../repositories/card-repository";
import { assertAccess, assertAccessToCard } from "./authZ-action";
import { getUserOrThrow } from "./authN-actions";

export async function getCard(cardId: number): Promise<Card> {
  assertAccessToCard(cardId);
  return await findCard(cardId);
}

export async function getCards(retroId: number): Promise<Card[]> {
  assertAccess(retroId);
  return await fetchCards(retroId);
}

export async function createCard(columnId: number): Promise<Card> {
  const user = await getUserOrThrow();
  return await insertCard(columnId, user.id);
}

export async function updateCard(card: Partial<Card>): Promise<Card> {
  const cardId = card.id;
  card.content = card.content?.replaceAll(/<|>/g, "");
  if (!cardId) throw "Must set cardId for update";
  assertAccessToCard(cardId);
  return await persistCard(card); 
}

